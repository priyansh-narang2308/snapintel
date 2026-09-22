/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from "next/server";
import { analyzeImageWithSerpApi, ScanTier } from "@/lib/serpapi";
import { generateVerdictWithOpenRouter } from "@/lib/openrouter";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      imageUrl,
      demoKey,
      scanTier = "smart",
      compareImageUrl,
      compareDemoKey,
    } = body;

    if (!imageUrl && !demoKey && !body.imageBase64) {
      return NextResponse.json(
        { error: "Please provide an image URL, screenshot upload, or choose a demo showcase." },
        { status: 400 },
      );
    }

    const tier: ScanTier =
      scanTier === "quick" || scanTier === "deep" ? scanTier : "smart";

    // Primary product analysis
    const serpResultA = await analyzeImageWithSerpApi({
      imageUrl: imageUrl || "",
      imageBase64: body.imageBase64,
      demoKey,
      scanTier: tier,
    });
    const aiVerdictA = await generateVerdictWithOpenRouter(serpResultA);

    // Optional comparison product analysis
    let comparison = null;
    if (compareImageUrl || compareDemoKey || body.compareImageBase64) {
      const serpResultB = await analyzeImageWithSerpApi({
        imageUrl: compareImageUrl || "",
        imageBase64: body.compareImageBase64,
        demoKey: compareDemoKey,
        scanTier: tier,
      });
      const aiVerdictB = await generateVerdictWithOpenRouter(serpResultB);

      // Deterministic trade-off calculation
      const priceA = parseFloat(
        serpResultA.shopping.lowestPrice?.replace(/[^0-9.]/g, "") || "0",
      );
      const priceB = parseFloat(
        serpResultB.shopping.lowestPrice?.replace(/[^0-9.]/g, "") || "0",
      );

      const priceWinner =
        priceA > 0 && priceB > 0
          ? priceA <= priceB
            ? "A"
            : "B"
          : priceA > 0
          ? "A"
          : "B";

      const demandScoreA = serpResultA.trends?.interestScore || 50;
      const demandScoreB = serpResultB.trends?.interestScore || 50;
      const demandWinner = demandScoreA >= demandScoreB ? "A" : "B";

      const webScoreA =
        serpResultA.signals.webEvidence.level === "POSITIVE"
          ? 3
          : serpResultA.signals.webEvidence.level === "MIXED"
          ? 2
          : 1;
      const webScoreB =
        serpResultB.signals.webEvidence.level === "POSITIVE"
          ? 3
          : serpResultB.signals.webEvidence.level === "MIXED"
          ? 2
          : 1;
      const reviewWinner = webScoreA >= webScoreB ? "A" : "B";

      let recommendation = "";
      if (priceWinner === "A" && reviewWinner === "A") {
        recommendation = `${serpResultA.entity.title} is both lower-priced and has stronger community reviews. Clear value winner.`;
      } else if (priceWinner === "B" && reviewWinner === "B") {
        recommendation = `${serpResultB.entity.title} offers better market pricing with superior review sentiment. Clear value winner.`;
      } else {
        recommendation = `${serpResultA.entity.title} offers ${priceWinner === "A" ? "better pricing" : "higher review confidence"}, while ${serpResultB.entity.title} leads on ${demandWinner === "B" ? "search interest momentum" : "price"}.`;
      }

      comparison = {
        itemB: {
          serp: serpResultB,
          verdict: aiVerdictB,
        },
        tradeoff: {
          priceWinner,
          priceDifference: Math.abs(priceA - priceB).toFixed(2),
          demandWinner,
          reviewWinner,
          recommendation,
        },
      };
    }

    return NextResponse.json({
      success: true,
      data: {
        serp: serpResultA,
        verdict: aiVerdictA,
        comparison,
      },
    });
  } catch (error: any) {
    console.error("API /api/analyze error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to analyze visual asset." },
      { status: 500 },
    );
  }
}
