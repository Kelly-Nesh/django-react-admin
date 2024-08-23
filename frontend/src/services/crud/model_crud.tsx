import { API_URL, custom_axios } from "../auth/login";

export const modelGet = (
  token: string,
  app: string,
  model: string,
  id: number = -1,
  page: number = 1
) => {
  if (typeof token !== "string") return;
  custom_axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  let MODEL_URL = `${API_URL}/${app}/${model}/`;
  if (id >= 0) {
    MODEL_URL = MODEL_URL + `${id}/`;
  } else {
    MODEL_URL = MODEL_URL + `?page=${page}`
  }

  return custom_axios
    .get(MODEL_URL)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err.status, err.message);
    });
};
