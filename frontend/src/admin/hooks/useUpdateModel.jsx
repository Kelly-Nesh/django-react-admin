import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { updateModel } from "../api/crud";

function useUpdateModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateModel,
    onSuccess: () => {
      queryClient.invalidateQueries(["models"]);
    },
  });
}
export default useUpdateModel;
