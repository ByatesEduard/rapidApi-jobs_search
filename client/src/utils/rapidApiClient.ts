import axios from "axios";

const rapidKey = (import.meta as any).env?.VITE_RAPID_API_KEY as string | undefined;

if (!rapidKey) {
  console.error(
    "Missing VITE_RAPID_API_KEY. Create client/.env with: VITE_RAPID_API_KEY=YOUR_KEY and restart the dev server."
  );
}

export const rapidApiClient = axios.create({
  baseURL: "https://jsearch.p.rapidapi.com",
  headers: {
    "X-RapidAPI-Host": "jsearch.p.rapidapi.com",
    "X-RapidAPI-Key": rapidKey ?? "",
  },
});

export default rapidApiClient;