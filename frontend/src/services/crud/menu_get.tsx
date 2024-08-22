import axios from "axios";
import { API_URL, custom_axios } from "../auth/login";
import { cl } from "../../App";

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
