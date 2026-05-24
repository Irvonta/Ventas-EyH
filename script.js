const productosDiv = document.getElementById("productos");
const carritoDiv = document.getElementById("carrito-items");
const totalSpan = document.getElementById("total");
const buscador = document.getElementById("busqueda");

let carrito = [];
let productos = [];

fetch("https://apiferreteria.onrender.com/api/productos")
  .then(res => res.json())
  .then(data => {
    productos = data;
    mostrarProductos(productos);
  });


function mostrarProductos(lista){

    productosDiv.innerHTML = "";

    lista.forEach(producto => {

        const card = document.createElement("div");

        card.className = "card";

        card.innerHTML = `

            <img 
                src="${producto.imagen}" 
                alt=""
                onerror="this.src='img/no-image.png'"
            >

            <h3>${producto.descripcion}</h3>

            <p class="codigo">
                Código: ${producto.codigo}
            </p>

            <p class="precio">
                $${producto.precio}
            </p>

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

function agregarCarrito(codigo){

    const producto = productos.find(
        p => p.codigo == codigo
    );

    const cantidad = parseInt(
        document.getElementById(`cantidad-${codigo}`).value
    );

    const existente = carrito.find(
        p => p.codigo == codigo
    );

    if(existente){

        existente.cantidad += cantidad;

    }else{

        carrito.push({
            ...producto,
            cantidad
        });

    }

    renderCarrito();

}

function renderCarrito(){

    carritoDiv.innerHTML = "";

    let subtotal = 0;

    carrito.forEach(item => {

        subtotal += item.precio * item.cantidad;

        const div = document.createElement("div");

        div.className = "carrito-item";

        div.innerHTML = `

            <img 
                src="${item.imagen}"
                onerror="this.src='img/no-image.png'"
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

    // 👇 cálculo de IVA y total
    let iva = subtotal * 0.16;
    let total = subtotal + iva;

    // 👇 mostrar en los spans correspondientes
    document.getElementById("subtotal").textContent = subtotal.toFixed(2);
    document.getElementById("iva").textContent = iva.toFixed(2);
    document.getElementById("total").textContent = total.toFixed(2);
}


function eliminarProducto(codigo){

    carrito = carrito.filter(
        x => x.codigo !== codigo
    );

    renderCarrito();

}

function cambiarCantidad(codigo, cantidad){

    const producto = carrito.find(
        x => x.codigo === codigo
    );

    producto.cantidad = parseInt(cantidad);

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

    localStorage.setItem(
        "carrito",
        JSON.stringify(carrito)
    );

    window.location.href = "resumen.html";

});