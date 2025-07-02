async function sendToGemini() {
  const text = document.getElementById('inputText').value.trim();
  const responseCard = document.getElementById('geminiResponse');
  const loader = document.getElementById('loader');

  if (!text) {
    responseCard.textContent = "Por favor, escribe una pregunta.";
    return;
  }

  loader.style.display = 'block';
  responseCard.textContent = "";

  const geminiApiKey = "AIzaSyCqRRtLSaWmA1Ad-T6x-feOgPX_uBvhZyU";

  try {
    const response = await callGemini(text, geminiApiKey);
    responseCard.textContent = response;
  } catch (error) {
    responseCard.textContent = "Error al conectar con REVA.";
    console.error(error);
  } finally {
    loader.style.display = 'none';
  }
}

async function callGemini(userText, apiKey) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

  const promptBase = `Eres REVA, la asistente virtual de ReservApp. Esta es una plataforma donde los usuarios pueden reservar salas y espacios para reuniones, eventos o actividades. Tu función es ayudar al usuario con dudas sobre el sistema, mostrar disponibilidad, recomendar lugares según sus necesidades y guiarlo amablemente. Usa un lenguaje claro, directo y útil. Si puedes, sugiere acciones.`;

  const body = {
    contents: [
      { role: "user", parts: [{ text: promptBase }] },
      { role: "user", parts: [{ text: userText }] }
    ]
  };

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sin respuesta válida de REVA.";
}

window.sendToGemini = sendToGemini;
