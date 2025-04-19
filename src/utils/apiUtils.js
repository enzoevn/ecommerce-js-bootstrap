/**
 * Obtiene la lista de productos desde el archivo JSON.
 * @async
 * @returns {Promise<Array<Object>>} Una promesa que resuelve a un array de objetos de producto.
 *                                      Devuelve un array vacío si ocurre un error.
 */
export async function fetchProducts() {
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

/**
 * Obtiene la lista de categorías desde el archivo JSON.
 * @async
 * @returns {Promise<Array<Object>>} Una promesa que resuelve a un array de objetos de categoría.
 *                                      Devuelve un array vacío si ocurre un error.
 */
export async function fetchCategories() {
  try {
    const response = await fetch('./src/categories.json');
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    console.log('CATEGORIES:', data); 
    return data;
  } catch (error) {
    console.error('Could not load categories:', error);
    return []; // Devolver un array vacío en caso de error
  }
}

export async function refreshProducts() {
  const products = await fetchProducts();
  localStorage.setItem('products', JSON.stringify(products));
}

export async function refreshCategories() {
  const categories = await fetchCategories();
  localStorage.setItem('categories', JSON.stringify(categories));
}

export async function createCategory(category) {
  const categories = await fetchCategories();
  categories.push(category);
  // Guardar categorías en JSON
  localStorage.setItem('categories', JSON.stringify(categories));
}

export async function createProduct(product) {
  const products = await fetchProducts();
  products.push(product);

}

