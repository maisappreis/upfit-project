import axios from 'axios';
axios.defaults.headers.common['Content-Type'] = 'application/json';

axios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    console.log('token no axios', token)
    if (token) {
      axios.defaults.baseURL = `${import.meta.env.VITE_API_URL}`
      config.headers.Authorization = `Bearer ${token}`;
    } else {
      axios.defaults.baseURL = `${import.meta.env.VITE_API_URL}/test`
    }
    return config;
  },
  (error) => Promise.reject(error)
);

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem('refreshToken');

      if (refreshToken) {
        try {
          const response = await axios.post('/token/refresh/', { refresh: refreshToken });
          const { access } = response.data;
          localStorage.setItem('accessToken', access);
          axios.defaults.headers.common['Authorization'] = `Bearer ${access}`;
          return axios(originalRequest);
        } catch (refreshError) {
            console.error(refreshError);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default axios;

