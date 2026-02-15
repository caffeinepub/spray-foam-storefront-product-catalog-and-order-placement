import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ServiceQuote, ServiceQuoteUpdate } from '../backend';
import { toast } from 'sonner';

export function useGetQuotes() {
  const { actor, isFetching } = useActor();

  return useQuery<ServiceQuote[]>({
    queryKey: ['admin', 'quotes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getQuotes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateQuote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, update }: { id: bigint; update: ServiceQuoteUpdate }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateQuote(id, update);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'quotes'] });
      toast.success('Quote updated successfully');
    },
    onError: (error: any) => {
      console.error('Failed to update quote:', error);
      toast.error('Failed to update quote. Please try again.');
    },
  });
}
