import { useState } from 'react';
import { Plus, Trash2, Search } from 'lucide-react';
import { usePartners } from '../hooks/usePartners';
import { toast } from 'sonner';

export function PartnerPage() {
  const { useList, createPartner, deletePartner } = usePartners();
  const [filters, setFilters] = useState({ page: 1, limit: 20, active: true });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    type: 'medical' as 'medical' | 'clinic',
    specialty: '',
    referral_code: '',
    commission_rate: 10,
    active: true,
  });

  const { data, isLoading } = useList(filters);

  const handleSave = async () => {
    try {
      await createPartner.mutateAsync(formData);
      toast.success('Parceiro cadastrado com sucesso');
      setIsModalOpen(false);
    } catch (e: any) {
      toast.error(e.message || 'Erro ao salvar parceiro');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Gestão de Parceiros</h1>
          <p className="text-muted-foreground">Administre médicos e clínicas parceiras e suas comissões.</p>
        </div>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          <Plus size={16} /> Novo Parceiro
        </button>
      </div>

      <div className="flex gap-4 bg-muted/50 p-4 rounded-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input 
            className="pl-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Filtrar parceiros..."
            onChange={(e) => setFilters(prev => ({ ...prev, name: e.target.value }))}
          />
        </div>
        <select 
          className="rounded-md border bg-background px-3 py-2 text-sm"
          value={String(filters.active)}
          onChange={(e) => setFilters(prev => ({ ...prev, active: e.target.value === 'true' }))}
        >
          <option value="true">Ativos</option>
          <option value="false">Inativos</option>
        </select>
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Nome</th>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Especialidade</th>
              <th className="px-4 py-3 font-medium">Código</th>
              <th className="px-4 py-3 font-medium">Comissão</th>
              <th className="px-4 py-3 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={6} className="text-center py-10">Carregando...</td></tr>
            ) : data?.data?.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-10 text-muted-foreground">Nenhum parceiro encontrado.</td></tr>
            ) : (
              data?.data?.map((partner: any) => (
                <tr key={partner.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 font-medium">{partner.name}</td>
                  <td className="px-4 py-3 capitalize">{partner.type}</td>
                  <td className="px-4 py-3">{partner.specialty || '-'}</td>
                  <td className="px-4 py-3 font-mono text-xs">{partner.referral_code}</td>
                  <td className="px-4 py-3">{partner.commission_rate}%</td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      onClick={() => deletePartner.mutate(partner.id, { onSuccess: () => toast.success('Parceiro removido') })}
                      className="p-2 text-destructive hover:bg-destructive/10 rounded-md"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-background p-6 rounded-lg border w-full max-w-md space-y-4">
            <h2 className="text-xl font-bold">Novo Parceiro</h2>
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium">Nome</label>
                <input 
                  className="w-full rounded-md border px-3 py-2 text-sm" 
                  value={formData.name} 
                  onChange={e => setFormData({...formData, name: e.target.value})} 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium">Tipo</label>
                  <select 
                    className="w-full rounded-md border px-3 py-2 text-sm" 
                    value={formData.type} 
                    onChange={e => setFormData({...formData, type: e.target.value as any})}
                  >
                    <option value="medical">Médico</option>
                    <option value="clinic">Clínica</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium">Comissão (%)</label>
                  <input 
                    type="number"
                    className="w-full rounded-md border px-3 py-2 text-sm" 
                    value={formData.commission_rate} 
                    onChange={e => setFormData({...formData, commission_rate: Number(e.target.value)})} 
                  />
                </div>
              </div>
              <div>
                <label className="text-xs font-medium">Código de Indicação</label>
                <input 
                  className="w-full rounded-md border px-3 py-2 text-sm" 
                  value={formData.referral_code} 
                  onChange={e => setFormData({...formData, referral_code: e.target.value})} 
                />
              </div>
              <div>
                <label className="text-xs font-medium">Especialidade</label>
                <input 
                  className="w-full rounded-md border px-3 py-2 text-sm" 
                  value={formData.specialty} 
                  onChange={e => setFormData({...formData, specialty: e.target.value})} 
                />
              </div>
            </div>
            <div className="flex justify-end gap-3 pt-4">
              <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm">Cancelar</button>
              <button onClick={handleSave} className="bg-primary text-primary-foreground px-4 py-2 rounded-md text-sm font-medium">Salvar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
