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

  const promptBase = `
Eres REVA, la asistente virtual de ReservApp.

Solo puedes responder preguntas relacionadas con recomendaciones de espacios disponibles en nuestra plataforma para reuniones, eventos o actividades.

Los únicos lugares que puedes sugerir son los siguientes:

1. Sala de Conferencias A – Amplio espacio para presentaciones, 20 personas.
2. Oficina Privada 1 – Perfecta para reuniones ejecutivas, 8 personas.
3. Espacio Coworking – Ambiente colaborativo, 15 personas. (NO disponible)
4. Sala de Reuniones B – Sala moderna con pizarra digital, 12 personas.
5. Auditorio Principal – Ideal para eventos masivos, 100 personas.
6. Sala Creativa – Espacio para brainstorming, 10 personas. (NO disponible)

Tu trabajo es detectar si el usuario quiere una sala o lugar para reunirse, trabajar, presentar, hacer eventos o pasar tiempo con alguien. Si es así, responde recomendando uno o varios lugares de la lista anterior, según el caso.

Si la pregunta no tiene ninguna relación con recomendar un espacio de ReservApp, responde amablemente:

"Lo siento, soy REVA y solo puedo ayudarte recomendando lugares disponibles en ReservApp."

Mantén siempre un tono amable y profesional.
`;

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
