import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { useAvailability } from '../hooks/useAvailability';
import { toast } from 'sonner';
import { format } from 'date-fns';

export function AvailabilityPage() {
  const { useBlocks, createBlock, releaseBlock } = useAvailability();
  const [poltronaId, setPoltronaId] = useState('');
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(new Date().setDate(new Date().getDate() + 30))
  });

  const { data: blocks, isLoading } = useBlocks(poltronaId, dateRange.start, dateRange.end);

  const handleBlock = async () => {
    const reason = prompt('Motivo do bloqueio:');
    if (!reason || !poltronaId) return;
    
    try {
      await createBlock.mutateAsync({
        poltronaId,
        startDate: dateRange.start,
        endDate: dateRange.end,
        reason,
        type: 'MANUAL_BLOCK'
      });
      toast.success('Poltrona bloqueada com sucesso');
    } catch (e: any) {
      toast.error(e.message || 'Erro ao bloquear');
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Gestão de Disponibilidade</h1>
        <p className="text-muted-foreground">Bloqueie poltronas para manutenção ou outros motivos.</p>
      </div>

      <div className="flex gap-4 items-end bg-muted/50 p-4 rounded-lg">
        <div className="space-y-2">
          <label className="text-sm font-medium">ID da Poltrona</label>
          <input 
            className="block w-64 rounded-md border bg-background px-3 py-2 text-sm"
            value={poltronaId}
            onChange={(e) => setPoltronaId(e.target.value)}
            placeholder="UUID da Poltrona"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Data Início</label>
          <input 
            type="date"
            className="block rounded-md border bg-background px-3 py-2 text-sm"
            value={format(dateRange.start, 'yyyy-MM-dd')}
            onChange={(e) => setDateRange(prev => ({ ...prev, start: new Date(e.target.value) }))}
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium">Data Fim</label>
          <input 
            type="date"
            className="block rounded-md border bg-background px-3 py-2 text-sm"
            value={format(dateRange.end, 'yyyy-MM-dd')}
            onChange={(e) => setDateRange(prev => ({ ...prev, end: new Date(e.target.value) }))}
          />
        </div>
        <button 
          onClick={handleBlock}
          disabled={createBlock.isPending}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
        >
          <Plus size={16} /> Bloquear Período
        </button>
      </div>

      <div className="rounded-md border bg-white overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50 text-left">
            <tr>
              <th className="px-4 py-3 font-medium">Tipo</th>
              <th className="px-4 py-3 font-medium">Início</th>
              <th className="px-4 py-3 font-medium">Fim</th>
              <th className="px-4 py-3 font-medium">Motivo</th>
              <th className="px-4 py-3 text-right font-medium">Ações</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {isLoading ? (
              <tr><td colSpan={5} className="text-center py-10">Carregando...</td></tr>
            ) : blocks?.length === 0 ? (
              <tr><td colSpan={5} className="text-center py-10 text-muted-foreground">Nenhum bloqueio encontrado para este período.</td></tr>
            ) : (
              blocks?.map((block: any) => (
                <tr key={block.id} className="hover:bg-muted/30">
                  <td className="px-4 py-3 capitalize">{block.type}</td>
                  <td className="px-4 py-3">{format(new Date(block.start_date), 'dd/MM/yyyy')}</td>
                  <td className="px-4 py-3">{format(new Date(block.end_date), 'dd/MM/yyyy')}</td>
                  <td className="px-4 py-3">{block.reason}</td>
                  <td className="px-4 py-3 text-right">
                    <button 
                      onClick={() => releaseBlock.mutate(block.id, { onSuccess: () => toast.success('Bloqueio removido') })}
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
    </div>
  );
}
