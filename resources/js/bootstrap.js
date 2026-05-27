import axios from 'axios';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

window.axios = axios;

window.axios.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

window.Pusher = Pusher;

window.Echo = new Echo({
    broadcaster: 'pusher',
    key: import.meta.env.VITE_PUSHER_APP_KEY || 'local',
    cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER || 'mt1',
    host: import.meta.env.VITE_PUSHER_HOST || '127.0.0.1',
    port: import.meta.env.VITE_PUSHER_PORT || 6001,
    wsHost: import.meta.env.VITE_PUSHER_HOST || '127.0.0.1',
    wsPort: import.meta.env.VITE_PUSHER_PORT || 6001,
    forceTLS: false,
    encrypted: false,
    disableStats: true,
    boardcastTransport: 'ws',
});

window.Echo.connector.pusher.config.host = import.meta.env.VITE_PUSHER_HOST || window.location.hostname;
window.Echo.connector.pusher.config.port = import.meta.env.VITE_PUSHER_PORT || 6001;

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response && error.response.status === 401 && !window.location.pathname.includes('/login')) {
            localStorage.removeItem('auth_token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const originalFetch = window.fetch;
window.fetch = async function () {
    const response = await originalFetch.apply(this, arguments);
    if (response.status === 401 && !window.location.pathname.includes('/login')) {
        localStorage.removeItem('auth_token');
        window.location.href = '/login';
        return new Promise(() => {});
    }
    return response;
};
