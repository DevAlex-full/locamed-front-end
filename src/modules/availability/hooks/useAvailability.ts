import { useMutation, useQuery } from '@tanstack/react-query';
import { availabilityApi } from '../api/availability';
import { CreateAvailabilityData } from '../types';

export function useAvailability() {
  const useBlocks = (poltronaId: string, start: Date, end: Date) => 
    useQuery({
      queryKey: ['availability', poltronaId, start, end],
      queryFn: () => availabilityApi.listByPoltrona(poltronaId, start, end),
      enabled: !!poltronaId,
    });

  const createBlock = useMutation({
    mutationFn: (data: CreateAvailabilityData) => availabilityApi.block(data),
  });

  const releaseBlock = useMutation({
    mutationFn: (id: string) => availabilityApi.release(id),
  });

  return { useBlocks, createBlock, releaseBlock };
}
