const nombres = document.getElementById('nombre');
const fechas = document.getElementById('fecha');
const emailInput = document.getElementById('email');
const passwords = document.getElementById('password');
const boton = document.getElementById('boton');

async function hashTexto(texto) {
  const encoder = new TextEncoder();
  const data = encoder.encode(texto);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function saveName() {
  const nombre = nombres.value.trim();
  const fecha = fechas.value.trim();
  const email = emailInput.value.trim();
  const password = passwords.value.trim();

  if (nombre === '') {
    alert("Por favor ingrese su nombre");
    return; 
  }

  if (fecha === '') {
    alert("Por favor ingrese su fecha de nacimiento");
    return; 
  }

  if (email === '') {
    alert("Por favor ingrese su correo electrónico");
    return; 
  }

  if (password === '') {
    alert("Por favor ingrese su contraseña");
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
    password: passwordHasheada
  };

  usuariosGuardados.push(nuevoUsuario);
  localStorage.setItem('usuarios', JSON.stringify(usuariosGuardados));

  alert("¡Datos guardados con éxito!");
  window.location.href = '../templates/inicio.html';
}

boton.addEventListener('click', function(e) {
  e.preventDefault(); 
  saveName();         
});
