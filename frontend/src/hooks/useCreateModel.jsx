import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createModel } from '../api/crud';

function useCreateModel () {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createModel,
    onSuccess: () => {
      queryClient.invalidateQueries(['models']);
    }
  });
}
export default useCreateModel;
