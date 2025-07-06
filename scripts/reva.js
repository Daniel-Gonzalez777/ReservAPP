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

  const geminiApiKey = "TU_API_KEY"; // reemplaza con la real

  try {
    const lugares = JSON.parse(localStorage.getItem("lugares")) || [];

    const promptBase = generarPromptConLugares(lugares);

    const response = await callGemini(text, geminiApiKey, promptBase);
    responseCard.textContent = response;
  } catch (error) {
    responseCard.textContent = "Error al conectar con REVA.";
    console.error(error);
  } finally {
    loader.style.display = 'none';
  }
}

function generarPromptConLugares(lugares) {
  if (!lugares.length) {
    return `
      Eres REVA, la asistente virtual de ReservApp.
      Actualmente no hay lugares disponibles. Indica al usuario que lo intente más tarde.
    `;
  }

  const lista = lugares.map((l, i) => {
    return `${i + 1}. ${l.nombre} – ${l.descripcion}, capacidad para ${l.capacidad}, ubicado en ${l.ubicacion}. Precio: ${l.precio}.`;
  }).join('\n');

  return `
Eres REVA, la asistente virtual de ReservApp. Solo puedes responder preguntas relacionadas con la recomendación de lugares registrados en el sistema.

Aquí están los lugares disponibles:

${lista}

Si alguien pregunta por sitios para eventos, reuniones o encuentros, sugiere lugares de esta lista según corresponda. Si la pregunta no tiene relación con recomendar un lugar, responde:

"Lo siento, soy REVA y solo puedo ayudarte recomendando lugares disponibles en ReservApp."

Responde siempre con amabilidad y precisión.
`;
}

async function callGemini(userText, apiKey, promptBase) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

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

document.addEventListener('DOMContentLoaded', () => {
  const btnCerrarSesion = document.getElementById('cerrarSesionBtn');
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('usuarioActual');
      window.location.href = 'ingresar.html';
    });
  }
});