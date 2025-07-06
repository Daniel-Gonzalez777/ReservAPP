let usuarioEncontrado = null;

function verificarDatos() {
  const email = document.getElementById('email').value.trim();
  const nombre = document.getElementById('nombre').value.trim().toLowerCase();
  const fecha = document.getElementById('fecha').value;
  const rol = document.getElementById('rol').value;

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  usuarioEncontrado = usuarios.find(u =>
    u.email === email &&
    u.nombre.toLowerCase() === nombre &&
    u.fecha === fecha &&
    u.rol === rol
  );

  if (!usuarioEncontrado) {
    mostrarMensaje("Datos incorrectos. Intenta nuevamente.", true);
    return;
  }

  mostrarMensaje("Identidad verificada. Ahora puedes cambiar tu contraseña.");
  document.getElementById('resetSection').style.display = 'block';
}

// ✅ función para hashear texto (SHA-256)
async function hashTexto(texto) {
  const encoder = new TextEncoder();
  const data = encoder.encode(texto);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function guardarNuevaContraseña() {
  const nuevaPassword = document.getElementById('newPassword').value;

  if (!usuarioEncontrado) {
    mostrarMensaje("Verifica tu identidad primero.", true);
    return;
  }

  if (nuevaPassword.length < 6) {
    mostrarMensaje("La contraseña debe tener al menos 6 caracteres.", true);
    return;
  }

  const passwordHasheada = await hashTexto(nuevaPassword);
  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  const index = usuarios.findIndex(u =>
    u.email === usuarioEncontrado.email &&
    u.rol === usuarioEncontrado.rol
  );

  if (index !== -1) {
    usuarios[index].password = passwordHasheada;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    mostrarMensaje("Contraseña actualizada correctamente. Redirigiendo...");

    setTimeout(() => {
      window.location.href = "../templates/ingresar.html";
    }, 2000);
  } else {
    mostrarMensaje("Error al actualizar la contraseña.", true);
  }
}

function mostrarMensaje(msg, esError = false) {
  const mensaje = document.getElementById('mensaje');
  mensaje.textContent = msg;
  mensaje.style.color = esError ? 'tomato' : 'lightgreen';
}
