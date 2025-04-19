import { zoomImage, zoomReset } from './effectsUtils.js';
import { addProductToCart } from './cartUtils.js';

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
          const productImageSrc = document.querySelector(`#product-${product.id} .product-image`).src;
          // Seleccionar el elemento de la imagen del toast
          const toastImageElement = toastAddToCart.querySelector('.toast-image');
          // Establecer la fuente de la imagen
          toastImageElement.src = productImageSrc;
          // Aplicar para tamaño fijo y ajuste de imagen
          toastImageElement.style.width = '50px';
          toastImageElement.style.height = '50px';
          toastImageElement.style.objectFit = 'cover';

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
        categoryElement.id = `category-${category.id}`;
        categoryElement.textContent = category.name;
        categoryElement.addEventListener('click', () => onCategoryClick(category.id));
        container.appendChild(categoryElement);
      });
}