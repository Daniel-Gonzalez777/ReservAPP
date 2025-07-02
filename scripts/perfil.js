document.addEventListener('DOMContentLoaded', () => {
  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
  const reservasPorUsuario = JSON.parse(localStorage.getItem('reservasPorUsuario')) || {};

  if (!usuarioActual) {
    alert('No hay sesión activa');
    window.location.href = '/templates/ingresar.html';
    return;
  }

  // Mostrar datos del usuario
  document.getElementById('nombreUsuario').textContent = usuarioActual.nombre;
  document.getElementById('emailUsuario').textContent = usuarioActual.email;
  document.getElementById('fechaUsuario').textContent = usuarioActual.fecha;

  // Mostrar actividad
  const reservasUsuario = reservasPorUsuario[usuarioActual.email] || [];
  document.getElementById('totalReservas').textContent = reservasUsuario.length;

  if (reservasUsuario.length > 0) {
    const ultima = reservasUsuario[reservasUsuario.length - 1];
    document.getElementById('ultimaReserva').textContent = `${ultima.fecha} - ${ultima.hora}`;
  }
});
