// frontend/src/services/api.js
import axios from "axios";

// Base API (dev default)
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE || "http://localhost:5000",
  withCredentials: true,
});

// Simple in-memory access token holder
let accessToken = null;
export function setAccessToken(token) {
  accessToken = token || null;
}
export function getAccessToken() {
  return accessToken;
}

// Attach access token to each request
api.interceptors.request.use((config) => {
  const token = accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Auto refresh on 401, then retry once
let isRefreshing = false;
let pendingRequests = [];

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    const original = err.config;

    // If unauthorized and not already tried refresh
    if (err.response?.status === 401 && !original.__isRetryRequest) {
      // queue the request until refresh completes
      if (!isRefreshing) {
        isRefreshing = true;
        try {
          const { data } = await api.post("/api/auth/refresh");
          setAccessToken(data?.accessToken || null);
          pendingRequests.forEach((cb) => cb());
          pendingRequests = [];
        } catch (e) {
          setAccessToken(null);
          pendingRequests.forEach((cb) => cb(e));
          pendingRequests = [];
          throw err;
        } finally {
          isRefreshing = false;
        }
      }

      // return a promise that resolves after token refresh
      return new Promise((resolve, reject) => {
        pendingRequests.push(async (refreshErr) => {
          if (refreshErr) return reject(refreshErr);
          try {
            original.headers = original.headers || {};
            original.headers.Authorization = `Bearer ${getAccessToken()}`;
            original.__isRetryRequest = true;
            const resp = await api.request(original);
            resolve(resp);
          } catch (re) {
            reject(re);
          }
        });
      });
    }

    // otherwise, bubble up
    throw err;
  }
);

/**
 * Payment helper: create checkout session
 * body: { preset: 30 } or { customAmount: 75 } (amount in rupees)
 * returns: { url, sessionId, ... } (whatever backend returns)
 */
export async function createCheckoutSession(body) {
  const resp = await api.post("/api/payments/create-checkout-session", body);
  return resp.data || {};
}

// Attach helper to api instance so existing code can call api.createCheckoutSession(...)
api.createCheckoutSession = createCheckoutSession;

export function getRandomHall(eventId) {
  return api.get(`/api/events/${eventId}/random-hall`);
}

export default api;
