import { authenticate, isAdminLoggedIn } from '../utils/authUtils.js';
import { updateLoginButton } from '../main.js';

export async function loadLogin() {
    try {
        // Si el usuario ya es admin, redirigir al panel de admin
        if (isAdminLoggedIn()) {
            window.location.hash = 'admin-panel';
            return;
        }

        const response = await fetch('./src/templates/login.html');
        if (!response.ok) {
            throw new Error('Failed to load login.html');
        }
        const html = await response.text();
        document.querySelector('#app').innerHTML = html;

        // Añadir event listener al formulario de login
        const loginForm = document.getElementById('login-form'); // Asumiendo ID 'login-form'
        if (loginForm) {
            loginForm.addEventListener('submit', (event) => {
                event.preventDefault(); // Prevenir envío tradicional
                const usernameInput = document.getElementById('username'); // Asumiendo ID 'username'
                const passwordInput = document.getElementById('password'); // Asumiendo ID 'password'
                const errorMessage = document.getElementById('error-message'); // Asumiendo ID 'error-message' para mostrar errores

                if (!usernameInput || !passwordInput) {
                    console.error('Login form inputs not found');
                    if(errorMessage) errorMessage.textContent = 'Error en el formulario.';
                    return;
                }

                const username = usernameInput.value;
                const password = passwordInput.value;

                // Usar la función de autenticación importada
                if (authenticate(username, password)) {
                    updateLoginButton(); // Llamar para actualizar el botón inmediatamente
                    window.location.hash = 'admin-panel'; // Redirigir al panel de admin
                } else {
                     if(errorMessage) {
                         errorMessage.textContent = 'Usuario o contraseña incorrectos.';
                     } else {
                         alert('Usuario o contraseña incorrectos.'); // Fallback si no hay elemento de error
                     }
                    // Limpiar contraseña
                     if(passwordInput) passwordInput.value = '';
                }
            });
        } else {
            console.warn('Login form with ID \'login-form\' not found in the template.');
        }

    } catch (error) {
        console.error('Error loading login page:', error);
        document.querySelector('#app').innerHTML = '<p>Error al cargar la página de login.</p>';
    }
}