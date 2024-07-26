import axios from "axios";
import { API_URL, refreshToken } from "../auth/login";
import { cl } from "../../App";

export const modelGet = (token: string, app: string, model: string) => {
  if (typeof token !== "string") return;
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const MODEL_URL = `${API_URL}/${app}/${model}/`;

  return axios
    .get(MODEL_URL)
    .then((response) => {
      cl(response.status);
      if (response.status === 401) {
        refreshToken();
      }
      return response.data;
    })
    .catch((err) => {
      console.log(err.status, err.message);
    });
};
