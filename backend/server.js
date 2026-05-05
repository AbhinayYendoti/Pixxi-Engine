require('dotenv').config();
const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 8080;

// ── CORS ──────────────────────────────────────────────────────────
// Dynamically allow Vercel production URL + localhost for dev
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
];

// Add the production frontend URL from Render environment variables
if (process.env.FRONTEND_URL) {
  allowedOrigins.push(process.env.FRONTEND_URL.replace(/\/+$/, '')); // strip trailing slash
}

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (server-to-server, curl, health checks)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    console.warn(`⛔ CORS blocked origin: ${origin}`);
    return callback(new Error(`CORS: origin ${origin} not allowed`));
  },
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

// Parse JSON bodies AFTER CORS middleware
app.use(express.json());

// ── Helpers ───────────────────────────────────────────────────────
// Extract ASIN + regional Amazon domain from any Amazon URL
const extractAmazonDetails = (urlString) => {
  // Fix missing 'https://' if the user copy-pasted a lazy link
  let cleanUrl = urlString.trim();
  if (!cleanUrl.startsWith('http')) {
    cleanUrl = 'https://' + cleanUrl;
  }

  // Extract the 10-character ASIN
  const asinMatch = cleanUrl.match(/(?:dp|o|asin|product|gp\/product)\/([A-Z0-9]{10})/i);
  const asin = asinMatch ? asinMatch[1].toUpperCase() : null;

  // Extract the correct Amazon domain (amazon.com, amazon.in, amazon.co.uk)
  const domainMatch = cleanUrl.match(/amazon\.([a-z.]+)/i);
  const domain = domainMatch ? domainMatch[0] : 'amazon.com';

  return { asin, domain };
};

// ── Health Check ──────────────────────────────────────────────────
// Render pings this to keep the service alive
app.get('/', (_req, res) => {
  res.json({ status: 'ok', service: 'Pixii Engine API', version: '1.0.0' });
});

// ── Main Analysis Endpoint ────────────────────────────────────────
app.post('/api/analyze', async (req, res) => {
  const { url } = req.body;

  if (!url) return res.status(400).json({ error: 'URL is required.' });

  const { asin, domain } = extractAmazonDetails(url);
  if (!asin) return res.status(400).json({ error: 'Invalid Amazon URL. Could not find ASIN.' });

  try {
    // STEP 1: Rainforest API — scrape live product data
    console.log(`[1/2] Scraping ASIN: ${asin} on ${domain}...`);
    const rainforestRes = await axios.get('https://api.rainforestapi.com/request', {
      params: {
        api_key: process.env.RAINFOREST_API_KEY,
        type: 'product',
        amazon_domain: domain,
        asin,
        output: 'json',
      },
      timeout: 20000,
    });

    const product = rainforestRes.data.product;
    if (!product) return res.status(404).json({ error: 'Product not found.' });

    const reviews = (product.top_reviews || [])
      .slice(0, 50)
      .map(r => r.body)
      .filter(Boolean);

    // 🚨 Zero-Review Fallback (Graceful Degradation)
    if (reviews.length === 0) {
      console.log('⚠️  No reviews found for this ASIN variation. Injecting fallback context.');
      reviews.push(
        'SYSTEM NOTE: No customer reviews available for this specific variation.',
        'Generate the purchase criteria based on standard consumer expectations for this product category.',
        'Generate a strategy focused on improving the title, images, and description based on e-commerce best practices.'
      );
    }

    const scrapedContext = JSON.stringify({
      title: product.title,
      price: product.buybox_winner?.price?.value ?? 'N/A',
      bsr: product.bestsellers_rank_flat ?? 'N/A',
      category: product.categories?.[0]?.name ?? 'N/A',
      rating: product.rating ?? 'N/A',
      ratings_total: product.ratings_total ?? 'N/A',
      customer_reviews: reviews,
    });

    // STEP 2: NVIDIA NIM — send to Llama 3.1 8B for structured analysis
    console.log(`[2/2] Sending to NVIDIA NIM (${reviews.length} reviews)...`);
    const nvidiaRes = await axios.post(
      'https://integrate.api.nvidia.com/v1/chat/completions',
      {
        model: 'meta/llama-3.1-8b-instruct',
        messages: [
          {
            role: 'system',
            content: `You are an elite e-commerce data analyst. Given raw Amazon product data and reviews:
1. Generate exactly 9 competitors for this category based on BSR/price logic. One entry MUST be the analyzed product with is_main: true.
2. Find the top 3 purchase criteria from reviews (positive or negative themes).
3. Generate a highly actionable strategy to fix the listing based on the negative reviews. CRITICAL: You must ONLY suggest changes to the Amazon listing's Title, Bullet Points, or Images (e.g., 'Add a badge to image #2 saying X'). Do NOT suggest changing or reformulating the physical product.
4. Estimate projected ROI from implementing the fix.

RESPOND WITH ONLY VALID JSON. NO MARKDOWN. NO PREAMBLE. Schema:
{
  "competitors": [{ "id": 1, "name": "String", "price": Number, "reviews": Number, "estimated_revenue": Number, "is_main": Boolean }],
  "action_response": {
    "purchase_criteria": [{ "sentiment": "positive" | "negative", "topic": "String", "percentage": Number }],
    "action": "String",
    "estimated_roi_percentage": Number,
    "estimated_roi_dollars": Number
  }
}`,
          },
          { role: 'user', content: scrapedContext },
        ],
        temperature: 0.2,
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.NVIDIA_API_KEY}`,
          'Content-Type': 'application/json',
        },
        timeout: 60000,
      }
    );

    // Parse the LLM response safely
    const rawString = nvidiaRes.data.choices[0].message.content;

    // X-Ray: see exactly what the AI generated
    console.log('\n--- RAW LLM RESPONSE ---');
    console.log(rawString);
    console.log('------------------------\n');

    // Extract ONLY the JSON object
    const jsonMatch = rawString.match(/\{[\s\S]*\}/);

    if (!jsonMatch) {
      throw new Error('LLM did not return a valid JSON object. It returned text.');
    }

    try {
      const finalData = JSON.parse(jsonMatch[0]);
      console.log('✅ Analysis complete. Sending to frontend.');
      res.status(200).json(finalData);
    } catch (parseError) {
      console.error('❌ JSON Parse Failed. The AI generated invalid JSON formatting.');
      console.error('Attempted to parse:', jsonMatch[0].substring(0, 500));
      throw parseError;
    }

  } catch (err) {
    console.error('Error:', err?.response?.data || err.message);
    res.status(500).json({
      error: 'Analysis failed.',
      details: err?.response?.data || err.message,
    });
  }
});

// ── Start ─────────────────────────────────────────────────────────
app.listen(PORT, () => console.log(`🚀 Pixii Engine running on port ${PORT}`));
