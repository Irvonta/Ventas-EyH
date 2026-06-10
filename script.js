console.log("SCRIPT CARGADO");
const productosDiv = document.getElementById("productos");
const carritoDiv = document.getElementById("carrito-items");
const totalSpan = document.getElementById("total");
const buscador = document.getElementById("busqueda");

let carrito = [];
let productos = [];

// 👇 Al cargar la página, recuperar carrito guardado
window.addEventListener("DOMContentLoaded", () => {
  const guardado = localStorage.getItem("carrito");
  if (guardado) {
    carrito = JSON.parse(guardado);
    renderCarrito();
  }
});

fetch("https://apiferreteria.onrender.com/api/productos")
  .then(res => res.json())
  .then(data => {
    productos = data;
    mostrarProductos(productos);
  });

function mostrarProductos(lista) {
  productosDiv.innerHTML = "";

  lista.forEach(producto => {
    const card = document.createElement("div");
    card.className = "card";

    card.innerHTML = `
      <img 
        src="img/${producto.categoria}/${producto.codigo}.png" 
        alt="${producto.descripcion}"
        onerror="this.onerror=null; this.src='img/no-image.png';"
      >

      <h3>${producto.descripcion}</h3>
      <p class="codigo">Código: ${producto.codigo}</p>
      <p class="precio">$${producto.precio}</p>

      <div class="controles">
        <label>Cantidad:</label>
        <input
          type="number"
          min="1"
          max="100"
          value="1"
          id="cantidad-${producto.codigo}"
        >
      </div>

      <button 
        class="agregar"
        onclick="agregarCarrito('${producto.codigo}')"
      >
        Agregar
      </button>
    `;

    productosDiv.appendChild(card);
  });
}

function agregarCarrito(codigo) {
  const producto = productos.find(p => p.codigo == codigo);
  const cantidad = parseInt(document.getElementById(`cantidad-${codigo}`).value);

  const existente = carrito.find(p => p.codigo == codigo);

  if (existente) {
    existente.cantidad += cantidad;
  } else {
    carrito.push({
      ...producto,
      cantidad
    });
  }

  // 👇 guardar carrito en localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));

  renderCarrito();
}




// Mostrar el botón cuando se hace scroll
window.onscroll = function() {
  const btn = document.getElementById("btn-top");
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    btn.style.display = "block";
  } else {
    btn.style.display = "none";
  }
};

// Al dar clic, volver al inicio
document.getElementById("btn-top").addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});


function renderCarrito() {
  carritoDiv.innerHTML = "";
  let subtotal = 0;

  carrito.forEach(item => {
    subtotal += item.precio * item.cantidad;

    const div = document.createElement("div");
    div.className = "carrito-item";

    div.innerHTML = `
      <img 
        src="img/${item.categoria}/${item.codigo}.png" 
        alt="${item.descripcion}"
        onerror="this.onerror=null; this.src='img/no-image.png';"
      >

      <div class="info">
        <h4>${item.descripcion}</h4>
        <p>Código: ${item.codigo}</p>
        <p>$${item.precio}</p>

        <input
          type="number"
          min="1"
          max="100"
          value="${item.cantidad}"
          onchange="cambiarCantidad('${item.codigo}', this.value)"
        >
      </div>

      <button
        class="basura"
        onclick="eliminarProducto('${item.codigo}')"
      >
        🗑
      </button>
    `;

    carritoDiv.appendChild(div);
  });

  let iva = subtotal * 0.16;
  let total = subtotal + iva;

  document.getElementById("subtotal").textContent = subtotal.toFixed(2);
  document.getElementById("iva").textContent = iva.toFixed(2);
  document.getElementById("total").textContent = total.toFixed(2);

  const count = carrito.reduce((acc, item) => acc + item.cantidad, 0);
  document.getElementById("carrito-count").textContent = count;
}

function eliminarProducto(codigo) {
  carrito = carrito.filter(x => x.codigo !== codigo);

  // actualizar localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));

  renderCarrito();
}

function cambiarCantidad(codigo, cantidad) {
  const producto = carrito.find(x => x.codigo === codigo);
  producto.cantidad = parseInt(cantidad);

  // actualizar localStorage
  localStorage.setItem("carrito", JSON.stringify(carrito));

  renderCarrito();
}

buscador.addEventListener("input", () => {
  const texto = buscador.value.toLowerCase();
  const filtrados = productos.filter(p =>
    p.descripcion.toLowerCase().includes(texto) ||
    p.codigo.toLowerCase().includes(texto)
  );
  mostrarProductos(filtrados);
});






const finalizarBtn = document.getElementById("finalizar");

