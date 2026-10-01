import { api } from '@/shared/api/client';
import { CreateCommissionData } from '../types';

export const commissionApi = {
  async list(params: { page?: number; limit?: number; status?: string; partner_id?: string }) {
    const { data } = await api.get('/commissions', { params });
    return data;
  },
  async create(data: CreateCommissionData) {
    const { data: response } = await api.post('/commissions', data);
    return response;
  },
  async markAsPaid(id: string, paymentDate: Date) {
    const { data: response } = await api.patch(`/commissions/${id}/pay`, { paymentDate: paymentDate.toISOString() });
    return response;
  }
};
