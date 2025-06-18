document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  const emailInput = document.getElementById('email');
  const passwordInput = document.getElementById('password');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const emailIngresado = emailInput.value.trim();
    const passwordIngresado = passwordInput.value.trim();

    const emailGuardado = localStorage.getItem('userEmail');
    const passwordGuardado = localStorage.getItem('userPassword');

    if (emailIngresado === '' || passwordIngresado === '') {
      alert('Por favor completa todos los campos');
      return;
    }

    if (emailIngresado === emailGuardado && passwordIngresado === passwordGuardado) {
      alert('Inicio de sesión exitoso');
      window.location.href = '/templates/inicio.html';
    } else {
      alert('Correo o contraseña incorrectos. Intenta de nuevo.');
    }
  });
});
