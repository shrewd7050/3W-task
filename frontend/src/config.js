const BACKEND_URL = import.meta.env.PROD
  ? (import.meta.env.VITE_BACKEND_URL || 'https://threew-task-wvap.onrender.com')
  : 'http://localhost:5001';

export default BACKEND_URL;
