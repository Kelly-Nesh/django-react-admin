import axios from "axios";
import { API_URL, refreshToken } from "../auth/login";
import { cl } from "../../App";

export const modelGet = (
  token: string,
  app: string,
  model: string,
  id: number = -1
) => {
  if (typeof token !== "string") return;
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const MODEL_URL = `${API_URL}/${app}/${model}/${id !== -1 ? id + "/" : ""}`;

  return axios
    .get(MODEL_URL)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err.status, err.message);
    });
};
