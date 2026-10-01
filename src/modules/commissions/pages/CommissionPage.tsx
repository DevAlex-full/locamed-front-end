import { useState } from 'react';
import { CheckCircle, Clock, XCircle, Search } from 'lucide-react';
import { useCommissions } from '../hooks/useCommissions';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function CommissionPage() {
  const { useList, markAsPaid } = useCommissions();
  const [filters, setFilters] = useState({ page: 1, limit: 20, status: '' });

  const { data, isLoading } = useList(filters);

  const handlePay = async (id: string) => {
    try {
      await markAsPaid.mutateAsync({ id, paymentDate: new Date() });
      toast.success('Comissão marcada como paga');
    } catch (e: any) {
      toast.error(e.message || 'Erro ao processar pagamento');
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PAID': return <CheckCircle className="text-green-500" size={16} />;
      case 'CANCELLED': return <XCircle className="text-red-500" size={16} />;
      default: return <Clock className="text-amber-500" size={16} />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gestão de Comissões</h1>
        <p className="text-muted-foreground">Acompanhe e liquide as comissões devidas aos parceiros.</p>
      </div>

      <div className="flex gap-4 bg-muted/50 p-4 rounded-lg">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
          <input 
            className="pl-10 w-full rounded-md border bg-background px-3 py-2 text-sm"
            placeholder="Filtrar por parceiro ou reserva..."
            onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
          />
        </div>
        <select 
          className="rounded-md border bg-background px-3 py-2 text-sm"
          value={filters.status}
          onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value }))}
        >
          <option value="">Todos os Status</option>
          <option value="PENDING">Pendentes</option>
          <option value="PAID">Pagas</option>
          <option value="CANCELLED">Canceladas</option>
        </select>
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Data</th>
              <th className="px-4 py-3 font-medium">Parceiro</th>
              <th className="px-4 py-3 font-medium">Valor</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-10">Carregando...</td></tr>
            ) : data?.data?.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">Nenhuma comissão encontrada.</td></tr>
            ) : (
              data?.data?.map((com: any) => (
                <tr key={com.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3">{format(new Date(com.created_at), 'dd/MM/yyyy')}</td>
                  <td className="px-4 py-3">{com.partner_id}</td>
                  <td className="px-4 py-3 font-medium">R$ {com.amount.toFixed(2)}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(com.status)}
                      <span>{com.status}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    {com.status === 'PENDING' && (
                      <button 
                        onClick={() => handlePay(com.id)}
                        className="bg-primary text-primary-foreground px-3 py-1 rounded-md text-xs font-medium hover:bg-primary/90"
                      >
                        Marcar como Paga
                      </button>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
