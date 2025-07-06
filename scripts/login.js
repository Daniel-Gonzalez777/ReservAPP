document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  async function hashTexto(texto) {
    const encoder = new TextEncoder();
    const data = encoder.encode(texto);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  const adminEmail = "admin@reservapp.com";
  const adminPassword = "admin123";
  const usuariosExistentes = JSON.parse(localStorage.getItem('usuarios')) || [];

  const existeAdmin = usuariosExistentes.some(user => user.email === adminEmail && user.rol === "admin");

  if (!existeAdmin) {
    (async () => {
      const passwordHasheada = await hashTexto(adminPassword);
      const adminUser = {
        nombre: "Administrador",
        email: adminEmail,
        password: passwordHasheada,
        rol: "admin"
      };
      usuariosExistentes.push(adminUser);
      localStorage.setItem('usuarios', JSON.stringify(usuariosExistentes));
      console.log("Administrador creado por defecto");
    })();
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const emailIngresado = emailInput.value.trim();
    const passwordIngresado = passwordInput.value.trim();

    if (emailIngresado === '' || passwordIngresado === '') {
      alert('Por favor completa todos los campos');
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    const passwordHasheada = await hashTexto(passwordIngresado);

    const usuarioEncontrado = usuarios.find(user => 
      user.email === emailIngresado && user.password === passwordHasheada
    );

    if (usuarioEncontrado) {
      alert('Inicio de sesión exitoso');
      localStorage.setItem('usuarioActual', JSON.stringify(usuarioEncontrado)); 
  
    if (usuarioEncontrado.rol === 'admin') {
      window.location.href = '../templates/adminInicio.html';
    } else if (usuarioEncontrado.rol === 'gestor') {
      window.location.href = '../templates/gestorInicio.html';
    } else {
      window.location.href = '../templates/inicio.html';
    }
  } else {
    alert('Correo o contraseña incorrectos. Intenta de nuevo.');
  }
  });
});