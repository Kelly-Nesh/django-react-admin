import { useQuery } from "@tanstack/react-query";
import { getAllModels, getItem } from "../api/crud";
import { cl } from "../api/base";

export function useGetModels(token) {
  return useQuery({
    queryKey: ["models"],
    queryFn: () => getAllModels(token),
  });
}

export function useRetrieveItem({ model, slug, token }) {
  if (!slug) return {};
  return useQuery({
    queryKey: ["models", model, slug, token],
    queryFn: getItem,
  });
}
