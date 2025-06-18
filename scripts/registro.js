const nombres = document.getElementById('nombre');
const fechas = document.getElementById('fecha');
const emailInput = document.getElementById('email');
const passwords = document.getElementById('password');
const boton = document.getElementById('boton');

function saveName() {
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

  localStorage.setItem('userNombre', nombre);
  localStorage.setItem('userFecha', fecha);
  localStorage.setItem('userEmail', email);
  localStorage.setItem('userPassword', password);

  alert("¡Datos guardados con éxito!");
}

boton.addEventListener('click', saveName);
