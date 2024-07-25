import axios from "axios";
import { API_URL, refreshToken } from "../auth/login";
import { cl } from "../../App";

export const homeGet = async (token: string) => {
  if (typeof token !== "string") return;
  axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  return await axios
    .get(API_URL)
    .then((response) => {
      // cl(response.status);
      if (response.status === 401) {
        refreshToken();
      }
      return response.data;
    })
    .catch((err) => console.log(err.message));
};
