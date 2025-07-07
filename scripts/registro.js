document.addEventListener('DOMContentLoaded', () => {
  const nombres = document.getElementById('nombre');
  const fechas = document.getElementById('fecha');
  const emailInput = document.getElementById('email');
  const passwords = document.getElementById('password');
  const rolSelect = document.getElementById('rol');
  const form = document.querySelector('form');

  async function hashTexto(texto) {
    const encoder = new TextEncoder();
    const data = encoder.encode(texto);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nombre = nombres.value.trim();
    const fecha = fechas.value.trim();
    const email = emailInput.value.trim();
    const password = passwords.value.trim();
    const rol = rolSelect.value;

    if (!nombre || !fecha || !email || !password || !rol) {
      alert("Por favor completa todos los campos");
      return;
    }

    const usuariosGuardados = JSON.parse(localStorage.getItem('usuarios')) || [];
    const existe = usuariosGuardados.some(user => user.email === email);

    if (existe) {
      alert("Este correo ya está registrado.");
      return;
    }

    const passwordHasheada = await hashTexto(password);

    const nuevoUsuario = {
      nombre,
      fecha,
      email,
      password: passwordHasheada,
      rol
    };

    usuariosGuardados.push(nuevoUsuario);
    localStorage.setItem('usuarios', JSON.stringify(usuariosGuardados));
    localStorage.setItem('usuarioActual', JSON.stringify(nuevoUsuario));

    alert("¡Registro exitoso!");

    if (rol === 'gestor') {
      window.location.href = 'templates/gestorInicio.html';
    } else {
      window.location.href = 'templates/inicio.html';
    }
  });
});