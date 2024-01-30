import { useMutation } from "@tanstack/react-query";
import { createModel } from "../api/crud";
import { useQueryClient } from "@tanstack/react-query";

function useCreateModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createModel,
    onSuccess: () => {
      queryClient.invalidateQueries(["models"]);
    },
  });
}
export default useCreateModel;
