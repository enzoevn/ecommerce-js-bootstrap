// ESTO SE USA CON VITE

// import { loadHome } from './home.js';
// import { loadProducts } from './products.js';
// import { loadCategories } from './categories.js';

// // Sistema de enrutamiento
// export function handleRoute() {
//   const path = window.location.pathname;
  
//   // Remover clases activas de todos los enlaces
//   document.querySelectorAll('.nav-link').forEach(link => {
//     link.classList.remove('active');
//   });
  
//   // Cargar la página correspondiente según la ruta
//   switch(path) {
//     case '/products':
//       document.getElementById('products-link').classList.add('active');
//       loadProducts();
//       break;
//     case '/categories':
//       document.getElementById('categories-link').classList.add('active');
//       loadCategories();
//       break;
//     case '/home':
//     case '/':
//     default:
//       document.getElementById('home-link').classList.add('active');
//       loadHome();
//       break;
//   }
// }

// // Configurar el enrutamiento
// export function setupRouter() {
//   // Interceptar clicks en los enlaces de navegación
//   document.getElementById('home-link').addEventListener('click', (e) => {
//     e.preventDefault();
//     history.pushState(null, '', '/home');
//     handleRoute();
//   });

//   document.getElementById('products-link').addEventListener('click', (e) => {
//     e.preventDefault();
//     history.pushState(null, '', '/products');
//     handleRoute();
//   });

//   document.getElementById('categories-link').addEventListener('click', (e) => {
//     e.preventDefault();
//     history.pushState(null, '', '/categories');
//     handleRoute();
//   });

//   // Manejar el evento popstate (cuando usuario usa botones atrás/adelante)
//   window.addEventListener('popstate', handleRoute);

//   // Cargar la ruta inicial
//   handleRoute();
// }


// PARA QUE FUNCIONE CON LIVE SERVER

import { loadHome } from './pages/home.js';
import { loadProducts } from './pages/products.js';
import { loadAdminPanel } from './pages/adminPanel.js';
import { loadLogin } from './pages/login.js';

// Sistema de enrutamiento
export function handleRoute() {
  // Get the hash from the URL (without the # character)
  const hash = window.location.hash.slice(1) || '/';
  console.log('Current hash route:', hash);
  
  // Remover clases activas de todos los enlaces y del botón admin
  document.querySelectorAll('.nav-link, #admin-panel-link').forEach(el => {
    el.classList.remove('active');
  });
  
  // Cargar la página correspondiente según la ruta
  switch(hash) {
    case 'home':
    case '':
    case '/':
    default:
      console.log('Loading home page');
      document.getElementById('home-link').classList.add('active');
      loadHome();
      break;
    case 'products':
      console.log('Loading products page');
      document.getElementById('products-link').classList.add('active');
      loadProducts();
      break;
    case 'login':
      console.log('Loading login page');
      document.getElementById('login-link').classList.add('active');
      loadLogin();
      break;
    case 'admin-panel':
      console.log('Loading admin panel page');
      loadAdminPanel();
      break;
  }
}

// Configurar el enrutamiento
export function setupRouter() {
  console.log('Setting up router');
  
  // Interceptar clicks en los enlaces de navegación
  document.getElementById('home-link').addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Home link clicked');
    window.location.hash = 'home';
  });

  document.getElementById('products-link').addEventListener('click', (e) => {
    e.preventDefault();
    console.log('Products link clicked');
    window.location.hash = 'products';
  });

  // Manejar el evento hashchange
  window.addEventListener('hashchange', handleRoute);

  // Cargar la ruta inicial
  handleRoute();
}