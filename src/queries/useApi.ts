import axios from "axios";

interface ApiError {
  message: string;
  status?: number;
}

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

const useApi = async <T>(
  method: "GET" | "POST" | "PUT" | "DELETE",
  path: string,
  data?: any,
  params?: Record<string, any>
): Promise<T> => {
  try {
    const response = await api.request<T>({
      method,
      url: path,
      data,
      params,
    });
    return response.data; // Return data strongly typed
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const apiError: ApiError = {
        message: error.response?.data.message || "An error occurred",
        status: error.response?.status,
      };
      throw apiError; // Throw custom API error
    }
    throw { message: "An error occurred", status: 500 }; // Default error
  }
};
export default useApi;