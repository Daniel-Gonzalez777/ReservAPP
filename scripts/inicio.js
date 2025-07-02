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
      <td>${reserva.nombre}</td>
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
  const usuarioObj = JSON.parse(localStorage.getItem('usuarioActual'));
  if (!usuarioObj) return;
  const usuario = usuarioObj.email;

  let reservasPorUsuario = JSON.parse(localStorage.getItem('reservasPorUsuario')) || {};
  reservasPorUsuario[usuario].splice(index, 1);

  localStorage.setItem('reservasPorUsuario', JSON.stringify(reservasPorUsuario));
  mostrarReservasEnInicio();
}

function cerrarSesion() {
  localStorage.removeItem('usuarioActual');
  window.location.href = '../templates/ingresar.html';
}
