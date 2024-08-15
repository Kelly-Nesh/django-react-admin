import axios from "axios";
import { API_URL, refreshToken } from "../auth/login";
import { cl } from "../../App";

export const custom_axios = axios.create();
custom_axios.interceptors.response.use(
  (res) => res,
  (err) => {
    cl(err.toJSON());
    if (err.response.status === 401) {
      refreshToken();
      location.reload();
    } else {
      return err;
    }
  }
);

export const homeGet = async (token: string) => {
  if (typeof token !== "string") return;
  custom_axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  return await axios
    .get(API_URL, { headers: { Authorization: `Bearer ${token}` } })
    .then((response) => {
      return response.data;
    })
    .catch((err) => console.log(err.message));
};
