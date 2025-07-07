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

  const geminiApiKey = "AIzaSyCqRRtLSaWmA1Ad-T6x-feOgPX_uBvhZyU"; // ← Reemplaza por tu API key real

  try {
    inicializarLugaresBase(); // ← aseguramos lugares por defecto

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

// 💡 Inicializa lugares base si no existen
function inicializarLugaresBase() {
  let lugares = JSON.parse(localStorage.getItem("lugares")) || [];

  const nombresExistentes = lugares.map(l => l.nombre.toLowerCase());

  const lugaresBase = [
    {
      id: 1001,
      nombre: "Sala de Conferencias A",
      descripcion: "Espacio profesional con pantalla y sonido para reuniones grandes",
      ubicacion: "Edificio principal, piso 2",
      capacidad: 30,
      precio: "$100.000/hora",
      disponible: true,
      gestorId: "sistema@reservapp.com"
    },
    {
      id: 1002,
      nombre: "Oficina Privada",
      descripcion: "Ambiente tranquilo para reuniones ejecutivas o entrevistas",
      ubicacion: "Edificio sur, piso 3",
      capacidad: 6,
      precio: "$60.000/hora",
      disponible: true,
      gestorId: "sistema@reservapp.com"
    }
  ];

  // Agrega los lugares base solo si aún no están
  lugaresBase.forEach(base => {
    if (!nombresExistentes.includes(base.nombre.toLowerCase())) {
      lugares.push(base);
    }
  });

  localStorage.setItem("lugares", JSON.stringify(lugares));
}

function generarPromptConLugares(lugares) {
  if (!lugares.length) {
    return `
Eres REVA, la asistente virtual de ReservApp.

Actualmente no hay lugares disponibles. Si alguien te hace una pregunta, responde:
"En este momento no tengo lugares disponibles para recomendar."

⚠️ Nunca inventes lugares. Solo puedes usar los que están en esta lista del sistema.
`;
  }

  const lista = lugares.map((l, i) => {
    const estado = l.disponible ? "Disponible" : "Reservado";
    return `${i + 1}. ${l.nombre} – ${l.descripcion}, ubicado en ${l.ubicacion}, capacidad: ${l.capacidad}, precio: ${l.precio}. Estado: ${estado}.`;
  }).join('\n');

  return `
IMPORTANTE:
Eres REVA, una IA especializada que responde únicamente sobre lugares registrados en ReservApp.

Lista oficial de lugares disponibles en el sistema:

${lista}

REGLAS ESTRICTAS:

- ❌ No inventes lugares. Solo puedes responder usando los que están en esta lista.
- ✅ Si algún lugar es adecuado según lo que el usuario pide (capacidad, disponibilidad, tipo), recomiéndalo.
- ⚠️ Si no hay un lugar adecuado, responde exactamente:
  "No tengo un lugar adecuado para esa solicitud."

- ❌ Si la pregunta no es sobre recomendación de lugares, responde exactamente:
  "Lo siento, soy REVA y solo puedo ayudarte recomendando lugares disponibles en ReservApp."

Tu tono debe ser claro, respetuoso y nunca salirte de lo que está en esta lista.
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
