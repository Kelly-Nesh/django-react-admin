import { useMutation, useQuery } from "@tanstack/react-query";
import { updateModel } from "../api/crud";
import { useQueryClient } from "@tanstack/react-query";

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
