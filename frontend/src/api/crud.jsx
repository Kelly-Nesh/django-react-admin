import API_URL, { HEADERS } from "./base";
import axios from "axios";
import { cl } from "./base";

export async function getAllModels(token) {
  cl(3, token)
  HEADERS.headers.Authorization = "Token " + token;
  return await axios.get(API_URL, HEADERS);
}

export async function createModel(token, data) {
  HEADERS.headers.Authorization = "Token " + token;
  return await axios.post(API_URL, HEADERS, data);
}

export async function updateModel(token, data) {
  HEADERS.headers.Authorization = "Token " + token;
  return await axios.put(API_URL, HEADERS, data);
}

export async function deleteModel(token, slug) {
  HEADERS.headers.Authorization = "Token " + token;
  return await axios.delete(API_URL, HEADERS, slug);
}