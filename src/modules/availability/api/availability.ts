import { api } from '@/shared/api/client';
import { CreateAvailabilityData } from '../types';

export const availabilityApi = {
  async block(data: CreateAvailabilityData) {
    const { data: response } = await api.post('/availability', data);
    return response;
  },
  async listByPoltrona(poltronaId: string, start: Date, end: Date) {
    const { data } = await api.get(`/availability/poltrona/${poltronaId}`, {
      params: { start: start.toISOString(), end: end.toISOString() }
    });
    return data;
  },
  async release(id: string) {
    await api.delete(`/availability/${id}`);
  }
};
