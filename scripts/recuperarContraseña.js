let usuarioEncontrado = null;

function mostrarMensaje(texto, esError = false) {
  const mensaje = document.getElementById('mensaje');
  mensaje.textContent = texto;
  mensaje.style.color = esError ? 'red' : 'green';
}

async function hashTexto(texto) {
  const encoder = new TextEncoder();
  const data = encoder.encode(texto);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

function verificarDatos() {
  const email = document.getElementById('email').value.trim();
  const nombre = document.getElementById('nombre').value.trim().toLowerCase();
  const fecha = document.getElementById('fecha').value.trim();

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

  usuarioEncontrado = usuarios.find(u => 
    u.email === email &&
    u.nombre.toLowerCase() === nombre &&
    u.fecha === fecha
  );

  if (!usuarioEncontrado) {
    mostrarMensaje("Datos incorrectos. Intenta nuevamente.", true);
    return;
  }

  mostrarMensaje("Identidad verificada. Ahora puedes cambiar tu contraseña.");
  document.getElementById('resetSection').style.display = 'block';
}

async function guardarNuevaContraseña() {
  const nuevaPass = document.getElementById('newPassword').value.trim();

  if (!nuevaPass) {
    mostrarMensaje("Ingresa una nueva contraseña.", true);
    return;
  }

  const nuevaHasheada = await hashTexto(nuevaPass);

  const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
  const index = usuarios.findIndex(u => u.email === usuarioEncontrado.email);
  if (index !== -1) {
    usuarios[index].password = nuevaHasheada;
    localStorage.setItem('usuarios', JSON.stringify(usuarios));
    mostrarMensaje("¡Contraseña actualizada correctamente!");
    setTimeout(() => {
      window.location.href = '../templates/ingresar.html';
    }, 2000);
  }
}
