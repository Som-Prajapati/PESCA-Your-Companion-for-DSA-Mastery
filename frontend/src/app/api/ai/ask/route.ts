import { NextRequest, NextResponse } from "next/server";

// Helper function to make error messages friendlier
function friendly(err: unknown) {
  if (typeof err === "string") return err;
  if (err && typeof err === "object" && "message" in err) {
    return (err as any).message || "Unknown error";
  }
  return "Something went wrong talking to the model.";
}

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing prompt" }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Missing GEMINI_API_KEY" }, { status: 500 });
    }

    // ---
    // THE FIX IS HERE: Use the "latest" tags
    // ---
    const modelCandidates = [
    //   "gemini-1.5-flash-latest", // Correct: Use the "latest" tag
    //   "gemini-1.5-pro-latest",   // Correct: Use this as the fallback
        "gemini-2.0-flash-exp", // Latest experimental
        "gemini-2.5-flash", // Stable fallback
        "gemini-2.5-pro", // Pro version
    ];
    // ---

    let replyText = "";
    let lastErr: any = null;

    for (const model of modelCandidates) {
      try {
        // Use v1 for stability
        const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`;

        const res = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{
              role: "user",
              parts: [{ text: prompt }]
            }],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 2048,
              topP: 0.95,
            }
          }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error(`Model ${model} failed:`, errorText);
          lastErr = errorText;
          continue; // Try the next model
        }

        const data = await res.json();

        // Extract text from response
        if (data?.candidates?.[0]?.content?.parts) {
          replyText = data.candidates[0].content.parts
            .map((p: any) => p?.text || "")
            .join("");
        }

        if (replyText) break; // Success!

      } catch (e) {
        console.error(`Error with model ${model}:`, e);
        lastErr = e;
        continue; // Try the next model
      }
    }

    if (!replyText) {
      // All models failed, return the last error
      return NextResponse.json(
        { error: "All models failed. " + friendly(lastErr) },
        { status: 502 }
      );
    }

    return NextResponse.json({ text: replyText });

  } catch (e: any) {
    console.error("API route error:", e);
    return NextResponse.json({ error: friendly(e) }, { status: 500 });
  }
}