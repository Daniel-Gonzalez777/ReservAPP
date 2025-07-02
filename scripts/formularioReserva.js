document.addEventListener('DOMContentLoaded', () => {
  const lugar = JSON.parse(localStorage.getItem('lugarSeleccionado'));
  const infoDiv = document.getElementById('infoLugar');

  if (lugar && infoDiv) {
    infoDiv.innerHTML = `
      <h2>${lugar.icono} ${lugar.nombre}</h2>
      <p><strong>Descripción:</strong> ${lugar.descripcion}</p>
      <p><strong>Precio:</strong> ${lugar.precio}</p>
      <p><strong>Capacidad:</strong> ${lugar.capacidad}</p>
    `;
  }

  document.getElementById('formReserva').addEventListener('submit', function (e) {
    e.preventDefault();

    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    if (!usuarioActual) {
      alert("No hay usuario activo");
      return;
    }

    const reserva = {
      nombre: lugar.nombre,
      icono: lugar.icono,
      direccion: lugar.direccion || 'N/A',
      precio: lugar.precio,
      descripcion: lugar.descripcion,
      fecha: document.getElementById('fecha').value,
      hora: document.getElementById('hora').value
    };

    const email = usuarioActual.email;
    let reservasPorUsuario = JSON.parse(localStorage.getItem('reservasPorUsuario')) || {};

    if (!reservasPorUsuario[email]) {
      reservasPorUsuario[email] = [];
    }

    reservasPorUsuario[email].push(reserva);
    localStorage.setItem('reservasPorUsuario', JSON.stringify(reservasPorUsuario));

    alert('Reserva confirmada');
    window.location.href = '../templates/inicio.html';
  });
});
