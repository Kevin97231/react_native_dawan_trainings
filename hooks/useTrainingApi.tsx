import axios from "axios";
import { useState } from "react";

// // A récupérer depuis un .env
const baseUrl: string = "https://dawan.org/public/training/";

const api = axios.create({
  baseURL: baseUrl,
});

// // api.interceptors.request.use( config => {
// //     // Promise: objet javascript. Une promesse représente une valeur qui peut être disponible
// //     // dans le futur ou jamais. La fonction de rappelle fournie 'resolve' et sera appelée losque la promesse est résolue
// //     return new Promise( (resolve) => setTimeout( () => resolve(config), 1000)) // Délai de 3s
// // })

export const useTrainingApi = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleRequest = async (
    requestFunction: (...args: any[]) => Promise<any>,
    ...args: any[]
  ): Promise<any> => {
    setLoading(true);
    try {
      const response = await requestFunction(...args);
      setLoading(false);
      return response.data;
    } catch (err: any) {
      setLoading(false);
      setError(err);
      throw err;
    }
  };

  const get = (endpoint: string = "") => handleRequest(api.get, endpoint);
  return {
    loading,
    error,
    get,
  };
};
