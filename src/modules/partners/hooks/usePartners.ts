import { useMutation, useQuery } from '@tanstack/react-query';
import { partnerApi } from '../api/partner';
import { CreatePartnerData, UpdatePartnerData } from '../types';

export function usePartners() {
  const useList = (filters: any) => 
    useQuery({
      queryKey: ['partners', filters],
      queryFn: () => partnerApi.list(filters),
    });

  const createPartner = useMutation({
    mutationFn: (data: CreatePartnerData) => partnerApi.create(data),
  });

  const updatePartner = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdatePartnerData }) => partnerApi.update(id, data),
  });

  const deletePartner = useMutation({
    mutationFn: (id: string) => partnerApi.delete(id),
  });

  return { useList, createPartner, updatePartner, deletePartner };
}
