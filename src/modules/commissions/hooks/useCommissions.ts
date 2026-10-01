import { useMutation, useQuery } from '@tanstack/react-query';
import { commissionApi } from '../api/commission';
import { CreateCommissionData } from '../types';

export function useCommissions() {
  const useList = (filters: any) => 
    useQuery({
      queryKey: ['commissions', filters],
      queryFn: () => commissionApi.list(filters),
    });

  const createCommission = useMutation({
    mutationFn: (data: CreateCommissionData) => commissionApi.create(data),
  });

  const markAsPaid = useMutation({
    mutationFn: ({ id, paymentDate }: { id: string; paymentDate: Date }) => commissionApi.markAsPaid(id, paymentDate),
  });

  return { useList, createCommission, markAsPaid };
}
