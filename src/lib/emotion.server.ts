export type EmotionScore = { emotion: string; score: number };
export type FaceReading = {
  faceDetected: boolean;
  ranking: EmotionScore[];
  angerLevel: number;
  note: string;
  summary: string;
};

const GATEWAY_URL = "https://ai.gateway.lovable.dev/v1/chat/completions";

const SYSTEM_PROMPT = `You are a facial expression analyst inside a calm anger-management app.
Look at the single face in the photo and rank the visible emotions.
Rules:
- Only judge the visible facial expression. Never guess identity, age, gender, ethnicity or health.
- Rank 4 to 6 emotions from strongest to weakest, scores 0-100, summing to roughly 100.
- angerLevel is 0-10, how much anger/tension the expression shows.
- note: one short, warm, non-judgemental sentence (max 18 words) addressed to the person.
- summary: 2-3 short sentences describing what the expression shows (brow, eyes, jaw, mouth), why the tension number fits, and one simple next step.
- If no clear human face is visible, set faceDetected false and return an empty ranking.`;

const TOOL = {
  type: "function" as const,
  function: {
    name: "report_emotions",
    description: "Report the ranked emotions visible in the face.",
    parameters: {
      type: "object",
      properties: {
        faceDetected: { type: "boolean" },
        ranking: {
          type: "array",
          items: {
            type: "object",
            properties: {
              emotion: { type: "string" },
              score: { type: "number" },
            },
            required: ["emotion", "score"],
            additionalProperties: false,
          },
        },
        angerLevel: { type: "number" },
        note: { type: "string" },
        summary: { type: "string" },
      },
      required: ["faceDetected", "ranking", "angerLevel", "note", "summary"],
      additionalProperties: false,
    },
  },
};

export async function readFaceEmotions(imageDataUrl: string): Promise<FaceReading> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) throw new Error("AI is not configured for this project yet.");

  const response = await fetch(GATEWAY_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "google/gemini-2.5-flash",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        {
          role: "user",
          content: [
            { type: "text", text: "Rank the emotions visible in this face." },
            { type: "image_url", image_url: { url: imageDataUrl } },
          ],
        },
      ],
      tools: [TOOL],
      tool_choice: { type: "function", function: { name: "report_emotions" } },
    }),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    console.error(`AI emotion request failed [${response.status}]: ${errorBody}`);
    if (response.status === 429) throw new Error("Too many reads right now — try again in a moment.");
    if (response.status === 402) throw new Error("AI credits are exhausted for this workspace.");
    throw new Error(`Emotion read failed [${response.status}]: ${errorBody}`);
  }

  const payload = (await response.json()) as {
    choices?: { message?: { tool_calls?: { function?: { arguments?: string } }[]; content?: string } }[];
  };
  const args = payload.choices?.[0]?.message?.tool_calls?.[0]?.function?.arguments;
  if (!args) {
    console.error("AI emotion response had no tool call", JSON.stringify(payload).slice(0, 800));
    throw new Error("The reading came back empty. Please try another photo.");
  }

  const parsed = JSON.parse(args) as Partial<FaceReading>;
  const ranking = (parsed.ranking ?? [])
    .filter((r) => typeof r?.emotion === "string" && Number.isFinite(Number(r?.score)))
    .map((r) => ({ emotion: String(r.emotion), score: Math.max(0, Math.min(100, Math.round(Number(r.score)))) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 6);

  return {
    faceDetected: Boolean(parsed.faceDetected) && ranking.length > 0,
    ranking,
    angerLevel: Math.max(0, Math.min(10, Math.round(Number(parsed.angerLevel ?? 0)))),
    note: typeof parsed.note === "string" ? parsed.note : "",
    summary: typeof parsed.summary === "string" ? parsed.summary : "",
  };
}
