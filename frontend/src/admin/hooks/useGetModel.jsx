import { useQuery } from "@tanstack/react-query";
import { getAllModels, getItem } from "../api/crud";
import { cl } from "../api/base";
import { useEffect, useState } from "react";

export function useGetModel({ model, token }) {
  const [queryReturn, setQueryReturn] = useState();
  if (!model) model = "product";
  return useQuery({
    queryKey: ["models", model, token],
    queryFn: getAllModels,
  });
}

export function useRetrieveItem({ model, slug, token }) {
  // cl(model, slug, token);
  if (!slug) return {};
  return useQuery({
    queryKey: ["models", model, slug, token],
    queryFn: getItem,
  });
}
