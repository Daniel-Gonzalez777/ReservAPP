document.addEventListener('DOMContentLoaded', () => {
  mostrarReservasEnInicio();
});

function mostrarReservasEnInicio() {
  const usuarioObj = JSON.parse(localStorage.getItem('usuarioActual'));
  if (!usuarioObj) return;
  const usuario = usuarioObj.email;

  const tabla = document.getElementById('tabla-proximas');
  const reservasPorUsuario = JSON.parse(localStorage.getItem('reservasPorUsuario')) || {};
  const reservas = reservasPorUsuario[usuario] || [];

  tabla.innerHTML = '';

  reservas.forEach((reserva, index) => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${reserva.lugar}</td>
      <td>${reserva.fecha}</td>
      <td>${reserva.hora}</td>
      <td><button class="btn-cancelar" data-index="${index}">Cancelar</button></td>
    `;
    tabla.appendChild(fila);
  });

  document.querySelectorAll('.btn-cancelar').forEach(boton => {
    boton.addEventListener('click', () => {
      const index = parseInt(boton.getAttribute('data-index'));
      cancelarReserva(index);
    });
  });
}

function cancelarReserva(index) {
  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
  const email = usuarioActual.email;

  let reservasPorUsuario = JSON.parse(localStorage.getItem('reservasPorUsuario')) || {};
  let reservasGlobal = JSON.parse(localStorage.getItem('reservas')) || [];

  if (!reservasPorUsuario[email]) return;

  const reservaCancelada = reservasPorUsuario[email][index];

  // 1. Eliminar de reservasPorUsuario
  reservasPorUsuario[email].splice(index, 1);
  if (reservasPorUsuario[email].length === 0) {
    delete reservasPorUsuario[email];
  }
  localStorage.setItem('reservasPorUsuario', JSON.stringify(reservasPorUsuario));

  // 2. Eliminar de reservas globales
  reservasGlobal = reservasGlobal.filter(r =>
    !(r.usuarioEmail === email &&
      r.lugarId === reservaCancelada.lugarId &&
      r.fecha === reservaCancelada.fecha &&
      r.hora === reservaCancelada.hora)
  );
  localStorage.setItem('reservas', JSON.stringify(reservasGlobal));

  // 3. Verificar si ya no hay reservas para ese lugar
  const hayMasReservas = reservasGlobal.some(r => r.lugarId === reservaCancelada.lugarId);

  if (!hayMasReservas) {
    const actualizarEstado = (clave) => {
      const lista = JSON.parse(localStorage.getItem(clave)) || [];
      const indexLugar = lista.findIndex(l => l.id === reservaCancelada.lugarId);
      if (indexLugar !== -1) {
        lista[indexLugar].disponible = true;
        localStorage.setItem(clave, JSON.stringify(lista));
      }
    };
    actualizarEstado('lugares');
    actualizarEstado('lugaresPorDefecto');
  }

  alert("Reserva cancelada exitosamente");
  location.reload();
}

function cerrarSesion() {
  localStorage.removeItem('usuarioActual');
  window.location.href = '../templates/ingresar.html';
}