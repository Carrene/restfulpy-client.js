
export const BASE_URL = process.env.NODE_ENV === 'production'
  ? `${window.location.protocol}//${window.location.hostname}:${window.location.port}` : 'http://localhost:8081'
