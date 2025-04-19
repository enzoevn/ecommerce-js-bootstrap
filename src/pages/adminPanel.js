import { getCategories, createCategory, createProduct } from '../utils/fetchUtils.js';

export async function loadAdminPanel() {
    try {
        // Redireccionar a la página de login si no es admin
        if (localStorage.getItem('user') !== 'admin') {
            console.log('User is not admin, redirecting to login');
            window.location.hash = '#login';
            return; // Detener la ejecución si no es admin
        }

        console.log('Loading admin panel template');
        const response = await fetch('./src/templates/admin-panel.html');
        if (!response.ok) {
            throw new Error('Failed to load admin-panel.html');
        }
        const html = await response.text();
        document.querySelector('#app').innerHTML = html;
        console.log('Admin panel loaded successfully');
        
        // --- Lógica para formularios --- 

        const categoryForm = document.getElementById('create-category-form');
        const productForm = document.getElementById('create-product-form');
        const categorySelect = document.getElementById('product-category');

        // --- Instancia del Toast de Bootstrap ---
        const toastElement = document.getElementById('admin-toast');
        const toastBody = toastElement.querySelector('.toast-body');
        const adminToast = new bootstrap.Toast(toastElement); 

        // Función para mostrar el Toast con mensaje y tipo (éxito/error)
        function showAdminToast(message, type = 'success') {
            toastBody.textContent = message;
            // Cambiar clase para color de fondo
            toastElement.classList.remove('bg-success', 'bg-danger', 'text-white');
            if (type === 'error') {
                toastElement.classList.add('bg-danger', 'text-white');
            } else {
                toastElement.classList.add('bg-success', 'text-white');
            }
            adminToast.show();
        }

        // Cargar categorías en el select
        async function populateCategories() {
            const categories = await getCategories();
            categorySelect.innerHTML = '<option value="">Selecciona una categoría</option>'; // Resetear opciones
            categories.forEach(category => {
                const option = document.createElement('option');
                option.value = category.id;
                option.textContent = category.name;
                categorySelect.appendChild(option);
            });
        }

        // Manejar envío del formulario de categoría
        categoryForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const name = document.getElementById('category-name').value;
            const description = document.getElementById('category-description').value;

            if (!name) {
                showAdminToast('Por favor, ingresa el nombre de la categoría.', 'error');
                return;
            }

            const categoryData = { name, description };
            try {
                const newCategory = await createCategory(categoryData);
                showAdminToast(`Categoría "${newCategory.name}" creada con éxito.`);
                categoryForm.reset();
                await populateCategories(); // Actualizar select de productos
            } catch (error) {
                console.error('Error al crear categoría:', error);
                showAdminToast('Error al crear la categoría.', 'error');
            }
        });

        // Manejar envío del formulario de producto
        productForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const name = document.getElementById('product-name').value;
            const description = document.getElementById('product-description').value;
            const price = parseFloat(document.getElementById('product-price').value);
            const stock = parseInt(document.getElementById('product-stock').value, 10);
            const imageFile = document.getElementById('product-image').files[0]; // Obtener el archivo
            const category_id = parseInt(document.getElementById('product-category').value, 10);

            if (!name || !description || isNaN(price) || isNaN(stock) || !imageFile || isNaN(category_id)) {
                showAdminToast('Por favor, completa todos los campos y selecciona una imagen.', 'error');
                return;
            }

            // Leer el archivo como Data URL
            const reader = new FileReader();
            reader.onloadend = async () => {
                const image = reader.result; // Contiene la imagen como Data URL (Base64)
                const productData = { name, description, price, stock, image, category_id };
                
                try {
                    const newProduct = await createProduct(productData);
                    showAdminToast(`Producto "${newProduct.name}" creado con éxito.`);
                    productForm.reset();
                } catch (error) {
                    console.error('Error al crear producto:', error);
                    showAdminToast('Error al crear el producto.', 'error');
                }
            };
            reader.onerror = () => {
                console.error('Error al leer el archivo de imagen.');
                showAdminToast('Error al procesar la imagen.', 'error');
            };
            reader.readAsDataURL(imageFile); // Iniciar lectura
        });

        // Cargar categorías iniciales al cargar el panel
        await populateCategories();

    } catch (error) {
        console.error('Error loading admin panel:', error);
        document.querySelector('#app').innerHTML = '<p>Error al cargar el panel de administración.</p>';
    }
}
