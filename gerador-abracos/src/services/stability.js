export async function generateImage(prompt) {
  const key = process.env.STABILITY_API_KEY;
  if (!key) throw new Error("STABILITY_API_KEY não configurada");

  const res = await fetch("https://api.stability.ai/v1/generation/stable-diffusion-v1-6/text-to-image", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`
    },
    body: JSON.stringify({
      text_prompts: [{ text: prompt }],
      height: 1536,
      width: 1024,
      samples: 1
    })
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(`Stability ${res.status}: ${err.message || res.statusText}`);
  }

  const data = await res.json();
  return data.artifacts[0].base64;
}

