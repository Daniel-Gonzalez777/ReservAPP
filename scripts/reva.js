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
  const reservas = JSON.parse(localStorage.getItem("reservas")) || [];

  if (!lugares.length) {
    return `
Eres REVA, la asistente virtual de ReservApp.

Actualmente no hay lugares disponibles. Si alguien te hace una pregunta, responde:
"En este momento no tengo lugares disponibles para recomendar."

⚠️ No inventes nombres de lugares ni uses información externa.
Solo responde con base en los datos del sistema.
`;
  }

  const lista = lugares.map((l, i) => {
   const fechasReservadas = reservas
  .filter(r => r.lugarId === l.id)
  .map(r => `📅 ${r.fecha}`)
  .join('\n    - ');


    const estado = l.disponible ? "Disponible" : "Ocupado";

    return `${i + 1}. ${l.nombre}
    - Descripción: ${l.descripcion}
    - Ubicación: ${l.ubicacion}
    - Capacidad: ${l.capacidad}
    - Precio: ${l.precio}
    - Estado: ${estado}
    ${fechasReservadas ? `- Fechas reservadas:\n    - ${fechasReservadas}` : "- Sin fechas reservadas"}`;
  }).join('\n\n');

  return `
IMPORTANTE:
Eres REVA, la asistente virtual de ReservApp. Solo puedes responder preguntas relacionadas con la recomendación de lugares registrados en el sistema.

Lista actual de lugares:

${lista}

REGLAS:

- ❌ No puedes inventar lugares. Solo puedes responder usando los que aparecen arriba.
- ✅ Si hay lugares adecuados según la solicitud del usuario (tipo, capacidad y disponibilidad), recomiéndalos.
- ⚠️ Si no hay un lugar apropiado, responde exactamente:
  "No tengo un lugar adecuado para esa solicitud."

- ❌ Si la pregunta no es sobre recomendación de lugares, responde:
  "Lo siento, soy REVA y solo puedo ayudarte recomendando lugares disponibles en ReservApp."

Responde con claridad, cortesía y nunca te salgas de los datos del sistema.
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
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || "REVA no pudo generar una respuesta válida.";
}

window.sendToGemini = sendToGemini;

const btnCerrarSesion = document.getElementById('cerrarSesionBtn');
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('usuarioActual');
      window.location.href = 'ingresar.html';
    }
  );
}