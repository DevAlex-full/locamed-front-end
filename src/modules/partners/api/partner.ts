import { api } from '@/shared/api/client';
import { CreatePartnerData, UpdatePartnerData } from '../types';

export const partnerApi = {
  async list(params: { page?: number; limit?: number; active?: boolean }) {
    const { data } = await api.get('/partners', { params });
    return data;
  },
  async create(data: CreatePartnerData) {
    const { data: response } = await api.post('/partners', data);
    return response;
  },
  async update(id: string, data: UpdatePartnerData) {
    const { data: response } = await api.patch(`/partners/${id}`, data);
    return response;
  },
  async delete(id: string) {
    await api.delete(`/partners/${id}`);
  }
};
