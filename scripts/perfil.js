document.addEventListener('DOMContentLoaded', () => {
  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
  const reservasPorUsuario = JSON.parse(localStorage.getItem('reservasPorUsuario')) || {};

  if (!usuarioActual) {
    alert('No hay sesión activa');
    window.location.href = '../templates/ingresar.html';
    return;
  }

  document.getElementById('nombreUsuario').textContent = usuarioActual.nombre;
  document.getElementById('emailUsuario').textContent = usuarioActual.email;
  document.getElementById('fechaUsuario').textContent = usuarioActual.fecha;

  const reservasUsuario = reservasPorUsuario[usuarioActual.email] || [];
  document.getElementById('totalReservas').textContent = reservasUsuario.length;

  if (reservasUsuario.length > 0) {
    const ultima = reservasUsuario[reservasUsuario.length - 1];
    document.getElementById('ultimaReserva').textContent = `${ultima.fecha} - ${ultima.hora}`;
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const usuario = JSON.parse(localStorage.getItem('usuarioActual')) || {};
  if (usuario.rol === 'admin') {
    const linkInicio = document.getElementById('linkInicio');
    const linkReva = document.getElementById('linkReva');
    if (linkInicio) linkInicio.style.display = 'none';
    if (linkReva) linkReva.style.display = 'none';

    const navLinks = document.querySelector('.nav-links');
    if (navLinks) {
      const adminLink = document.createElement('a');
      adminLink.href = 'adminInicio.html';
      adminLink.className = 'nav-link';
      adminLink.textContent = 'Panel Admin';
      navLinks.appendChild(adminLink);
    }
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const btnCerrarSesion = document.getElementById('cerrarSesionBtn');
  if (btnCerrarSesion) {
    btnCerrarSesion.addEventListener('click', (e) => {
      e.preventDefault();
      localStorage.removeItem('usuarioActual');
      window.location.href = 'ingresar.html';
    });
  }
});