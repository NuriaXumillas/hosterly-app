import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Configuración común para las solicitudes de propiedades
const propertiesAPI = {
  get: async (url, params = {}) => {
    try {
      const response = await api.get(url, { params });
      return response.data;
    } catch (error) {
      console.error('API Error:', error.response?.data || error.message);
      throw error;
    }
  }
};

export const getProperties = async (search = '') => {
    return propertiesAPI.get('/properties', {
      params: {  
        search: search.toLowerCase().trim()
      }
    });
  };

export const getPropertyById = async (id) => {
  try {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching property:', error.response?.data || error.message);
    throw error;
  }
};

export const loginUser = async (credentials) => {
  try {
    const response = await api.post('/users/login', credentials);
    return response.data;
  } catch (error) {
    console.error('Login Error:', error.response?.data || error.message);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/users/register', userData);
    return response.data;
  } catch (error) {
    console.error('Registration Error:', error.response?.data || error.message);
    throw error;
  }
};

// Funciones de reservas y disponibilidad 
export const createBooking = async (bookingData) => {
    try {
      const response = await api.post('/bookings', bookingData);
      return response.data;
    } catch (error) {
      console.error('Booking Error:', error.response?.data || error.message);
      throw error;
    }
  };
  
  export const checkAvailability = async (propertyId, checkIn, checkOut) => {
    try {
      const response = await api.get(`/properties/${propertyId}/availability`, {
        params: { checkIn, checkOut }
      });
      return response.data;
    } catch (error) {
      console.error('Availability Error:', error.response?.data || error.message);
      throw error;
    }
  };
  
  export const getUserBookings = async () => {
    try {
      const response = await api.get('/bookings');
      return response.data;
    } catch (error) {
      console.error('Bookings Error:', error.response?.data || error.message);
      throw error;
    }
  };