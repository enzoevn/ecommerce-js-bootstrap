import { fetchProducts, fetchCategories } from "./apiUtils.js";

// PRODUCTS

export async function getProducts() {
    // Intenta obtener productos desde localStorage
    const storedProducts = localStorage.getItem('products');
    if (storedProducts) {
        try {
            // Si existen, parsea y devuelve los productos
            return JSON.parse(storedProducts);
        } catch (e) {
            console.error("Error parsing products from localStorage", e);
            // Si hay error al parsear, elimina el item corrupto
            localStorage.removeItem('products');
        }
    }
    // Si no están en localStorage, obtiene los productos desde la API (JSON)
    const products = await fetchProducts();
    // Guarda los productos obtenidos en localStorage para futuras cargas
    localStorage.setItem('products', JSON.stringify(products));
    return products;
}

export async function getProductByCategory(category) {
    const categoryId = category.id;
    console.log('CATEGORY ID:', categoryId);
    // Obtener todos los productos (usando la lógica de localStorage)
    const products = await getProducts();
    const product = products.filter(item => item.category_id === categoryId);
    console.log('PRODUCT BY CATEGORY:', product);
    return product;
}

export async function createProduct(productData) {
    const products = await getProducts(); // Usar getProducts para obtener del localStorage
    // Asignar un nuevo ID basado en el último producto existente (para que no se repitan)
    const newId = products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1;
    const newProduct = {
        ...productData,
        id: newId
    };
    products.push(newProduct);
    // Guardar productos actualizados en localStorage
    localStorage.setItem('products', JSON.stringify(products));
    console.log('Producto creado:', newProduct);
    return newProduct; // Devolver el producto creado
}

// CATEGORIES

export async function getCategories() {
    // Intenta obtener categorías desde localStorage
    const storedCategories = localStorage.getItem('categories');
    if (storedCategories) {
        try {
            // Si existen, parsea y devuelve las categorías
            return JSON.parse(storedCategories);
        } catch (e) {
            console.error("Error parsing categories from localStorage", e);
            // Si hay error al parsear, elimina el item corrupto
            localStorage.removeItem('categories');
        }
    }

    // Si no están en localStorage, obtiene las categorías desde la API (JSON)
    const categories = await fetchCategories();
    console.log('CATEGORIES fetched:', categories);
    // Guarda las categorías obtenidas en localStorage para futuras cargas
    localStorage.setItem('categories', JSON.stringify(categories));
    return categories;
}

export async function getCategoryById(categoryId) {
    // Obtener todas las categorías (usando la lógica de localStorage)
    const categories = await getCategories();
    const category = categories.find(category => category.id === categoryId);
    return category;
}

export async function createCategory(categoryData) {
    const categories = await getCategories(); // Usar getCategories para obtener del localStorage
    // Asignar un nuevo ID basado en la última categoría existente (para que no se repitan)
    const newId = categories.length > 0 ? Math.max(...categories.map(c => c.id)) + 1 : 1;
    const newCategory = {
        ...categoryData,
        id: newId
    };
    categories.push(newCategory);
    // Guardar categorías actualizadas en localStorage
    localStorage.setItem('categories', JSON.stringify(categories));
    console.log('Categoría creada:', newCategory);
    return newCategory; // Devolver la categoría creada
}

