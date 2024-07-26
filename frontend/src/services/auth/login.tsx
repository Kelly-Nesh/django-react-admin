import axios from "axios";
import { cl } from "../../App";

export const API_URL = "http://" + window.location.hostname + ":8000";
export const TOKEN_URL = API_URL + "/api/token/";
export let intervalId: number;

interface Details {
  username: string;
  password: string;
}

export default async function login(details: Details) {
  const HOUR = 3_600_000; // ms
  return await axios
    .post(TOKEN_URL, details)
    .then((response) => {
      if (response.status === 200) {
        sessionStorage.setItem("access", response.data.access);
        sessionStorage.setItem("refresh", response.data.refresh);
        intervalId = setInterval(refreshToken, HOUR);
        return response.status;
      }
    })
    .catch((err) => console.log(err.message, err.status));
}

/* Check response code
  if 401_UNAUTHORIZED then try to refresh token
  */
export const refreshToken = () => {
  // Make a POST request to refresh token
  cl("refresh");
  axios
    .post(TOKEN_URL + "refresh/", {
      refresh: `${sessionStorage.getItem("refresh")}`,
    })
    .then((response) => {
      sessionStorage.setItem("access", response.data.access);
      return response.status;
    })
    .catch((err) => console.log(err.message, err.status));
};
