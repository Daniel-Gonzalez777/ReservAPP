document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailIngresado = emailInput.value.trim();
    const passwordIngresado = passwordInput.value.trim();

    if (emailIngresado === '' || passwordIngresado === '') {
      alert('Por favor completa todos los campos');
      return;
    }

    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    const usuarioEncontrado = usuarios.find(user => 
      user.email === emailIngresado && user.password === passwordIngresado
    );

    if (usuarioEncontrado) {
      alert('Inicio de sesión exitoso');
      window.location.href = '../templates/inicio.html';
    } else {
      alert('Correo o contraseña incorrectos. Intenta de nuevo.');
    }
  });
});

