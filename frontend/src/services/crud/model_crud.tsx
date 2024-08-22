import { API_URL, custom_axios } from "../auth/login";

export const modelGet = (
  token: string,
  app: string,
  model: string,
  id: number = -1
) => {
  if (typeof token !== "string") return;
  custom_axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  const MODEL_URL = `${API_URL}/${app}/${model}/${id !== -1 ? id + "/" : ""}`;

  return custom_axios
    .get(MODEL_URL)
    .then((response) => {
      return response.data;
    })
    .catch((err) => {
      console.log(err.status, err.message);
    });
};
