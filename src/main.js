import { loadCart } from './js/cart.js';
import { setupRouter } from './js/router.js';

const cart = []

// Variable para almacenar los productos cargados
let products = [];

// Función para cargar los productos desde el archivo JSON
async function fetchProducts() {
  try {
    const response = await fetch('./src/products.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Could not load products:', error);
    return []; // Devolver un array vacío en caso de error
  }
}

// Guardar productos en localStorage si no están ya guardados
async function initializeProducts() {
  if (!localStorage.getItem('products')) {
    const defaultProducts = await fetchProducts();
    localStorage.setItem('products', JSON.stringify(defaultProducts));
  }
  // Cargar productos desde localStorage para uso en la aplicación
  products = JSON.parse(localStorage.getItem('products')) || [];
}

// Guardar carrito en localStorage si no está ya guardado
if (!localStorage.getItem('cart')) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para reiniciar los productos a su estado predeterminado
async function resetProducts() {
  const defaultProducts = await fetchProducts();
  localStorage.setItem('products', JSON.stringify(defaultProducts));
  localStorage.setItem('cart', JSON.stringify([])); // Resetear también el carrito
  window.location.reload(); // Recargar la página para aplicar los cambios
}

export { products, cart, resetProducts, fetchProducts };

document.addEventListener('DOMContentLoaded', async () => {
  // Inicializar productos (cargarlos desde JSON si es necesario y desde localStorage)
  await initializeProducts();

  // Configurar enrutamiento
  setupRouter();

  // Load cart
  loadCart();
});
