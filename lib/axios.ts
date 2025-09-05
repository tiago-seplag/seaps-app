import axios from "axios";
import { toast } from "sonner";

export const api = axios;

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.data?.messages?.length > 0) {
      error.response.data.messages.map((msg: string) => toast.error(msg));
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message, {
        description: error.response.data.action,
      });
    } else {
      toast.error("Erro ao tentar processar a requisição. Tente novamente.");
    }

    if (error.response?.status === 401) {
      window.location.replace("/login");
    }

    return Promise.reject(error);
  },
);
