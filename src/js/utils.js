import { loadCart } from "./cart.js";
import { loadProducts } from "./products.js";

export function zoomImage(image) {
    image.style.transform = 'scale(1.1)';
    image.style.transition = 'transform 0.5s';
    image.style.zIndex = '2';
    image.style.position = 'relative';
}
export function zoomReset(image) {
    image.style.transform = 'scale(1)';
    image.style.zIndex = '1';
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
            // Update product in product page
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
    // Update product in product page
    if (document.querySelector(`#product-${productId}`)) {
        document.querySelector(`#product-${productId} .product-stock`).textContent = `Disponibles: ${cart[cartProductIndex].stock}`;
    }
    // Update product in localStorage
    const products = JSON.parse(localStorage.getItem('products'));
    const product = products.find(item => item.id === productId);
    console.log('LOCAL STORAGE PRODUCT:', product);
    product.stock = cart[cartProductIndex].stock;
    localStorage.setItem('products', JSON.stringify(products));

    if (cart[cartProductIndex].quantity === 0) {
        cart.splice(cartProductIndex, 1);
    }
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log(cart);

    loadCart();

    if (document.querySelector(`#product-${productId}`)) {
        loadProducts();
    }
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
    // Update product in product page
    if (document.querySelector(`#product-${productId}`)) {
        document.querySelector(`#product-${productId} .product-stock`).textContent = `Disponibles: ${cart[cartProductIndex].stock}`;
    }
    // Update product in localStorage
    const products = JSON.parse(localStorage.getItem('products'));
    const product = products.find(item => item.id === productId);
    console.log('LOCAL STORAGE PRODUCT:', product);
    product.stock = cart[cartProductIndex].stock;
    localStorage.setItem('products', JSON.stringify(products));
    localStorage.setItem('cart', JSON.stringify(cart));
    console.log(cart);
    loadCart();

    if (document.querySelector(`#product-${productId}`)) {
        loadProducts();
    }
}

export function getProducts() {
    // Get products from localStorage
    const products = JSON.parse(localStorage.getItem('products'));
    return products;
}

export function getCart() {
    // Get cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart'));
    return cart;
}

export function getProductByCategory(category) {
    // Get product by category from localStorage
    const products = JSON.parse(localStorage.getItem('products'));
    const product = products.filter(item => item.category === category);
    return product;
}

export function getCategories() {
    // Get categories from localStorage
    const categories = []
    const products = JSON.parse(localStorage.getItem('products'));
    products.forEach(product => {
        if (!categories.includes(product.category) && product.category !== '') {
            categories.push(product.category);
        }
    });
    console.log('CATEGORIES:', categories);
    return categories;
}

export function renderProducts(products, container, template) {
    products.forEach(product => {
        // Clona el nodo del template *antes* de modificarlo dentro del loop.
        const productElement = document.importNode(template, true);
  
        // Modifica el contenido del template clonado con la información del producto.
        productElement.querySelector('.product-image').src = product.image;
        productElement.querySelector('.product-image').alt = product.name;
        productElement.querySelector('.product-id').textContent = `ID: ${product.id}`;
        productElement.querySelector('.product-name').textContent = product.name;
        productElement.querySelector('.product-description').textContent = product.description;
        productElement.querySelector('.product-price').textContent = `$${product.price}`;
        productElement.querySelector('.product-stock').textContent = `Disponibles: ${product.stock}`;
        // Se agrega id al botón para poder identificarlo
        productElement.querySelector('.add-to-cart').id = `add-to-cart-${product.id}`;
        // Se agrega id al div para poder identificarlo
        productElement.querySelector('.product').id = `product-${product.id}`;
        // Se agrega clase al div para poder identificar el toast
        productElement.querySelector('.toast-info').classList.add(`toast-${product.id}`);
  
        // Agrega el elemento clonado y modificado al contenedor.
        container.appendChild(productElement);
        // Agregar evento para hacer zoom en la imagen
        const productImages = document.querySelectorAll('.product-image');
        productImages.forEach(image => {
          image.addEventListener('mouseover', () => {
            // console.log('mouseover');
            zoomImage(image);
          });
          image.addEventListener('mouseout', () => {
            // console.log('mouseout');
            zoomReset(image);
          });
        });
        // Toast para mostrar mensaje de producto agregado al carrito
        const toastAddToCart = document.getElementById('toast-add-to-cart');
        const toast = new bootstrap.Toast(toastAddToCart);
    
        function showToastAddProduct() {
          console.log('product stock:', product.stock);
          const productName = document.querySelector(`#product-${product.id} .product-name`).textContent;
          const productImage = document.querySelector(`#product-${product.id} .product-image`).src;
          toastAddToCart.querySelector('.toast-image').src = productImage;
          if (product.stock === 0) {
            // se cambia estilo del toast a danger
            toastAddToCart.classList.remove('bg-success-add');
            toastAddToCart.classList.add('bg-warnings');
            toastAddToCart.querySelector('.toast-body').textContent = `${productName} no tiene stock`;
            toastAddToCart.querySelector('.toast-text').textContent = `Producto sin stock`;
          }
          else {
            toastAddToCart.classList.remove('bg-warnings');
            toastAddToCart.classList.add('bg-success-add');
            toastAddToCart.querySelector('.toast-body').textContent = `${productName} agregado al carrito`;
            toastAddToCart.querySelector('.toast-text').textContent = `Producto agregado al carrito`;
          }
          toast.show();
        }
  
        const addToCartButton = document.querySelector(`#add-to-cart-${product.id}`);
        addToCartButton.addEventListener('click', () => {
          console.log('product stock:', product.stock);
          if (product.stock === 0) {
            showToastAddProduct();
            return;
          }
          addProductToCart(product);
          showToastAddProduct();
        });
    });
}

export function renderCategories(categories, container, onCategoryClick) {
    categories.forEach(category => {
        const categoryElement = document.createElement('div');
        categoryElement.classList.add('category');
        categoryElement.id = `category-${category}`;
        categoryElement.textContent = category;
        categoryElement.addEventListener('click', () => onCategoryClick(category));
        container.appendChild(categoryElement);
      });
}