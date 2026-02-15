import { useQuery } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product } from '../backend';

export function useGetActiveProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'active'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getActiveProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useGetProduct(id: bigint) {
  const { actor, isFetching } = useActor();

  return useQuery<Product | null>({
    queryKey: ['product', id.toString()],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getProduct(id);
    },
    enabled: !!actor && !isFetching,
  });
}
