import axios from 'axios';

const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api/v1';

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor global para manejo de errores de red
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // Si hay un error de red o timeout
    if (error.code === 'ERR_NETWORK') {
      console.error('Error de conexión con el servidor. Verifica tu internet o si el servidor está en línea.');
    }
    return Promise.reject(error);
  }
);
