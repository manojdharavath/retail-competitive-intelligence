const { GoogleGenerativeAI } = require('@google/generative-ai');

const queryGeminiAI = async (question, contextData) => {
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key') {
    console.warn('GEMINI_API_KEY is not configured. Returning deterministic analytical answer based on MongoDB data.');
    return generateFallbackAnswer(question, contextData);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `
You are a Retail Competitive Intelligence Assistant for a multi-brand benchmark platform comparing Intel, AMD, Qualcomm, and Apple across OEMs (Dell, HP, Lenovo, Acer, Asus, MSI, Apple) and retailers (Newegg, Mercado Libre).

User Question: "${question}"

Real Database Analytics Context (Extracted directly from MongoDB):
${JSON.stringify(contextData, null, 2)}

Instructions:
1. Answer the question directly using ONLY the supplied database numbers above.
2. Do NOT invent or hallucinate any numbers, prices, percentages, or brands.
3. Keep your response concise, clear, and professional (2-4 bullet points or short paragraphs).
4. Clearly state which brand or OEM leads or lags based strictly on the context data.
`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error('Gemini API Error:', error.message);
    return generateFallbackAnswer(question, contextData);
  }
};

const generateFallbackAnswer = (question, contextData) => {
  const { metric, data } = contextData;
  
  if (metric === 'share_of_shelf') {
    const top = data[0];
    return `Based on database records, **${top?.brand || 'N/A'}** holds the largest Share of Shelf with **${top?.percentage || 0}%** of listed products (${top?.productCount || 0} items). The total catalog spread includes ${data.map(d => `${d.brand}: ${d.percentage}%`).join(', ')}.`;
  }
  
  if (metric === 'average_discount') {
    const top = [...data].sort((a, b) => b.avgDiscount - a.avgDiscount)[0];
    return `Based on current promotional analytics, **${top?.brand}** has the highest average discount at **${top?.avgDiscount}%** (with ${top?.discountedProducts} products on sale). Comparative discounts: ${data.map(d => `${d.brand}: ${d.avgDiscount}%`).join(', ')}.`;
  }

  if (metric === 'pricing') {
    const highest = [...data].sort((a, b) => b.avgPrice - a.avgPrice)[0];
    const lowest = [...data].sort((a, b) => a.avgPrice - b.avgPrice)[0];
    return `Based on active pricing data, **${highest?.brand}** has the highest average price point at **$${highest?.avgPrice?.toLocaleString()}**, while **${lowest?.brand}** has the lowest average price point at **$${lowest?.avgPrice?.toLocaleString()}**.`;
  }

  if (metric === 'compliance') {
    const top = [...data].sort((a, b) => b.complianceScore - a.complianceScore)[0];
    return `In terms of retail listing compliance (S1-S2 listing checks and P1-P5 product page checks, weighted 85% Notebook / 15% Desktop), **${top?.brand}** ranks highest with a compliance score of **${top?.complianceScore}%**. Full scores: ${data.map(d => `${d.brand}: ${d.complianceScore}%`).join(', ')}.`;
  }

  if (metric === 'competitiveness') {
    const top = data[0];
    return `According to the Composite Brand Competitiveness Index (synthesizing pricing, shelf visibility, audit compliance, banner share, and search voice), **${top?.brand}** leads overall with a score of **${top?.competitivenessScore}/100**. Full scores: ${data.map(d => `${d.brand}: ${d.competitivenessScore}`).join(', ')}.`;
  }

  if (metric === 'banners') {
    const top = data[0];
    return `In homepage banner tracking, **${top?.brand}** leads with **${top?.bannerShare}%** share of prime retail banner real estate (${top?.bannerCount} banners). Banner share spread: ${data.map(d => `${d.brand}: ${d.bannerShare}%`).join(', ')}.`;
  }

  return `Here are the latest database analytics regarding your query:\n\n${JSON.stringify(contextData.data, null, 2)}`;
};


module.exports = { queryGeminiAI };
