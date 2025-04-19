import { loadCart } from './pages/cart.js';
import { setupRouter } from './router.js';
import { fetchProducts, fetchCategories } from './utils/apiUtils.js';
import { isAdminLoggedIn, logout } from './utils/authUtils.js';

const cart = []
let categories = [];

// Variable para almacenar los productos cargados
let products = [];

// Guardar productos en localStorage si no están ya guardados
async function initializeProducts() {
  if (!localStorage.getItem('products')) {
    const defaultProducts = await fetchProducts();
    localStorage.setItem('products', JSON.stringify(defaultProducts));
  }
  // Cargar productos desde localStorage para uso en la aplicación
  products = JSON.parse(localStorage.getItem('products')) || [];
}

async function initializeCategories() {
  if (!localStorage.getItem('categories')) {
    const defaultCategories = await fetchCategories();
    localStorage.setItem('categories', JSON.stringify(defaultCategories));
  }
  // Cargar categorías desde localStorage para uso en la aplicación
  categories = JSON.parse(localStorage.getItem('categories')) || [];
  console.log('CATEGORIES:', categories);
}
// Guardar carrito en localStorage si no está ya guardado
if (!localStorage.getItem('cart')) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Función para reiniciar los productos a su estado predeterminado
async function resetProducts() {
  const defaultProducts = await fetchProducts();
  const defaultCategories = await fetchCategories();
  localStorage.setItem('products', JSON.stringify(defaultProducts));
  localStorage.setItem('cart', JSON.stringify([])); // Resetear también el carrito
  localStorage.setItem('categories', JSON.stringify(defaultCategories)); // Resetear también las categorías
  window.location.reload(); // Recargar la página para aplicar los cambios
}


// Función para actualizar el estado del botón de login/logout
function updateLoginButton() {
    const loginLink = document.getElementById('login-link');
    const adminPanelLink = document.getElementById('admin-panel-link'); // Obtener el botón de admin panel
    if (!loginLink || !adminPanelLink) return; // Revisar si ambos elementos existen

    // Configurar los botones según el estado de login
    if (isAdminLoggedIn()) {
        loginLink.innerHTML = '<i class="fas fa-sign-out-alt"></i> Logout';
        loginLink.href = '#'; // Evitar navegación a la página de login
        loginLink.onclick = (e) => {
            e.preventDefault();
            logout();
            updateLoginButton(); // Actualizar el botón después de logout
            window.location.hash = ''; // O redirigir a #home o #login
        };
        adminPanelLink.style.display = 'inline-block'; // Mostrar el botón de admin
    } else {
        loginLink.innerHTML = '<i class="fas fa-sign-in-alt"></i> Login Admin';
        loginLink.href = '#login';
        loginLink.onclick = null; // Asegurarse de remover el handler de logout si existe
        adminPanelLink.style.display = 'none'; // Ocultar el botón de admin
    }

    // Mostrar el botón ahora que está configurado
    loginLink.classList.remove('login-status-loading');
}

export { products, cart, resetProducts, initializeCategories, updateLoginButton };

document.addEventListener('DOMContentLoaded', async () => {
  // Inicializar productos (cargarlos desde JSON si es necesario y desde localStorage)
  await initializeProducts();

  // Configurar enrutamiento
  setupRouter();

  // Actualizar estado del botón login/logout
  updateLoginButton();

  // Inicializar categorías
  await initializeCategories();

  // Load cart
  loadCart();
  
});
