 document.addEventListener('DOMContentLoaded', () => {
      const botonesVer = document.querySelectorAll('.btn-ver');
      botonesVer.forEach(boton => {
        boton.addEventListener('click', () => {
          const info = boton.getAttribute('data-info');
          alert(info);
        });
      });
    });