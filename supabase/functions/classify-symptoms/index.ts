import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { symptoms, age, gender, duration, painLevel, chronicDiseases, emergencyFlags, language } = await req.json();

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const hasEmergencyFlag = emergencyFlags?.chestPain || emergencyFlags?.breathingDifficulty || emergencyFlags?.severeBleeding || emergencyFlags?.lossOfConsciousness;

    const systemPrompt = `You are an AI medical specialty classifier. Based on the patient's symptoms, classify them into the most suitable MEDICAL SPECIALTY.

You MUST respond using the "classify_condition" tool. Do NOT respond with plain text.

Rules:
- Focus on SPECIALTY classification, not disease diagnosis
- Consider age, gender, pain level, duration, and chronic diseases
- Emergency flags (chest pain, breathing difficulty, severe bleeding, loss of consciousness) should increase severity
- Severity levels: "high" (go to ER immediately), "medium" (visit a doctor soon), "low" (pharmacy or home care)
- Confidence is 0-100 percentage
- Also suggest relevant lab tests or radiology scans that might be needed
- Respond in ${language === "ar" ? "Arabic" : "English"}

Specialty examples: Cardiology, Ophthalmology, Orthopedics, Dermatology, Internal Medicine, Pediatrics, Neurology, ENT, Pulmonology, Emergency Medicine, Gynecology, Urology, Psychiatry, General Surgery, Endocrinology, Gastroenterology, Pharmacy Care`;

    const userMessage = `Patient symptoms: ${symptoms}
Age: ${age || "not provided"}
Gender: ${gender || "not provided"}
Duration: ${duration || "not provided"}
Pain level: ${painLevel}/10
Chronic diseases: ${chronicDiseases || "none"}
Emergency flags: ${hasEmergencyFlag ? `Chest pain: ${emergencyFlags.chestPain}, Breathing difficulty: ${emergencyFlags.breathingDifficulty}, Severe bleeding: ${emergencyFlags.severeBleeding}, Loss of consciousness: ${emergencyFlags.lossOfConsciousness}` : "None"}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userMessage },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "classify_condition",
              description: "Classify the patient's condition into a medical specialty with severity assessment and suggested tests",
              parameters: {
                type: "object",
                properties: {
                  specialty: { type: "string", description: "The recommended medical specialty" },
                  severity: { type: "string", enum: ["high", "medium", "low"], description: "Severity level" },
                  nextStep: { type: "string", description: "Suggested next step for the patient" },
                  confidence: { type: "number", description: "Confidence score 0-100" },
                  suggestedTests: { type: "array", items: { type: "string" }, description: "Suggested lab tests or radiology scans e.g. CBC, X-Ray, MRI, Blood Sugar, Urine Analysis, CT Scan, ECG" },
                },
                required: ["specialty", "severity", "nextStep", "confidence", "suggestedTests"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "classify_condition" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again shortly." }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds." }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI error:", response.status, text);
      throw new Error("AI classification failed");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) throw new Error("No tool call in AI response");

    const result = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("classify-symptoms error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
