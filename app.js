const cards = document.getElementById('cards')
const items = document.getElementById('items')
const footer = document.getElementById('footer')
const templateCard = document.getElementById('template-card').content
const templatefooter = document.getElementById('template-footer').content
const templatecarrito = document.getElementById('template-carrito').content
const fragment = document.createDocumentFragment()
let carrito = {}

document.addEventListener('DOMContentLoaded', () => {
    fetchData()
    if(localStorage.getItem('carrito')){
        carrito = JSON.parse(localStorage.getItem('carrito'))
        pintarCarrito()
    }
})
cards.addEventListener('click', e => {
    addCarrito(e)
})
items.addEventListener('click', e => {
    btnAccion(e)
})

const fetchData = async () => {
    try {
        const res = await fetch('api.json')
        const data = await res.json()
        pintarCards(data)
    } catch (error) {
        console.log(error)
        
    }
}

const pintarCards = data => {
    data.forEach(item => {
        templateCard.querySelector('h5').textContent = item.title
        templateCard.querySelector('p').textContent = item.precio
        templateCard.querySelector('img').setAttribute("src", item.thumbnailUrl)
        templateCard.querySelector('.btn-dark').dataset.id = item.id
        const clone = templateCard.cloneNode(true)
        fragment.appendChild(clone)
    })
    cards.appendChild(fragment)
}
 const addCarrito = e => {
     if (e.target.classList.contains('btn-dark')){
         setCarrito(e.target.parentElement)

     }
     e.stopPropagation()
 }

 const setCarrito = objeto => {
     const productos = {
         id: objeto.querySelector('.btn-dark').dataset.id,
         title: objeto.querySelector('h5').textContent,
         precio: objeto.querySelector('p').textContent,
         cantidad: 1
     }

     if (carrito.hasOwnProperty(productos.id)){
         productos.cantidad = carrito[productos.id].cantidad + 1
     }
     carrito[productos.id] = {...productos}
     pintarCarrito()
 }

 const pintarCarrito = () => {
     items.innerHTML = ''
     Object.values(carrito).forEach(producto => {
         templatecarrito.querySelector('th').textContent = producto.id
         templatecarrito.querySelectorAll('td')[0].textContent = producto.title
         templatecarrito.querySelectorAll('td')[1].textContent = producto.cantidad
         templatecarrito.querySelector('.btn-info').dataset.id = producto.id
         templatecarrito.querySelector('.btn-danger').dataset.id = producto.id
         templatecarrito.querySelector('span').textContent = producto.cantidad * producto.precio

         const clone = templatecarrito.cloneNode(true)
         fragment.appendChild(clone)
     })
     items.appendChild(fragment)
     pintarFooter()

     localStorage.setItem('carrito', JSON.stringify(carrito))
 }

 const pintarFooter = () => {
     footer.innerHTML = ''
     if(Object.keys(carrito).length === 0){
         footer.innerHTML = '<th scope="row" colspan="5">Carrito vacío - comience a comprar!</th>'
         return
     }

     const nCantidad = Object.values(carrito).reduce((acc, {cantidad}) => acc + cantidad, 0)
     const nPrecio = Object.values(carrito).reduce((acc, {cantidad, precio}) => acc + cantidad * precio, 0)

     templatefooter.querySelectorAll('td')[0].textContent = nCantidad
     templatefooter.querySelector('span').textContent = nPrecio

     const clone = templatefooter.cloneNode(true)
     fragment.appendChild(clone)
     footer.appendChild(fragment)

     const btnVaciar = document.getElementById('vaciar-carrito')
     btnVaciar.addEventListener('click', () => {
         carrito = {}
         pintarCarrito()
     })
 }

 const btnAccion = e => {
     if (e.target.classList.contains('btn-info')){
         const producto = carrito[e.target.dataset.id]
         producto.cantidad++
         carrito[e.target.dataset.id] = {...producto}
         pintarCarrito()
     }

     if(e.target.classList.contains('btn-danger')){
        const producto = carrito[e.target.dataset.id]
        producto.cantidad--
        if(producto.cantidad === 0){
            delete carrito[e.target.dataset.id]
        }
        pintarCarrito()
     }
     e.stopPropagation()
 }