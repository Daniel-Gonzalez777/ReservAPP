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
      lugarId: lugar.id,
      lugar: lugar.nombre,
      icono: lugar.icono,
      direccion: lugar.direccion || 'N/A',
      precio: lugar.precio,
      descripcion: lugar.descripcion,
      fecha: document.getElementById('fecha').value,
      hora: document.getElementById('hora').value,
      usuarioEmail: usuarioActual.email
    };

    // Guardar reserva en reservasPorUsuario
    const email = usuarioActual.email;
    let reservasPorUsuario = JSON.parse(localStorage.getItem('reservasPorUsuario')) || {};
    if (!reservasPorUsuario[email]) reservasPorUsuario[email] = [];
    reservasPorUsuario[email].push(reserva);
    localStorage.setItem('reservasPorUsuario', JSON.stringify(reservasPorUsuario));

    // Guardar reserva global
    let reservasGlobal = JSON.parse(localStorage.getItem('reservas')) || [];
    reservasGlobal.push(reserva);
    localStorage.setItem('reservas', JSON.stringify(reservasGlobal));

    // Actualizar disponibilidad
    const lugaresPorDefecto = JSON.parse(localStorage.getItem('lugaresPorDefecto')) || [];
    const lugaresCreados = JSON.parse(localStorage.getItem('lugares')) || [];

    let actualizado = false;

    const actualizarLugar = (lista) => {
      const index = lista.findIndex(l => l.id === lugar.id);
      if (index !== -1) {
        lista[index].disponible = false;
        actualizado = true;
      }
    };

    actualizarLugar(lugaresPorDefecto);
    actualizarLugar(lugaresCreados);

    localStorage.setItem('lugaresPorDefecto', JSON.stringify(lugaresPorDefecto));
    localStorage.setItem('lugares', JSON.stringify(lugaresCreados));

    alert('Reserva confirmada');
    window.location.href = '../templates/inicio.html';
  });
});