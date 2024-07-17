import axios from "axios";
import { API_URL } from "../auth/login";


export const homeGet = async () => {
  console.log(API_URL);
  return await axios
    .get(API_URL)
    .then((response) => {
      console.log(response.data);
      return response.data;
    })
    .catch((err) => console.log(err.message));
};
