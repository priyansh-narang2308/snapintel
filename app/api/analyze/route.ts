import { NextRequest, NextResponse } from "next/server";
import { analyzeImageWithSerpApi } from "@/lib/serpapi";
import { generateVerdictWithOpenRouter } from "@/lib/openrouter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { imageUrl, demoKey } = body;

    if (!imageUrl && !demoKey) {
      return NextResponse.json(
        { error: "Please provide an image URL or choose a demo showcase." },
        { status: 400 },
      );
    }

    // Step 1: Execute SerpApi pipeline (cached & credit-protected)
    const serpResult = await analyzeImageWithSerpApi(imageUrl || "", demoKey);

    // Step 2: Synthesize evidence with OpenRouter (free LLM model)
    const aiVerdict = await generateVerdictWithOpenRouter(serpResult);

    // Step 3: Return complete intelligence dossier
    return NextResponse.json({
      success: true,
      data: {
        serp: serpResult,
        verdict: aiVerdict,
      },
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("API /api/analyze error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze visual asset." },
      { status: 500 },
    );
  }
}
