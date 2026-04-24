// Single source of truth for backend API base URLs.
// Override in your .env file (project root):
//   VITE_API_BASE_URL=https://localhost:7167
//   VITE_FREELANCER_API_BASE_URL=https://localhost:7167   (optional, defaults to VITE_API_BASE_URL)

export const API_BASE_URL: string =
  import.meta.env.VITE_API_BASE_URL ||
  'https://support360api-gnbxffdbdvemcjan.canadacentral-01.azurewebsites.net';

export const FREELANCER_API_BASE_URL: string =
  import.meta.env.VITE_FREELANCER_API_BASE_URL || API_BASE_URL;
