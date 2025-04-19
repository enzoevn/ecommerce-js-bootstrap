import { removeProductFromCart, addProductToCartFromCart, getCart } from './utils.js';

export async function loadCart() {
    const cart = getCart();
    console.log('Cart:', cart);
    const response = await fetch('./src/templates/cart.html');
    if (!response.ok) {
        throw new Error('Failed to load cart.html');
    }
    const html = await response.text();
    document.querySelector('.offcanvas-body').innerHTML = html;
    const cartContainer = document.getElementById('cart-container');
    if (cart.length === 0) {
        cartContainer.innerHTML = '<p>No hay productos en el carrito</p>';
    }
    else {
        const cartTemplate = document.getElementById('cart-template').content;
        cart.forEach(product => {
            const cartElement = document.importNode(cartTemplate, true);
            cartElement.querySelector('.cart-product-image').src = product.image;
            cartElement.querySelector('.cart-product-image').alt = product.name;
            cartElement.querySelector('.cart-product-name').textContent = product.name;
            cartElement.querySelector('.cart-product-price').textContent = `$${product.price}`;
            cartElement.querySelector('.cart-product-quantity').textContent = product.quantity;
            // cartElement.querySelector('.cart-total').textContent = `Total: $${product.total}`;
            // Se agrega id al botón para poder identificarlo
            // cartElement.querySelector('.delete-from-cart').id = `delete-from-cart-${product.id}`;
            // Se agrega id al boton agregar para poder identificarlo
            cartElement.querySelector('.add-product').id = `add-product-${product.id}`;
            // Se agrega id al boton restar para poder identificarlo
            cartElement.querySelector('.remove-product').id = `remove-product-${product.id}`;

            cartContainer.appendChild(cartElement);

            // Funcionalidad para eliminar productos del carrito
            const removeProductButton = document.querySelector(`#remove-product-${product.id}`);
            
            if (!removeProductButton) return;
            else {
                removeProductButton.addEventListener('click', () => {
                    console.log('Delete button clicked' + product.id);
                    removeProductFromCart(product.id);
                });
            }

            // Funcionalidad para agregar productos al carrito
            const addProductButton = document.querySelector(`#add-product-${product.id}`);
            if (!addProductButton) return;
            else {
                addProductButton.addEventListener('click', () => {
                    console.log('Add button clicked' + product.id);
                    addProductToCartFromCart(product.id);
                });
            }
        });
        const cartTotal = cart.reduce((total, product) => total + product.price * product.quantity, 0);
        document.querySelector('.cart-total').textContent = `Total: $${cartTotal}`;
    }
}
