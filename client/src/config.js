// config.js
const isLocalhost = window.location.hostname === "localhost";

export const API_BASE_URL = isLocalhost
  ? "http://localhost:5000" // when running on your laptop
  : "https://c305fd77bfb3.ngrok-free.app"; // when opened via ngrok
