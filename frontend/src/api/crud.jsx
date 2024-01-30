import API_URL, { HEADERS } from "./base";
import axios from "axios";
import { cl } from "./base";

export async function getAllModels(token) {
  // cl(3, token);
  HEADERS.headers.Authorization = "Token " + token;
  return await axios.get(API_URL, HEADERS);
}

export async function createModel({ model, token, data }) {
  // cl("axios-create", model, token, data);
  HEADERS.headers.Authorization = "Token " + token;
  return await axios.post(`${API_URL}${model}/`, data, HEADERS);
}

export async function updateModel({ token, data, model, slug }) {
  // cl("axios", data, token, model, slug);
  HEADERS.headers.Authorization = "Token " + token;
  return await axios.patch(`${API_URL}${model}/${slug}/`, data, HEADERS);
}

export async function deleteModel(token, slug) {
  HEADERS.headers.Authorization = "Token " + token;
  return await axios.delete(API_URL, slug, HEADERS);
}
