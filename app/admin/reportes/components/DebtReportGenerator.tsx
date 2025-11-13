"use client"

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Download, Loader2 } from 'lucide-react';
import { useDebtReport } from '../hooks/useDebtReport';
import { toast } from 'sonner';

export function DebtReportGenerator() {
    const [selectedPeriod, setSelectedPeriod] = useState<string>('');
    const [customStartDate, setCustomStartDate] = useState<string>('');
    const [customEndDate, setCustomEndDate] = useState<string>('');
    const { generateReport, isGenerating } = useDebtReport();

    const calculateDateRange = (period: string) => {
        const today = new Date();
        const startDate = new Date();

        switch (period) {
            case '30':
                startDate.setDate(today.getDate() - 30);
                break;
            case '60':
                startDate.setDate(today.getDate() - 60);
                break;
            case '90':
                startDate.setDate(today.getDate() - 90);
                break;
            default:
                startDate.setDate(today.getDate() - 30);
        }

        return {
            fechaInicio: startDate.toISOString().split('T')[0],
            fechaFin: today.toISOString().split('T')[0]
        };
    };

    const handleGenerateReport = async () => {
        if (!selectedPeriod) {
            toast.error('Por favor selecciona un período');
            return;
        }

        if (selectedPeriod === 'custom' && (!customStartDate || !customEndDate)) {
            toast.error('Por favor selecciona las fechas de inicio y fin');
            return;
        }

        if (selectedPeriod === 'custom' && new Date(customStartDate) > new Date(customEndDate)) {
            toast.error('La fecha de inicio debe ser anterior a la fecha de fin');
            return;
        }

        const { fechaInicio, fechaFin } = calculateDateRange(selectedPeriod);

        toast.promise(
            generateReport(fechaInicio, fechaFin),
            {
                loading: 'Generando reporte de comercios morosos...',
                success: (result) => {
                    if (result.success) {
                        return result.message;
                    } else {
                        throw new Error(result.message);
                    }
                },
                error: (error) => {
                    return error instanceof Error ? error.message : 'Error al generar el reporte';
                }
            }
        );
    };

    return (
        <div className="space-y-4">
            <div className="space-y-2">
                <label className="text-sm font-medium">Período de análisis</label>
                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                    <SelectTrigger>
                        <SelectValue placeholder="Seleccionar período" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="30">Últimos 30 días</SelectItem>
                        <SelectItem value="60">Últimos 60 días</SelectItem>
                        <SelectItem value="90">Últimos 90 días</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            {selectedPeriod === 'custom' && (
                <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Fecha Inicio</label>
                        <Input
                            type="date"
                            value={customStartDate}
                            onChange={(e) => setCustomStartDate(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Fecha Fin</label>
                        <Input
                            type="date"
                            value={customEndDate}
                            onChange={(e) => setCustomEndDate(e.target.value)}
                        />
                    </div>
                </div>
            )}

            <Button
                className="w-full"
                onClick={handleGenerateReport}
                disabled={isGenerating}
            >
                {isGenerating ? (
                    <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generando...
                    </>
                ) : (
                    <>
                        <Download className="h-4 w-4 mr-2" />
                        Generar Reporte
                    </>
                )}
            </Button>
        </div>
    );
}