'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { PiWhatsappLogoLight } from 'react-icons/pi';
import { Calculator, Sparkles, ShieldCheck, CheckCircle2, ArrowRight, Layers, MapPin } from 'lucide-react';
import { buildWhatsAppUrl } from '@/lib/contact';
import { trackWhatsAppClick, trackLotSelect } from '@/lib/analytics';

export interface LotInfo {
  id?: string | number;
  number: string;
  name?: string;
  area: number;
  price: number;
  status?: string;
  type?: string;
}

export interface ProjectFinancingConfig {
  id?: string;
  name: string;
  slug?: string;
  minPrice?: number;
  maxPrice?: number;
  hasFinancingCalculator?: boolean;
  has_financing_calculator?: boolean;
  reservationAmount?: number;
  reservation_amount?: number;
  downPaymentPercentage?: number;
  down_payment_percentage?: number;
  interestFreeMonths?: number;
  interest_free_months?: number;
  interestMonths?: number;
  interest_months?: number;
  monthlyInterestRate?: number;
  monthly_interest_rate?: number;
}

export interface FinancingCalculatorProps {
  project?: ProjectFinancingConfig | null;
  lots?: LotInfo[];
  selectedLot?: LotInfo | null;
  onLotSelect?: (lot: LotInfo) => void;
  className?: string;
}

export function formatCOP(val: number): string {
  return `$${Math.round(val).toLocaleString('es-CO')}`;
}

const fallbackAvailableLots: LotInfo[] = [
  { id: 'lote-03', number: '03', name: 'Corales del Viento · Lote 03', area: 196.27, price: 51030200, status: 'DISPONIBLE', type: 'Frente al Mar' },
  { id: 'lote-04', number: '04', name: 'Corales del Viento · Lote 04', area: 195.34, price: 50788400, status: 'DISPONIBLE', type: 'Frente al Mar' },
  { id: 'lote-10', number: '10', name: 'Corales del Viento · Lote 10', area: 166.89, price: 43391400, status: 'DISPONIBLE', type: 'Frente al Mar' },
  { id: 'lote-47', number: '47', name: 'Corales del Viento · Lote 47', area: 212.54, price: 55260400, status: 'DISPONIBLE', type: 'Frente al Mar' },
  { id: 'lote-48', number: '48', name: 'Corales del Viento · Lote 48', area: 193.10, price: 50206000, status: 'DISPONIBLE', type: 'Frente al Mar' },
  { id: 'lote-49', number: '49', name: 'Corales del Viento · Lote 49', area: 196.62, price: 51121200, status: 'DISPONIBLE', type: 'Frente al Mar' },
  { id: 'lote-51', number: '51', name: 'Corales del Viento · Lote 51', area: 186.32, price: 48443200, status: 'DISPONIBLE', type: 'Frente al Mar' },
  { id: 'lote-52', number: '52', name: 'Corales del Viento · Lote 52', area: 253.17, price: 65824200, status: 'DISPONIBLE', type: 'Lotes XL' },
  { id: 'lote-53', number: '53', name: 'Corales del Viento · Lote 53', area: 377.88, price: 98248800, status: 'DISPONIBLE', type: 'Lotes XL' },
  { id: 'lote-54', number: '54', name: 'Corales del Viento · Lote 54', area: 405.00, price: 105300000, status: 'DISPONIBLE', type: 'Lotes XL' },
  { id: 'lote-60', number: '60', name: 'Corales del Viento · Lote 60', area: 294.46, price: 76559600, status: 'DISPONIBLE', type: 'Lotes XL' },
  { id: 'lote-63', number: '63', name: 'Corales del Viento · Lote 63', area: 257.08, price: 66840800, status: 'DISPONIBLE', type: 'Lotes XL' },
  { id: 'lote-66', number: '66', name: 'Corales del Viento · Lote 66', area: 432.19, price: 112369400, status: 'DISPONIBLE', type: 'Lotes XL' },
];

