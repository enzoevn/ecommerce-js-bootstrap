import { resetProducts } from '../main.js';
import { loadCart } from './cart.js';
import { getProducts, getCategories, getProductByCategory, getCategoryById } from '../utils/fetchUtils.js';
import { renderProducts, renderCategories } from '../utils/renderUtils.js';

export async function loadProducts() {
  // Update products
  const products = await getProducts();
  try {
    const response = await fetch('./src/templates/products.html');
    if (!response.ok) {
      throw new Error('Failed to load products.html');
    }

    const html = await response.text();
    document.querySelector('#app').innerHTML = html;

    // Mostrar categorías
    const categoriesContainer = document.getElementById('categories-container');

    // Mostrar productos
    const productsContainer = document.getElementById('products-container');
    const productTemplate = document.getElementById('product-template').content;
    // Renderizar todos los productos al cargar la página
    renderProducts(products, productsContainer, productTemplate);

    const onCategoryClick = async (categoryId) => {
      // Limpiar el contenedor de productos
      productsContainer.innerHTML = '';
      // Obtener productos de la categoría
      console.log('categoryId:', categoryId);
      const category = await getCategoryById(categoryId);
      console.log('category:', category);
      const products = await getProductByCategory(category);
      console.log(`products: ${category}`, products);
      renderProducts(products, productsContainer, productTemplate);
    }
    const categories = await getCategories();
    renderCategories(categories, categoriesContainer, onCategoryClick);

    // Agregar botón para reiniciar productos
    const resetButton = document.getElementById('reset-button');
    resetButton.addEventListener('click', () => {
      resetProducts();
    });

  } catch (error) {
    console.error(error);
    document.querySelector('#app').innerHTML = '<p>Error al cargar la página.</p>';
  }
  // Reload cart
  loadCart();
}