import { loadCart } from '../pages/cart.js';

export function getCart() {
    // Obtiene el carrito desde localStorage
    const cart = JSON.parse(localStorage.getItem('cart'));
    return cart;
}

export function addProductToCart(product) {
    // Actualizamos stock del producto desde localStorage
    const products = JSON.parse(localStorage.getItem('products'));
    const productIndex = products.findIndex(item => item.id === product.id);
    products[productIndex].stock--;
    localStorage.setItem('products', JSON.stringify(products));
    // console.log(product);
    if (product.stock === 0) {
        return;
    }
    else {
        product.stock--;
        const cart = JSON.parse(localStorage.getItem('cart'));
        const productInCart = cart.find(item => item.id === product.id);
        if (productInCart) {
            productInCart.stock = product.stock;
            productInCart.quantity++;
            productInCart.total = productInCart.quantity * productInCart.price;
            // Actualiza el producto en la página de productos
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        const productElement = document.querySelector(`#product-${product.id}`);
        productElement.querySelector('.product-stock').textContent = `Disponibles: ${product.stock}`;
        localStorage.setItem('cart', JSON.stringify(cart));
        console.log(cart);
    }
    loadCart();
}

export function removeProductFromCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const cartProductIndex = cart.findIndex(item => item.id === productId);
    cart[cartProductIndex].stock++;
    cart[cartProductIndex].quantity--;
    cart[cartProductIndex].total = cart[cartProductIndex].quantity * cart[cartProductIndex].price;
    // Actualiza el producto en la página de productos
    if (document.querySelector(`#product-${productId}`)) {
        document.querySelector(`#product-${productId} .product-stock`).textContent = `Disponibles: ${cart[cartProductIndex].stock}`;
    }
    // Actualiza el producto en localStorage
    const products = JSON.parse(localStorage.getItem('products'));
    const product = products.find(item => item.id === productId);
    console.log('PRODUCTO EN LOCAL STORAGE:', product);
    product.stock = cart[cartProductIndex].stock;
    localStorage.setItem('products', JSON.stringify(products));

    if (cart[cartProductIndex].quantity === 0) {
        cart.splice(cartProductIndex, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log(cart);

    loadCart();

}

export function addProductToCartFromCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart'));
    const cartProductIndex = cart.findIndex(item => item.id === productId);
    // Toast para mostrar mensaje de producto agregado al carrito
    const toastAddToCart = document.getElementById('toast-added-to-cart');
    const toast = new bootstrap.Toast(toastAddToCart);

    function showToastAddProduct() {
        const products = JSON.parse(localStorage.getItem('products'));
        const product = products.find(item => item.id === productId);
        if (product.stock === 0) {
            toastAddToCart.querySelector('.toast-body').textContent = 'No hay mas stock disponible';
        }
        toast.show();
    }
    if (cart[cartProductIndex].stock === 0) {
        showToastAddProduct();
        return;
    }
    cart[cartProductIndex].stock--;
    cart[cartProductIndex].quantity++;
    cart[cartProductIndex].total = cart[cartProductIndex].quantity * cart[cartProductIndex].price;
    // Actualiza el producto en la página de productos
    if (document.querySelector(`#product-${productId}`)) {
        document.querySelector(`#product-${productId} .product-stock`).textContent = `Disponibles: ${cart[cartProductIndex].stock}`;
    }
    // Actualiza el producto en localStorage
    const products = JSON.parse(localStorage.getItem('products'));
    const product = products.find(item => item.id === productId);
    console.log('PRODUCTO EN LOCAL STORAGE:', product);
    product.stock = cart[cartProductIndex].stock;
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log(cart);
    loadCart();

    // if (document.querySelector(`#product-${productId}`)) {
    //     loadProducts();
    // }
}