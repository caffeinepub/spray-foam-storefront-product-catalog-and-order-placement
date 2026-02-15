import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Order, UserProfile, Address } from '../backend';

interface PlaceOrderParams {
  profile: UserProfile;
  productIds: bigint[];
  deliveryAddress: Address;
  totalAmount: number;
}

export function usePlaceOrder() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<Order, Error, PlaceOrderParams>({
    mutationFn: async ({ profile, productIds, deliveryAddress, totalAmount }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.placeOrder(profile, productIds, deliveryAddress, totalAmount);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['orders'] });
    },
  });
}