export default function FinancingCalculator({
  project,
  lots,
  selectedLot,
  onLotSelect,
  className = ''
}: FinancingCalculatorProps) {
  // Check if financing calculator is enabled
  const isEnabled = project?.hasFinancingCalculator ?? 
                    project?.has_financing_calculator ?? 
                    true; // Enabled by default for Corales del Viento

  if (!isEnabled) {
    return null;
  }

  // Financial configuration parameters with fallbacks
  const reservationAmount = Number(
    project?.reservationAmount ?? project?.reservation_amount ?? 1000000
  );
  const downPaymentPercentage = Number(
    project?.downPaymentPercentage ?? project?.down_payment_percentage ?? 20
  );
  const interestFreeMonths = Number(
    project?.interestFreeMonths ?? project?.interest_free_months ?? 12
  );
  const interestMonths = Number(
    project?.interestMonths ?? project?.interest_months ?? 24
  );
  const monthlyInterestRate = Number(
    project?.monthlyInterestRate ?? project?.monthly_interest_rate ?? 1.0
  );

  const unitPrice = (project?.minPrice && project.minPrice < 1000000 && project.minPrice > 0)
    ? project.minPrice
    : 260000;

  // Available lots list for the lot selector (combines fallback official lots with DB inventory)
  const availableLots = useMemo(() => {
    const map = new Map<string, LotInfo>();

    // 1. Seed with fallback official available lots (including Lote 03, 04, 10, 47, etc.)
    fallbackAvailableLots.forEach(l => map.set(l.number, l));

    // 2. Overlay with real properties from DB if available
    if (lots && lots.length > 0) {
      lots.filter(l => l.status === 'DISPONIBLE').forEach(l => map.set(l.number, l));
    }

    // 3. Sort numerically by lot number
    return Array.from(map.values()).sort((a, b) => parseInt(a.number, 10) - parseInt(b.number, 10));
  }, [lots]);

  // State
  const [selectedTerm, setSelectedTerm] = useState<number>(12);
  const [customArea, setCustomArea] = useState<string>(() => {
    if (selectedLot?.area) return selectedLot.area.toString();
    return '196.27';
  });

  // Sync custom area when selectedLot prop changes
  useEffect(() => {
    if (selectedLot?.area) {
      setCustomArea(selectedLot.area.toString());
    }
  }, [selectedLot?.id, selectedLot?.number, selectedLot?.area]);

  // Derived financial computations
  const {
    currentArea,
    totalPrice,
    step1Separation,
    totalDownPayment,
    netDownPayment,
    financedBalance,
    quota12,
    quota24,
    activeQuota,
    lotLabel,
    activeLot
  } = useMemo(() => {
    const parsedArea = parseFloat(customArea);
    const validArea = !isNaN(parsedArea) && parsedArea > 0 ? parsedArea : (selectedLot?.area ?? 196.27);

    // Try finding an exact matching lot in available lots
    const matchedLot = availableLots.find(l => 
      (selectedLot && (l.id === selectedLot.id || l.number === selectedLot.number)) ||
      Math.abs(l.area - validArea) < 0.001
    );

    let price: number;
    if (selectedLot && (!customArea || Math.abs(validArea - selectedLot.area) < 0.001)) {
      price = selectedLot.price;
    } else if (matchedLot && Math.abs(matchedLot.area - validArea) < 0.001) {
      price = matchedLot.price;
    } else {
      price = Math.round(validArea * unitPrice);
    }

    const step1Sep = reservationAmount;
    const totalDp = price * (downPaymentPercentage / 100);
    const netDp = Math.max(0, totalDp - step1Sep);
    const balance = Math.max(0, price - totalDp);

    const q12 = interestFreeMonths > 0 ? Math.round(balance / interestFreeMonths) : 0;

    const i = monthlyInterestRate / 100;
    let q24 = 0;
    if (interestMonths > 0) {
      if (i === 0) {
        q24 = Math.round(balance / interestMonths);
      } else {
        const comp = Math.pow(1 + i, interestMonths);
        const factor = (i * comp) / (comp - 1);
        q24 = Math.round(balance * factor);
      }
    }

    const actQuota = selectedTerm === 12 ? q12 : q24;
    const isCustom = !matchedLot && (!selectedLot || Math.abs(validArea - (selectedLot?.area ?? 0)) >= 0.001);
    const lotNumber = selectedLot?.number || matchedLot?.number;
    const label = !isCustom && lotNumber && lotNumber !== 'Personalizado'
      ? `Lote ${lotNumber}`
      : `${validArea} m²`;

    return {
      currentArea: validArea,
      totalPrice: price,
      step1Separation: step1Sep,
      totalDownPayment: totalDp,
      netDownPayment: netDp,
      financedBalance: balance,
      quota12: q12,
      quota24: q24,
      activeQuota: actQuota,
      lotLabel: label,
      activeLot: selectedLot || matchedLot || null
    };
  }, [
    customArea,
    selectedLot,
    availableLots,
    unitPrice,
    reservationAmount,
    downPaymentPercentage,
    interestFreeMonths,
    interestMonths,
    monthlyInterestRate,
    selectedTerm
  ]);

  // Handler when user selects a lot from the selector
  const handleSelectLot = (lot: LotInfo) => {
    setCustomArea(lot.area.toString());
    if (onLotSelect) {
      onLotSelect(lot);
    }
    trackLotSelect(lot.number, lot.area, lot.price);
  };

  // Formatted WhatsApp URL
  const projectName = project?.name || 'Condominio Campestre Corales del Viento';
  const quotaText = selectedTerm === 12
    ? `${interestFreeMonths} cuotas fijas de ${formatCOP(quota12)} COP (0% interés)`
    : `${interestMonths} cuotas amortizadas de ${formatCOP(quota24)} COP (al ${monthlyInterestRate}% mensual)`;

  const waMessage = `¡Hola! Estoy muy interesado en el proyecto ${projectName} y deseo separar el ${lotLabel} (${currentArea} m² por un total de ${formatCOP(totalPrice)} COP).\n\nMi plan de simulación:\n• Hoy (Separación): ${formatCOP(step1Separation)} COP\n• A los 30 días (Cuota Inicial): ${formatCOP(netDownPayment)} COP\n• Plan Seleccionado: ${quotaText}.\n\n¿Me podrían asesorar para formalizar la separación hoy mismo?`;

  const waUrl = buildWhatsAppUrl(waMessage);

  const handleWhatsAppClick = () => {
    trackWhatsAppClick('financing_calculator', activeLot ? `Lote ${activeLot.number}` : `Area ${currentArea}m2`);
  };

  return (
    <section 
      id="financing-calculator-section" 
      aria-label="Calculadora de Financiamiento"
      className={`w-full py-12 lg:py-16 ${className}`}
    >
      <div 
        id="financing-calculator" 
        className="card max-w-5xl mx-auto bg-white rounded-3xl p-6 sm:p-10 shadow-xl border border-gray-100 overflow-hidden relative"
      >
        {/* Decorative background glow */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--color-gold-accent)]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[var(--color-caribbean-blue)]/5 rounded-full blur-3xl pointer-events-none" />

        {/* Section Header */}
        <div className="relative z-10 text-center max-w-3xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 bg-[var(--color-gold-accent)]/10 text-[var(--color-caribbean-dark)] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4">
            <Calculator className="w-4 h-4 text-[var(--color-gold-accent)]" />
            Plan de Pagos Directo
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold text-[var(--color-caribbean-dark)] tracking-tight mb-3 font-sans">
            Simula tu Inversión y Plan de Pagos
          </h2>
          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            Financiamiento directo con la constructora, sin intermediarios bancarios ni codeudores. Selecciona tu lote preferido o ingresa un área personalizada.
          </p>
        </div>

        {/* Interactive Lot Selector & Custom Area Control */}
        <div className="relative z-10 bg-gradient-to-br from-gray-50/90 to-white backdrop-blur-sm rounded-3xl p-6 sm:p-8 mb-8 border border-gray-200/80 shadow-xs">
          
          {/* Top Row: Dropdown Lot Selector and Quick Pills */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
              <label 
                htmlFor="lot-select-dropdown" 
                className="flex items-center gap-2 text-xs sm:text-sm font-extrabold uppercase tracking-wider text-[var(--color-caribbean-dark)]"
              >
                <Layers className="w-4 h-4 text-[var(--color-gold-accent)]" />
                <span>Seleccionar Lote Disponible:</span>
              </label>
              <span className="text-[11px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 w-fit">
                ● {availableLots.length} Lotes Disponibles
              </span>
            </div>

            {/* Dropdown Selector */}
            <div className="relative">
              <select
                id="lot-select-dropdown"
                value={activeLot?.number || ''}
                onChange={(e) => {
                  const val = e.target.value;
                  const found = availableLots.find(l => l.number === val);
                  if (found) {
                    handleSelectLot(found);
                  }
                }}
                className="w-full px-4 py-3 rounded-xl border border-gray-300 bg-white font-sans font-bold text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-accent)] min-h-[44px] text-sm sm:text-base cursor-pointer"
              >
                {availableLots.map((lot) => (
                  <option key={lot.id || lot.number} value={lot.number}>
                    Lote #{lot.number} · {lot.area} m² — {formatCOP(lot.price)} COP ({lot.type || 'Disponible'})
                  </option>
                ))}
              </select>
            </div>

            {/* Quick-Access Pills */}
            <div className="mt-4">
              <span className="block text-[10px] font-bold uppercase tracking-wider text-gray-400 mb-2">
                Acceso Rápido por Lote:
              </span>
              <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto pr-1">
                {availableLots.map((lot) => {
                  const isSelected = activeLot?.number === lot.number;
                  return (
                    <button
                      key={lot.id || lot.number}
                      type="button"
                      onClick={() => handleSelectLot(lot)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all min-h-[36px] flex items-center gap-1.5 border ${
                        isSelected
                          ? 'bg-[var(--color-caribbean-dark)] text-white border-[var(--color-caribbean-dark)] shadow-sm'
                          : 'bg-white hover:bg-gray-100 text-gray-700 border-gray-200'
                      }`}
                    >
                      <MapPin className={`w-3 h-3 ${isSelected ? 'text-[var(--color-gold-accent)]' : 'text-gray-400'}`} />
                      <span>Lote {lot.number}</span>
                      <span className={`text-[10px] font-normal opacity-80 ${isSelected ? 'text-white' : 'text-gray-500'}`}>
                        ({lot.area} m²)
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-200/80 pt-5 mt-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              
              {/* Custom Area Input */}
              <div className="flex-1">
                <label 
                  htmlFor="custom-area-input" 
                  className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1"
                >
                  O simular por Área Personalizada (m²):
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="number"
                    id="custom-area-input"
                    min="1"
                    step="0.01"
                    value={customArea}
                    onChange={(e) => setCustomArea(e.target.value)}
                    className="w-36 sm:w-44 px-3.5 py-2.5 rounded-xl border border-gray-300 bg-white font-sans font-bold text-lg text-[var(--color-caribbean-dark)] shadow-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-gold-accent)] min-h-[44px]"
                  />
                  <span id="price-per-m2-tag" className="text-xs sm:text-sm font-semibold text-gray-500">
                    x $260.000 COP/m²
                  </span>
                </div>
              </div>

              {/* Total Investment Card */}
              <div className="text-left sm:text-right border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-200 bg-blue-50/50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
                <span className="block text-[10px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest mb-0.5">
                  Inversión Total Estimada ({lotLabel})
                </span>
                <div className="flex items-baseline sm:justify-end gap-1.5">
                  <span className="text-2xl sm:text-3xl font-extrabold text-[var(--color-caribbean-dark)] font-sans tabular-nums tracking-tight">
                    {formatCOP(totalPrice)}
                  </span>
                  <span className="text-xs font-bold text-gray-400 uppercase">COP</span>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* 3-Step Financing Architecture */}
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          
          {/* Paso 1: Hoy — Separación */}
          <div 
            id="step-1-separation" 
            className="step-box bg-white rounded-2xl p-6 border-2 border-[var(--color-gold-accent)]/30 shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:border-[var(--color-gold-accent)]"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-block bg-[var(--color-gold-accent)]/15 text-[var(--color-gold-accent)] text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Paso 01
                </span>
                <Sparkles className="w-4 h-4 text-[var(--color-gold-accent)]" />
              </div>
              <strong className="block text-sm font-bold text-[var(--color-caribbean-dark)] mb-2">
                Paso 1 · Hoy — Separación:
              </strong>
              <div 
                id="val-step-1" 
                className="text-2xl sm:text-3xl font-black text-[var(--color-gold-accent)] font-sans tabular-nums tracking-tight mb-2"
              >
                {formatCOP(step1Separation)} COP
              </div>
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mt-3 pt-3 border-t border-gray-100">
              Abona hoy para congelar el precio oficial de preventa y adjudicar el lote a tu nombre.
            </p>
          </div>

          {/* Paso 2: A los 30 días — Cuota Inicial */}
          <div 
            id="step-2-downpayment" 
            className="step-box bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:border-[var(--color-caribbean-blue)]"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-block bg-[var(--color-caribbean-blue)]/15 text-[var(--color-caribbean-dark)] text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Paso 02
                </span>
                <ShieldCheck className="w-4 h-4 text-[var(--color-caribbean-blue)]" />
              </div>
              <strong className="block text-sm font-bold text-[var(--color-caribbean-dark)] mb-2">
                Paso 2 · A los 30 días — Cuota Inicial ({downPaymentPercentage}%):
              </strong>
              <div 
                id="val-step-2" 
                className="text-2xl sm:text-3xl font-black text-[var(--color-caribbean-dark)] font-sans tabular-nums tracking-tight mb-2"
              >
                {formatCOP(netDownPayment)} COP
              </div>
            </div>
            <p 
              id="step-2-breakdown" 
              className="text-xs text-gray-500 leading-relaxed mt-3 pt-3 border-t border-gray-100"
            >
              Cuota inicial total (<span id="step-2-total-dp" className="font-semibold">{formatCOP(totalDownPayment)}</span>) menos el valor de separación (<span id="step-2-sub-res" className="font-semibold">{formatCOP(step1Separation)}</span>).
            </p>
          </div>

          {/* Paso 3: Saldo Restante Financiado */}
          <div 
            id="step-3-financing" 
            className="step-box bg-white rounded-2xl p-6 border-2 border-gray-200 shadow-sm flex flex-col justify-between transition-all hover:shadow-md hover:border-[var(--color-caribbean-dark)]"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="inline-block bg-[var(--color-caribbean-dark)]/15 text-[var(--color-caribbean-dark)] text-xs font-black px-2.5 py-1 rounded-full uppercase tracking-wider">
                  Paso 03
                </span>
                <CheckCircle2 className="w-4 h-4 text-[var(--color-caribbean-dark)]" />
              </div>
              <strong className="block text-sm font-bold text-[var(--color-caribbean-dark)] mb-1">
                Paso 3 · Saldo Restante a Financiar (<span id="val-step-3-pct">{100 - downPaymentPercentage}%</span>):
              </strong>
              <div 
                id="val-step-3-balance" 
                className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 tabular-nums"
              >
                Saldo: {formatCOP(financedBalance)} COP
              </div>

              {/* Term Selection Tabs */}
              <div id="term-tabs" className="grid grid-cols-2 gap-2 mb-4 bg-gray-100 p-1 rounded-xl">
                <button
                  type="button"
                  id="tab-12m"
                  onClick={() => setSelectedTerm(12)}
                  className={`tab-btn py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all min-h-[44px] flex items-center justify-center text-center leading-tight ${
                    selectedTerm === 12
                      ? 'active bg-[var(--color-caribbean-dark)] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 bg-transparent'
                  }`}
                >
                  12 Meses (0% Interés)
                </button>
                <button
                  type="button"
                  id="tab-24m"
                  onClick={() => setSelectedTerm(24)}
                  className={`tab-btn py-2 px-2 sm:px-3 rounded-lg text-xs font-bold transition-all min-h-[44px] flex items-center justify-center text-center leading-tight ${
                    selectedTerm === 24
                      ? 'active bg-[var(--color-caribbean-dark)] text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-900 bg-transparent'
                  }`}
                >
                  24 Meses ({monthlyInterestRate}% mensual)
                </button>
              </div>

              {/* Quota Result Display */}
              <div id="quota-display-container" className="pt-2">
                <span className="block text-[11px] font-bold uppercase tracking-wider text-gray-400 mb-1">
                  Cuota Mensual Fija Sugerida:
                </span>
                <div className="flex items-center flex-wrap gap-2">
                  <span 
                    id="val-monthly-quota" 
                    className="text-xl sm:text-2xl font-black text-[var(--color-gold-accent)] font-sans tabular-nums tracking-tight"
                  >
                    {formatCOP(activeQuota)} COP/mes
                  </span>
                  <span 
                    id="quota-rate-badge" 
                    className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                      selectedTerm === 12
                        ? 'bg-blue-50 text-[var(--color-gold-accent)] border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}
                  >
                    {selectedTerm === 12 ? '0% Interés' : `${monthlyInterestRate}% mensual`}
                  </span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* WhatsApp Call to Action */}
        <div className="relative z-10 pt-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="text-center sm:text-left">
            <span className="text-xs text-gray-500 font-medium block">
              Sin trámites notariales complejos. Asesoría jurídica personalizada y directa.
            </span>
            <span className="text-xs text-[var(--color-caribbean-dark)] font-bold">
              ¿Deseas congelar esta simulación para tu lote?
            </span>
          </div>

          <a
            id="calc-whatsapp-cta"
            href={waUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="btn btn-primary w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#25D366] hover:bg-[#1ebd5b] text-white font-extrabold px-8 py-4 rounded-2xl shadow-lg shadow-green-600/20 hover:shadow-green-600/30 hover:-translate-y-0.5 transition-all min-h-[44px] text-sm uppercase tracking-wider cursor-pointer"
          >
            <PiWhatsappLogoLight className="w-5 h-5 text-white" />
            <span>SEPARAR TU LOTE CON ESTE PLAN</span>
            <ArrowRight className="w-4 h-4 ml-1" />
          </a>
        </div>
      </div>
    </section>
  );
}
