export function authenticate(username, password) {
    // autenticación simple
    if (username === 'admin' && password === '123456') {
        localStorage.setItem('user', 'admin');
        return true; // exitosa
    }
    return false; // fallida
}

export function isAdminLoggedIn() {
    return localStorage.getItem('user') === 'admin';
}

export function logout() {
    localStorage.removeItem('user');
}
