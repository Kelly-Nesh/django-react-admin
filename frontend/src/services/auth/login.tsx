import axios from "axios";

export const API_URL = "http://" + window.location.hostname + ":8000";
export const TOKEN_URL = API_URL + "/api/token/";

interface Details {
  username: string;
  password: string;
}

export default async function login(details: Details) {
  return await axios
    .post(TOKEN_URL, details)
    .then((response) => {
      if (response.status === 200) {
        sessionStorage.setItem("access", response.data.access);
        sessionStorage.setItem("refresh", response.data.refresh);
        return response.status;
      }
    })
    .catch((err) => console.log(err.message, err.status));
}
