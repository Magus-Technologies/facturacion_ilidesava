import axios from 'axios';

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

// Un 401 solo significa "sesión vencida" cuando viene de NUESTRA API.
// Las APIs externas (apisperu, etc.) también devuelven 401 por sus propios
// motivos (suscripción vencida, token inválido) y no deben cerrar la sesión.
const esUrlPropia = (url) => {
    if (!url) return false;
    return url.startsWith('/') || url.startsWith(window.location.origin);
};

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        const url = error.config?.url || '';
        if (
            error.response &&
            error.response.status === 401 &&
            esUrlPropia(url) &&
            !window.location.pathname.includes('/login')
        ) {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const originalFetch = window.fetch;
window.fetch = async function (input) {
    const response = await originalFetch.apply(this, arguments);
    const url = typeof input === 'string' ? input : (input?.url || '');
    if (
        response.status === 401 &&
        esUrlPropia(url) &&
        !window.location.pathname.includes('/login')
    ) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        return new Promise(() => {});
    }
    return response;
};