finalizarBtn.addEventListener("click", () => {

console.log("CLICK EN FINALIZAR");

    const nombre = document
        .getElementById("nombre-cliente")
        .value
        .trim();

    if(nombre === ""){
        alert("Por favor escribe tu nombre.");
        return;
    }

    if(carrito.length === 0){
        alert("Tu carrito está vacío.");
        return;
    }

    let mensaje = "";

    mensaje += `Pedido Para Equipos Y Herramientas Del Norte \n`;
    mensaje += `Cliente: ${nombre}\n`;
    mensaje += `-------------------------------------------\n`;

    carrito.forEach((item, index) => {

        mensaje += `${index + 1}. ${item.descripcion}\n`;
        mensaje += `Código: ${item.codigo}\n`;
        mensaje += `Cantidad: ${item.cantidad}\n`;
        mensaje += `Precio: $${item.precio}\n\n`;

    });

    const subtotal = carrito.reduce(
        (acc, item) => acc + (item.precio * item.cantidad),
        0
    );

    const iva = subtotal * 0.16;
    const total = subtotal + iva;

    const piezas = carrito.reduce(
        (acc, item) => acc + item.cantidad,
        0
    );

    mensaje += `-----------------------------\n`;
    mensaje += `Subtotal: $${subtotal.toFixed(2)}\n`;
    mensaje += `IVA: $${iva.toFixed(2)}\n`;
    mensaje += `TOTAL: $${total.toFixed(2)}\n`;




    generarPDF(
    nombre,
    carrito,
    subtotal,
    iva,
    total
);



    const telefono = "5218714608058";

location.href =
    `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;

});



document.getElementById("nombre-cliente")
.addEventListener("input", function() {

    localStorage.setItem(
        "nombreCliente",
        this.value
    );

});


window.addEventListener("DOMContentLoaded", () => {

    const guardado = localStorage.getItem("carrito");

    if(guardado){
        carrito = JSON.parse(guardado);
        renderCarrito();
    }

    const nombreGuardado =
        localStorage.getItem("nombreCliente");

    if(nombreGuardado){
        document.getElementById("nombre-cliente").value =
            nombreGuardado;
    }

});





const btnCarrito =
document.getElementById("btnCarrito");

const carritoPopup =
document.getElementById("carrito-popup");

const contenido =
document.getElementById("contenido");

btnCarrito.addEventListener("click", () => {

    carritoPopup.classList.toggle("abierto");
    document.body.classList.toggle("carrito-abierto");

});



    document.getElementById("eliminar-carrito").addEventListener("click", () => {
    const confirmacion = confirm("¿Estás seguro de eliminar todo el carrito?");
    if (confirmacion) {
        // Vaciar carrito
        localStorage.removeItem("carrito");
        // Opcional: también quitar cliente si quieres reiniciar todo
        // localStorage.removeItem("cliente");

        alert("Carrito eliminado correctamente.");
        // Recargar la página para reflejar cambios
        window.location.reload();
    } else {
        alert("Eliminación cancelada.");
    }
});



document.getElementById("cerrar-carrito")
.addEventListener("click", () => {

    carritoPopup.classList.remove("abierto");
    document.body.classList.remove("carrito-abierto");

});






function generarPDF(nombre, carrito, subtotal, iva, total){

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    doc.setFontSize(18);
    doc.text("EQUIPOS Y HERRAMIENTAS DEL NORTE", 10, 15);

    doc.setFontSize(12);
    doc.text(`Cliente: ${nombre}`, 10, 25);

    let y = 40;

    doc.text("CODIGO", 10, y);
    doc.text("DESCRIPCION", 40, y);
    doc.text("CANT", 150, y);
    doc.text("PRECIO", 175, y);

    y += 10;

    carrito.forEach(item => {

        doc.text(item.codigo.toString(), 10, y);

        doc.text(
            item.descripcion.substring(0, 35),
            40,
            y
        );

        doc.text(
            item.cantidad.toString(),
            150,
            y
        );

        doc.text(
            `$${item.precio}`,
            175,
            y
        );

        y += 8;
    });

    y += 10;

    doc.text(
        `Subtotal: $${subtotal.toFixed(2)}`,
        10,
        y
    );

    y += 8;

    doc.text(
        `IVA: $${iva.toFixed(2)}`,
        10,
        y
    );

    y += 8;

    doc.text(
        `TOTAL: $${total.toFixed(2)}`,
        10,
        y
    );

    const fecha = new Date();

const fechaTexto =
    fecha.getFullYear() + "-" +
    String(fecha.getMonth() + 1).padStart(2, "0") + "-" +
    String(fecha.getDate()).padStart(2, "0");

doc.save(
    `Pedido_${nombre}_${fechaTexto}.pdf`
);
}


