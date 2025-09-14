export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method not allowed" });
  }

  const { message } = req.body;

  try {
    const HF_MODEL = "gpt2";
    const HF_API = "https://api-inference.huggingface.co/models/" + HF_MODEL;

    const response = await fetch(HF_API, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ inputs: message }),
    });

    const data = await response.json();

    let reply = "no response";
    if (Array.isArray(data) && data[0]?.generated_text) {
      reply = data[0].generated_text.replace(message, "").trim();
    } else if (data.error) {
      reply = "⚠️ API error: " + data.error;
    }

    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ reply: "❌ Error connecting to HuggingFace API" });
  }
}