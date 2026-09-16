import { SerpApiAnalysisResult } from "./serpapi";

export interface OpenRouterVerdict {
  verdict: "BUY" | "WAIT" | "AVOID";
  executiveBrief: string;
  keyDrivers: string[];
  timingAdvice: string;
  modelUsed: string;
}

export async function generateVerdictWithOpenRouter(
  serpData: SerpApiAnalysisResult,
): Promise<OpenRouterVerdict> {
  const apiKey = process.env.OPENROUTER_API_KEY;
  const model =
    process.env.OPENROUTER_MODEL || "inclusionai/ling-3.0-flash-vl:free";

  // If no OpenRouter key is configured, rely directly on the deterministic intelligence
  if (!apiKey) {
    return generateDeterministicVerdict(serpData);
  }

  // Pass only the normalized, structured intelligence object
  const normalizedContext = {
    product: {
      name: serpData.entity.title,
      category: serpData.entity.category || "Consumer Product",
    },
    pricing: {
      lowest: serpData.shopping.lowestPrice,
      median: serpData.shopping.medianPrice,
      highest: serpData.shopping.highestPrice,
      deltaVsMedian: serpData.signals.priceCoverage.differenceFromMedian,
      merchantCount: serpData.shopping.merchantCount,
    },
    signals: {
      identification: serpData.signals.identification.level,
      priceSignal: serpData.signals.priceCoverage.priceSignal,
      recurringPros: serpData.signals.webEvidence.recurringPros,
      recurringConcerns: serpData.signals.webEvidence.recurringConcerns,
      demandMomentum: serpData.signals.demandSignal.level,
    },
    preCalculatedDecision: {
      verdict: serpData.decision.verdict,
      deterministicWhy: serpData.decision.oneLinerWhy,
    },
  };

  const prompt = `
You are the senior market analyst for SnapIntel.
You have been provided with deterministic market signals calculated from SerpApi search engines (Google Lens, Google Shopping, Google Search, Google Trends).

DATA DOSSIER:
${JSON.stringify(normalizedContext, null, 2)}

TASK:
Do NOT invent new data or contradict the preCalculatedDecision verdict (${serpData.decision.verdict}).
Your role is to EXPLAIN the market intelligence clearly and concisely for an executive decision maker.

Return ONLY a valid JSON object matching this schema:
{
  "verdict": "${serpData.decision.verdict}",
  "executiveBrief": "A sharp, 2-sentence synthesis explaining why the evidence supports this decision.",
  "keyDrivers": [
    "Pricing spread and best purchasing option",
    "Community consensus regarding performance vs recurring flaws",
    "Demand trajectory and seasonal or inventory timing"
  ],
  "timingAdvice": "Actionable advice on whether to buy today or wait for specific discount catalysts."
}
`;

  try {
    const res = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://snapintel.app",
        "X-Title": "SnapIntel",
      },
      body: JSON.stringify({
        model: model,
        messages: [{ role: "user", content: prompt }],
        temperature: 0.2,
      }),
    });

    if (!res.ok) {
      console.warn("OpenRouter request failed:", res.status, await res.text());
      return generateDeterministicVerdict(serpData);
    }

    const data = await res.json();
    const content = data.choices?.[0]?.message?.content || "";
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        verdict: serpData.decision.verdict,
        executiveBrief: parsed.executiveBrief || serpData.decision.deterministicRationale,
        keyDrivers: Array.isArray(parsed.keyDrivers) && parsed.keyDrivers.length > 0
          ? parsed.keyDrivers
          : serpData.decision.keyDrivers,
        timingAdvice: parsed.timingAdvice || "Act according to observed stock thresholds.",
        modelUsed: model,
      };
    }

    return generateDeterministicVerdict(serpData);
  } catch (err) {
    console.error("OpenRouter synthesis error:", err);
    return generateDeterministicVerdict(serpData);
  }
}

function generateDeterministicVerdict(
  serpData: SerpApiAnalysisResult,
): OpenRouterVerdict {
  const { decision, signals, shopping } = serpData;

  const timingAdvice =
    decision.verdict === "BUY"
      ? `High retailer inventory and favorable pricing (${shopping.lowestPrice}) make current purchasing timing optimal.`
      : decision.verdict === "WAIT"
      ? `Price is currently hovering near median; hold for upcoming promotional cycles or clearance drops.`
      : `Avoid purchase until reported hardware or batch caveats are officially addressed.`;

  return {
    verdict: decision.verdict,
    executiveBrief: decision.deterministicRationale,
    keyDrivers: decision.keyDrivers.length > 0
      ? decision.keyDrivers
      : [
          `Observed lowest price is ${shopping.lowestPrice} across ${shopping.merchantCount} tracked retailers (${signals.priceCoverage.differenceFromMedian}).`,
          signals.webEvidence.summary,
          `Consumer demand momentum is ${signals.demandSignal.level.toLowerCase()}.`,
        ],
    timingAdvice,
    modelUsed: "SnapIntel Deterministic Decision Engine",
  };
}
