const SYSTEM_PROMPT = `You are an expert ecommerce product discovery analyst specializing in AI commerce optimization and Rezolve's product suite.

Rezolve capabilities for reference:
- Brain Commerce: AI-powered search, merchandising, personalization, recommendations
- Visual Search: search by image/screenshot, inspiration-led discovery, shop-the-look
- Product Enrichment: automated attribute enrichment, catalog structuring, data quality
- Brain Checkout: friction-free checkout, one-click purchase, conversion optimization
- Geolocation: local inventory, store pickup, proximity-based availability
- brainpowa: conversational AI commerce, guided shopping, Q&A for products

Analyze product listings and map discovery friction to Rezolve-relevant opportunities.`

const USER_PROMPT = (listing) => `Analyze this product listing for ecommerce discovery friction:

---
${listing}
---

Return ONLY valid JSON (no markdown, no code blocks, no explanation) with this exact structure:
{
  "overallScore": <integer 0-100, where 100 is perfect discovery readiness>,
  "summary": "<2-3 sentence plain-English summary of the main discovery problems>",
  "dimensions": {
    "searchability": {
      "score": <0-100>,
      "issue": "<one clear sentence describing the problem>",
      "fixes": ["<fix 1>", "<fix 2>", "<fix 3>"]
    },
    "attributeCompleteness": {
      "score": <0-100>,
      "issue": "<one clear sentence>",
      "missing": ["<attr 1>", "<attr 2>", "<attr 3>", "<attr 4>", "<attr 5>"]
    },
    "visualDiscovery": {
      "score": <0-100>,
      "issue": "<one clear sentence>"
    },
    "customerConfidence": {
      "score": <0-100>,
      "issue": "<one clear sentence>"
    },
    "conversionClarity": {
      "score": <0-100>,
      "issue": "<one clear sentence>"
    },
    "alternativePath": {
      "score": <0-100>,
      "issue": "<one clear sentence>"
    },
    "aiCommerceReadiness": {
      "score": <0-100>,
      "issue": "<one clear sentence>"
    }
  },
  "improvedTitle": "<a much better, attribute-rich product title (max 120 chars)>",
  "missingAttributes": ["<attr 1>", "<attr 2>", "<attr 3>", "<attr 4>", "<attr 5>", "<attr 6>"],
  "searchTerms": ["<term 1>", "<term 2>", "<term 3>", "<term 4>", "<term 5>", "<term 6>", "<term 7>", "<term 8>"],
  "improvedBullets": [
    "<benefit-led bullet 1>",
    "<benefit-led bullet 2>",
    "<benefit-led bullet 3>",
    "<benefit-led bullet 4>",
    "<benefit-led bullet 5>"
  ],
  "intentMap": [
    { "intent": "<customer intent type>", "searchBehavior": "<how they actually search>", "gap": "<what the listing is missing>" },
    { "intent": "<customer intent type>", "searchBehavior": "<how they actually search>", "gap": "<what the listing is missing>" },
    { "intent": "<customer intent type>", "searchBehavior": "<how they actually search>", "gap": "<what the listing is missing>" },
    { "intent": "<customer intent type>", "searchBehavior": "<how they actually search>", "gap": "<what the listing is missing>" }
  ],
  "rezolveMap": [
    { "friction": "<specific friction detected>", "capability": "<Rezolve capability name>", "why": "<1 sentence on why this capability solves it>", "badge": "<exact one of: Brain Commerce|Visual Search|Product Enrichment|Brain Checkout|Geolocation|brainpowa>" },
    { "friction": "<specific friction detected>", "capability": "<Rezolve capability name>", "why": "<1 sentence>", "badge": "<badge>" },
    { "friction": "<specific friction detected>", "capability": "<Rezolve capability name>", "why": "<1 sentence>", "badge": "<badge>" },
    { "friction": "<specific friction detected>", "capability": "<Rezolve capability name>", "why": "<1 sentence>", "badge": "<badge>" }
  ],
  "gtm": {
    "customerProblem": "<1-2 sentences on the end-customer pain>",
    "commerceFriction": "<1-2 sentences on the specific listing/discovery problem>",
    "rezolveAngle": "<1-2 sentences on how Rezolve addresses it>",
    "talkTrack": "<a compelling 1-2 sentence partner pitch — the kind of line a sales rep would actually use>",
    "metrics": ["<metric 1>", "<metric 2>", "<metric 3>", "<metric 4>"]
  },
  "enablementAsset": "<1 sentence describing the most useful partner asset to create from this audit>"
}`

export async function auditListing(listingText) {
  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-sonnet-4-6',
      max_tokens: 4000,
      system: SYSTEM_PROMPT,
      messages: [{ role: 'user', content: USER_PROMPT(listingText) }]
    })
  })

  if (!response.ok) {
    const err = await response.text()
    throw new Error(`API error ${response.status}: ${err}`)
  }

  const data = await response.json()
  const text = data.content[0].text.trim()

  try {
    return JSON.parse(text)
  } catch {
    const match = text.match(/\{[\s\S]*\}/)
    if (match) return JSON.parse(match[0])
    throw new Error('Could not parse audit response as JSON')
  }
}

export async function auditCsv(csvText) {
  const lines = csvText.trim().split('\n')
  const headers = lines[0].split(',').map(h => h.trim().replace(/^"|"$/g, ''))
  const rows = lines.slice(1).map(line => {
    const vals = line.split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    return headers.reduce((obj, h, i) => ({ ...obj, [h]: vals[i] || '' }), {})
  })

  const formatted = rows.map((row, i) =>
    `Product ${i + 1}:\n${Object.entries(row).map(([k, v]) => `${k}: ${v}`).join('\n')}`
  ).join('\n\n---\n\n')

  return auditListing(`[CATALOG AUDIT - ${rows.length} products]\n\n${formatted}`)
}

export const SAMPLE_LISTINGS = {
  fashion: {
    label: 'Fashion — Generic listing',
    icon: '👗',
    text: `Product Title: Blue Top
Category: Women's Fashion
Price: ₹999
Description: Stylish blue top for women. Comfortable and trendy. Perfect for casual wear.
Tags: top, blue, women, fashion
Inventory: In stock`
  },
  health: {
    label: 'Health — Under-described supplement',
    icon: '💊',
    text: `Product Title: Vegan Omega Supplement
Category: Health & Wellness
Price: $34.99
Description: Vegan omega-3 heart supplement made with sea buckthorn and algae. Good for health.
Tags: vegan, supplement, omega
Inventory: In stock
Reviews: 4.1/5`
  },
  b2b: {
    label: 'B2B — Missing technical specs',
    icon: '⚙️',
    text: `Product Title: Industrial Filter Unit
Category: B2B / Industrial Equipment
Price: $249
Description: High quality filter unit for industrial use. Durable and reliable. Easy to install.
Tags: filter, industrial, equipment
SKU: FLT-001
Inventory: 47 units`
  }
}
