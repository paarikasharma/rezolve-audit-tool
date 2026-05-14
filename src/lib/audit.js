const SYSTEM_PROMPT = `You are an expert ecommerce product discovery analyst. Analyze product listings for discovery friction and map issues to these capabilities:
Brain Commerce, Visual Search, Product Enrichment, Brain Checkout, Geolocation, brainpowa.
Be direct and specific. Return only valid JSON.`

const USER_PROMPT = (listing) => `Audit this product listing for ecommerce discovery friction:

---
${listing}
---

Return ONLY valid JSON with this exact structure (no markdown, no explanation):
{
  "overallScore": <0-100>,
  "summary": "<2 sentences max on main discovery problems>",
  "dimensions": {
    "searchability":         { "score": <0-100>, "issue": "<one sentence>" },
    "attributeCompleteness": { "score": <0-100>, "issue": "<one sentence>", "missing": ["<attr>","<attr>","<attr>","<attr>"] },
    "visualDiscovery":       { "score": <0-100>, "issue": "<one sentence>" },
    "customerConfidence":    { "score": <0-100>, "issue": "<one sentence>" },
    "conversionClarity":     { "score": <0-100>, "issue": "<one sentence>" },
    "alternativePath":       { "score": <0-100>, "issue": "<one sentence>" },
    "aiCommerceReadiness":   { "score": <0-100>, "issue": "<one sentence>" }
  },
  "improvedTitle": "<attribute-rich title, max 100 chars>",
  "missingAttributes": ["<attr>","<attr>","<attr>","<attr>","<attr>"],
  "searchTerms": ["<term>","<term>","<term>","<term>","<term>","<term>"],
  "improvedBullets": ["<bullet>","<bullet>","<bullet>","<bullet>"],
  "rezolveMap": [
    { "friction": "<specific friction>", "why": "<one sentence>", "badge": "<Brain Commerce|Visual Search|Product Enrichment|Brain Checkout|Geolocation|brainpowa>" },
    { "friction": "<specific friction>", "why": "<one sentence>", "badge": "<badge>" },
    { "friction": "<specific friction>", "why": "<one sentence>", "badge": "<badge>" }
  ],
  "gtm": {
    "customerProblem": "<1 sentence>",
    "commerceFriction": "<1 sentence>",
    "rezolveAngle": "<1 sentence>",
    "talkTrack": "<1 compelling sentence a sales rep would actually say>",
    "metrics": ["<metric>","<metric>","<metric>"]
  },
  "enablementAsset": "<1 sentence on what partner asset to create>"
}`

export async function auditListing(listingText) {
  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1800,
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
    throw new Error('Could not parse response. Try again.')
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
  return auditListing(`[CATALOG - ${rows.length} products]\n\n${formatted}`)
}

export const SAMPLE_LISTINGS = {
  fashion: {
    label: 'Fashion — Generic listing',
    icon: '👗',
    text: `Title: Navy Wrap Dress\nCategory: Women's Fashion\nPrice: £45.00\nDescription: Stylish navy dress for women. Comfortable and elegant. Perfect for casual wear.\nTags: dress, navy, women, fashion\nInventory: In stock`
  },
  health: {
    label: 'Health — Under-described supplement',
    icon: '💊',
    text: `Title: Vegan Omega Supplement\nCategory: Health & Wellness\nPrice: £28.99\nDescription: Vegan omega-3 heart supplement made with sea buckthorn and algae. Good for health.\nTags: vegan, supplement, omega\nInventory: In stock\nReviews: 4.1/5`
  },
  b2b: {
    label: 'B2B — Missing technical specs',
    icon: '⚙️',
    text: `Title: Industrial Filter Unit\nCategory: B2B / Industrial Equipment\nPrice: £199\nDescription: High quality filter unit for industrial use. Durable and reliable. Easy to install.\nTags: filter, industrial, equipment\nSKU: FLT-001\nInventory: 47 units`
  }
}
