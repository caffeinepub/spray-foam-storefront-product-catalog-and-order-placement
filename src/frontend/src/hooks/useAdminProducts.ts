import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { Product, ProductUpdate } from '../backend';

export function useGetAllProducts() {
  const { actor, isFetching } = useActor();

  return useQuery<Product[]>({
    queryKey: ['products', 'all'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllProducts();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useCreateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, Product>({
    mutationFn: async (product) => {
      if (!actor) throw new Error('Actor not available');
      return actor.createProduct(product);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useUpdateProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, { id: bigint; update: ProductUpdate }>({
    mutationFn: async ({ id, update }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateProduct(id, update);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useArchiveProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) throw new Error('Actor not available');
      return actor.archiveProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}

export function useRestoreProduct() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, bigint>({
    mutationFn: async (id) => {
      if (!actor) throw new Error('Actor not available');
      return actor.restoreProduct(id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });
}
