import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ServiceQuoteCreate } from '../backend';
import { toast } from 'sonner';

export function useRequestServiceQuote() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (quoteInput: ServiceQuoteCreate) => {
      if (!actor) throw new Error('Actor not available');
      return actor.requestServiceQuote(quoteInput);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'quotes'] });
      toast.success('Quote request submitted successfully!');
    },
    onError: (error: any) => {
      console.error('Failed to submit quote request:', error);
      toast.error('Failed to submit quote request. Please try again.');
    },
  });
}
