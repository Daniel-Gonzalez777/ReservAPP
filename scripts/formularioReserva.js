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

    const fechaInput = document.getElementById('fecha').value;
    const horaInput = document.getElementById('hora').value;
    const fechaSeleccionada = new Date(`${fechaInput}T${horaInput}`);
    const ahora = new Date();

    if (fechaSeleccionada < ahora) {
      alert("No puedes seleccionar una fecha y hora pasada para tu reserva.");
      return;
    }

    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    if (!usuarioActual) {
      alert("No hay usuario activo");
      return;
    }

    const reservasPorUsuario = JSON.parse(localStorage.getItem('reservasPorUsuario')) || {};
    const reservasGlobal = JSON.parse(localStorage.getItem('reservas')) || [];

    const yaReservado = reservasGlobal.some(r =>
      r.lugarId === lugar.id && r.fecha === fechaInput
    );

    if (yaReservado) {
      alert("Esta fecha ya está reservada para este lugar");
      return;
    }

    const reserva = {
      lugarId: lugar.id,
      lugar: lugar.nombre,
      icono: lugar.icono,
      direccion: lugar.direccion || 'N/A',
      precio: lugar.precio,
      descripcion: lugar.descripcion,
      fecha: fechaInput,
      hora: horaInput,
      usuarioEmail: usuarioActual.email
    };

    const email = usuarioActual.email;
    if (!reservasPorUsuario[email]) reservasPorUsuario[email] = [];
    reservasPorUsuario[email].push(reserva);
    localStorage.setItem('reservasPorUsuario', JSON.stringify(reservasPorUsuario));

    reservasGlobal.push(reserva);
    localStorage.setItem('reservas', JSON.stringify(reservasGlobal));

    alert('Reserva confirmada');
    window.location.href = '../templates/inicio.html';
  });

  const btnVolver = document.getElementById('btnVolver');
  if (btnVolver) {
    btnVolver.addEventListener('click', () => {
      window.location.href = '../templates/lugaresDisponibles.html';
    });
  }
});