import axios from "axios";

const http = axios.create({
  baseURL: "http://localhost:3000/api",
  withCredentials: true,
});

http.interceptors.response.use(
  (response) => response.data,
  (error) => {
    return Promise.reject(error);
  }
);

const profile = () => http.get("/sessions/me"); 

const register = (user) => http.post("/users", user);

const login = (user) => http.post("/login", user);

const logout = () => http.delete("/sessions");

const getProperties = () => http.get("/properties");

const getPropertyById = (id) => http.get(`/properties/${id}`);

const createProperty = (property) => http.post("/properties", property);

const updateProperty = (id, property) => http.put(`/properties/${id}`, property);

const deleteProperty = (id) => http.delete(`/properties/${id}`);

const createBooking = (booking) => http.post("/bookings", booking);

const deleteBooking = (id) => http.delete(`/bookings/${id}`);

const checkAvailability = (id, dates) => http.get(`/properties/${id}/availability`, { params: dates });

const getUserBookings = () => http.get("/bookings");

const getBookingsByProperty = (id) => http.get(`/properties/${id}/bookings`);



export {
  profile,
  register,
  login,
  logout,
  getProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  createBooking,
  deleteBooking,
  checkAvailability,
  getUserBookings,
  getBookingsByProperty,
};
