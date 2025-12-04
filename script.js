document.addEventListener('DOMContentLoaded', () => {

    // ======================
    //  BOTÓN "CARGAR MÁS"
    // ======================

    const loadMoreBtn = document.querySelector('#load-more');
    let currentItem = 4; // Cuántos productos se muestran al inicio
    const boxes = Array.from(document.querySelectorAll('.box-container .box'));

    if (loadMoreBtn) {

        // Si hay 4 o menos productos, ocultamos el botón
        if (boxes.length <= currentItem) {
            loadMoreBtn.style.display = 'none';
        }

        loadMoreBtn.addEventListener('click', () => {
            for (let i = currentItem; i < currentItem + 4; i++) {
                if (boxes[i]) {
                    boxes[i].style.display = 'inline-block';
                }
            }

            currentItem += 4;

            if (currentItem >= boxes.length) {
                loadMoreBtn.style.display = 'none';
            }
        });
    }

    // ======================
    //        CARRITO
    // ======================

    const carrito = document.getElementById('carrito');
    const elementos1 = document.getElementById('lista-1');
    const lista = document.querySelector('#lista-carrito tbody');
    const vaciarCarritoBtn = document.getElementById('vaciar-carrito');
    const totalSpan = document.getElementById('total');
    const carritoVacioMsg = document.getElementById('carrito-vacio');

    // Array donde guardamos los productos del carrito
    let carritoItems = [];

    if (elementos1) {
        elementos1.addEventListener('click', comprarElemento);
    }

    if (carrito) {
        carrito.addEventListener('click', eliminarElemento);
    }

    if (vaciarCarritoBtn) {
        vaciarCarritoBtn.addEventListener('click', vaciarCarrito);
    }

    function comprarElemento(e) {
        e.preventDefault();

        if (e.target.classList.contains('agregar-carrito')) {
            const elemento = e.target.closest('.box');
            if (!elemento) return;
            leerDatosElemento(elemento);
        }
    }

    function leerDatosElemento(elemento) {
        const infoElemento = {
            imagen: elemento.querySelector('img').src,
            titulo: elemento.querySelector('h3').textContent,
            precio: elemento.querySelector('.precio').textContent, // ej. "$70"
            id: elemento.querySelector('.agregar-carrito').getAttribute('data-id'),
            cantidad: 1
        };

        const existe = carritoItems.some(item => item.id === infoElemento.id);

        if (existe) {
            // Incrementar cantidad
            carritoItems = carritoItems.map(item => {
                if (item.id === infoElemento.id) {
                    item.cantidad++;
                }
                return item;
            });
        } else {
            // Agregar nuevo producto
            carritoItems.push(infoElemento);
        }

        actualizarCarritoHTML();
    }

    function actualizarCarritoHTML() {
        if (!lista) return;

        // Limpiar HTML
        lista.innerHTML = '';

        let total = 0;

        carritoItems.forEach(item => {
            // Sacar número del precio (ej. "$70" -> 70)
            const precioNumero = Number(item.precio.replace(/[^0-9.]/g, ''));
            const subtotal = precioNumero * item.cantidad;
            total += subtotal;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td><img src="${item.imagen}" width="60"></td>
                <td>${item.titulo}</td>
                <td>${item.cantidad}</td>
                <td>${item.precio}</td>
                <td><a href="#" class="borrar" data-id="${item.id}">X</a></td>
            `;
            lista.appendChild(row);
        });

        // Actualizar total
        if (totalSpan) {
            totalSpan.textContent = '$' + total.toFixed(2);
        }

        // Mostrar / ocultar mensaje de carrito vacío
        if (carritoVacioMsg) {
            carritoVacioMsg.style.display = carritoItems.length === 0 ? 'block' : 'none';
        }
    }

    function eliminarElemento(e) {
        e.preventDefault();

        if (e.target.classList.contains('borrar')) {
            const id = e.target.getAttribute('data-id');
            carritoItems = carritoItems.filter(item => item.id !== id);
            actualizarCarritoHTML();
        }
    }

    function vaciarCarrito(e) {
        e.preventDefault();

        carritoItems = [];
        actualizarCarritoHTML();
    }

    // Inicializar mensaje de carrito vacío al cargar
    actualizarCarritoHTML();
});
