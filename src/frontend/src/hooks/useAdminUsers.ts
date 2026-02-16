import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { toast } from 'sonner';

export function useAddAdminByEmail() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (email: string) => {
      if (!actor) throw new Error('Actor not available');
      return actor.addAdminByEmail(email);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['userRole'] });
      toast.success('Admin permission granted successfully');
    },
    onError: (error: any) => {
      console.error('Failed to grant admin permission:', error);
      const errorMessage = error?.message || 'Failed to grant admin permission';
      toast.error(errorMessage);
    },
  });
}
