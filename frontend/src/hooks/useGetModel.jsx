import { useQuery } from "@tanstack/react-query";
import { getAllModels } from "../api/crud";
import { cl } from "../api/base";

export function useGetModels(token) {
    cl(2, token)
  return useQuery({
    queryKey: ["models"],
    queryFn: () => getAllModels(token),
  });
}
