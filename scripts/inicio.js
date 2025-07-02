document.addEventListener('DOMContentLoaded', () => {
  mostrarReservasEnInicio();
});

function mostrarReservasEnInicio() {
  const tabla = document.getElementById('tabla-proximas');
  if (!tabla) return;

  const reservas = JSON.parse(localStorage.getItem('historialReservas')) || [];

  tabla.innerHTML = '';

  reservas.forEach(reserva => {
    const fila = document.createElement('tr');
    fila.innerHTML = `
      <td>${reserva.nombre}</td>
      <td>${reserva.fecha}</td>
      <td>${reserva.hora}</td>
      <td>
        <button class="btn-ver"
          data-nombre="${reserva.nombre}"
          data-direccion="${reserva.direccion || ''}"
          data-fecha="${reserva.fecha}"
          data-hora="${reserva.hora}"
          data-precio="${reserva.precio}"
          data-imagen="${reserva.imagen || ''}"
          data-descripcion="${reserva.descripcion || ''}">
          Ver
        </button>
      </td>
    `;
    tabla.appendChild(fila);
  });

  document.querySelectorAll('.btn-ver').forEach(boton => {
    boton.addEventListener('click', () => {
      const datosReserva = {
        nombre: boton.dataset.nombre,
        direccion: boton.dataset.direccion,
        fecha: boton.dataset.fecha,
        hora: boton.dataset.hora,
        precio: boton.dataset.precio,
        imagen: boton.dataset.imagen,
        descripcion: boton.dataset.descripcion
      };
      localStorage.setItem('detalleReserva', JSON.stringify(datosReserva));
      window.location.href = '/templates/detallesReserva.html';
    });
  });
}
