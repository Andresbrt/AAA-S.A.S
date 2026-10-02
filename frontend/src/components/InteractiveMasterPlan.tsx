'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MessageCircle, FileText } from 'lucide-react';

export default function InteractiveMasterPlan({ companyPhone }: { companyPhone?: string }) {
  // Datos simulados (En producción, esto vendría del Backend: LotRepository)
  const lots = [
  { id: 'lote-1', number: '01', name: 'Corales del Viento', area: 167.51, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-2', number: '02', name: 'Corales del Viento', area: 151.65, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-3', number: '03', name: 'Corales del Viento', area: 196.27, price: 51030200, status: 'DISPONIBLE', type: '150m Playa', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-4', number: '04', name: 'Corales del Viento', area: 195.34, price: 50788400, status: 'DISPONIBLE', type: '150m Playa', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-5', number: '05', name: 'Corales del Viento', area: 168.57, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-6', number: '06', name: 'Corales del Viento', area: 164.25, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-7', number: '07', name: 'Corales del Viento', area: 164.31, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-8', number: '08', name: 'Corales del Viento', area: 177.46, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-9', number: '09', name: 'Corales del Viento', area: 198.99, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-10', number: '10', name: 'Corales del Viento', area: 166.89, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-11', number: '11', name: 'Corales del Viento', area: 163.96, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-12', number: '12', name: 'Corales del Viento', area: 152.49, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-13', number: '13', name: 'Corales del Viento', area: 139.60, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-14', number: '14', name: 'Corales del Viento', area: 194.49, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-15', number: '15', name: 'Corales del Viento', area: 167.59, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-16', number: '16', name: 'Corales del Viento', area: 166.99, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-17', number: '17', name: 'Corales del Viento', area: 140, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-18', number: '18', name: 'Corales del Viento', area: 144.61, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-19', number: '19', name: 'Corales del Viento', area: 165.30, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-20', number: '20', name: 'Corales del Viento', area: 168, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-21', number: '21', name: 'Corales del Viento', area: 166.99, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-22', number: '22', name: 'Corales del Viento', area: 140, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-23', number: '23', name: 'Corales del Viento', area: 147, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-24', number: '24', name: 'Corales del Viento', area: 179.34, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-25', number: '25', name: 'Corales del Viento', area: 140, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-26', number: '26', name: 'Corales del Viento', area: 137.64, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-27', number: '27', name: 'Corales del Viento', area: 146.59, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-28', number: '28', name: 'Corales del Viento', area: 146.86, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-29', number: '29', name: 'Corales del Viento', area: 150, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-30', number: '30', name: 'Corales del Viento', area: 140, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-31', number: '31', name: 'Corales del Viento', area: 138.27, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-32', number: '32', name: 'Corales del Viento', area: 145.32, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-33', number: '33', name: 'Corales del Viento', area: 148.83, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-34', number: '34', name: 'Corales del Viento', area: 205.64, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-35', number: '35', name: 'Corales del Viento', area: 182.04, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-36', number: '36', name: 'Corales del Viento', area: 144.19, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-37', number: '37', name: 'Corales del Viento', area: 156.01, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-38', number: '38', name: 'Corales del Viento', area: 189.00, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-39', number: '39', name: 'Corales del Viento', area: 167.81, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-40', number: '40', name: 'Corales del Viento', area: 144.31, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-41', number: '41', name: 'Corales del Viento', area: 159.01, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-42', number: '42', name: 'Corales del Viento', area: 148.47, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-43', number: '43', name: 'Corales del Viento', area: 203, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-44', number: '44', name: 'Corales del Viento', area: 0, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-45', number: '45', name: 'Corales del Viento', area: 0, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-46', number: '46', name: 'Corales del Viento', area: 234.63, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-47', number: '47', name: 'Corales del Viento', area: 212.54, price: 55260400, status: 'DISPONIBLE', type: 'Lotes XL', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-48', number: '48', name: 'Corales del Viento', area: 193.10, price: 50206000, status: 'DISPONIBLE', type: 'Lotes XL', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-49', number: '49', name: 'Corales del Viento', area: 196.62, price: 51121200, status: 'DISPONIBLE', type: 'Lotes XL', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-50', number: '50', name: 'Corales del Viento', area: 177.44, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-51', number: '51', name: 'Corales del Viento', area: 186.32, price: 48443200, status: 'DISPONIBLE', type: 'Reserva Natural', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-52', number: '52', name: 'Corales del Viento', area: 253.17, price: 65824200, status: 'DISPONIBLE', type: 'Reserva Natural', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-53', number: '53', name: 'Corales del Viento', area: 377.88, price: 98248800, status: 'DISPONIBLE', type: 'Reserva Natural', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-54', number: '54', name: 'Corales del Viento', area: 405, price: 105300000, status: 'DISPONIBLE', type: 'Reserva Natural', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-55', number: '55', name: 'Corales del Viento', area: 228.67, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-56', number: '56', name: 'Corales del Viento', area: 0, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-57', number: '57', name: 'Corales del Viento', area: 235.28, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-58', number: '58', name: 'Corales del Viento', area: 265.09, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-59', number: '59', name: 'Corales del Viento', area: 278.41, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-60', number: '60', name: 'Corales del Viento', area: 294.46, price: 76559600, status: 'DISPONIBLE', type: 'Reserva Natural', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-61', number: '61', name: 'Corales del Viento', area: 303.79, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-62', number: '62', name: 'Corales del Viento', area: 303.58, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-63', number: '63', name: 'Corales del Viento', area: 257.08, price: 66840800, status: 'DISPONIBLE', type: 'Reserva Natural', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-64', number: '64', name: 'Corales del Viento', area: 259.70, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-65', number: '65', name: 'Corales del Viento', area: 504.34, price: 0, status: 'VENDIDO', type: 'Vendido', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
  { id: 'lote-66', number: '66', name: 'Corales del Viento', area: 432.19, price: 112369400, status: 'DISPONIBLE', type: 'Reserva Natural', dimensions: 'Según Plano', distance: '150 - 300 metros', tag: 'Condominio Campestre', image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2064&auto=format&fit=crop' },
];


  const [selectedLot, setSelectedLot] = useState(lots.find(l => l.status === 'DISPONIBLE') || lots[0]);
  const [filter, setFilter] = useState('Todos los Lotes');

  const filteredLots = lots.filter(lot => {
    if (filter === 'Todos los Lotes') return true;
    if (filter === 'Frente a Playa') return lot.type === '150m Playa';
    if (filter === 'Junto al Club') return lot.type === 'Junto al Club';
    if (filter === 'Lotes XL') return lot.type === 'Lotes XL' || lot.type === 'Reserva Natural';
    return true;
  }).sort((a, b) => {
    // Primero ordenar por Disponibilidad (Disponibles arriba, Vendidos abajo)
    if (a.status === 'DISPONIBLE' && b.status === 'VENDIDO') return -1;
    if (a.status === 'VENDIDO' && b.status === 'DISPONIBLE') return 1;
    // Luego ordenar por número de lote para mantener el orden numérico dentro de su categoría
    return parseInt(a.number) - parseInt(b.number);
  });

  const formatPrice = (price: number) => {
    return `$${(price / 1000000)}M COP`;
  };

  const handleWhatsApp = () => {
    const phone = companyPhone ? companyPhone.replace(/\D/g, '') : '573000000000';
    const message = `Hola, estoy muy interesado en el LOTE #${selectedLot.number} (${selectedLot.name}) por un valor de $${selectedLot.price.toLocaleString()} COP. ¿Me podrían brindar más información?`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
  };

  return (
    <section id="mapa-interactivo" className="py-16 lg:py-24 px-4 sm:px-6 bg-gray-50 relative overflow-hidden">
      
      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[var(--color-caribbean-blue)] uppercase tracking-[0.2em] text-xs font-bold mb-3">
            SALA DE VENTAS VIRTUAL
          </p>
          <h2 className="text-3xl md:text-5xl font-bold text-[var(--color-caribbean-dark)] mb-6 font-serif">
            Master Plan Interactivo
          </h2>
          <div className="w-16 h-1 bg-[var(--color-gold-accent)] mx-auto mb-6 md:mb-8"></div>
          <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
            Explora nuestro mapa interactivo. Selecciona la parcela de tu interés para conocer sus dimensiones, ubicación exacta y valor de inversión.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2 md:gap-4 mb-8 md:mb-12">
          <span className="w-full text-center md:w-auto text-xs md:text-sm font-bold text-gray-500 uppercase tracking-wider mb-2 md:mb-0">Filtros:</span>
          <button onClick={() => setFilter('Todos los Lotes')} className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${filter === 'Todos los Lotes' ? 'bg-[var(--color-caribbean-dark)] text-white border-[var(--color-caribbean-dark)] shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`}>Ver Todo</button>
          <button onClick={() => setFilter('Frente a Playa')} className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${filter === 'Frente a Playa' ? 'bg-[var(--color-caribbean-dark)] text-white border-[var(--color-caribbean-dark)] shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`}>🌊 Frente a Playa</button>
          <button onClick={() => setFilter('Junto al Club')} className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${filter === 'Junto al Club' ? 'bg-[var(--color-caribbean-dark)] text-white border-[var(--color-caribbean-dark)] shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`}>🏊‍♂️ Club Social</button>
          <button onClick={() => setFilter('Lotes XL')} className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all border ${filter === 'Lotes XL' ? 'bg-[var(--color-caribbean-dark)] text-white border-[var(--color-caribbean-dark)] shadow-md' : 'bg-white border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-800'}`}>🌴 Lotes XL</button>
        </div>

        {/* Main Interface */}
        <div className="bg-white border border-gray-100 rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.06)] p-3 md:p-5 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* Left Column: The "Map" Grid */}
          <div className="w-full lg:w-[55%] flex flex-col gap-4 border border-gray-100 rounded-2xl p-3 md:p-5 bg-gray-50 shadow-inner">
            
            {/* Ocean Block */}
            <div className="bg-blue-50 text-blue-700 text-center py-4 rounded-xl font-bold tracking-[0.2em] text-xs border border-blue-100 flex items-center justify-center gap-3">
              🌊 OCÉANO CARIBE · ACCESO A 150m
            </div>

            {/* Dynamic Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 overflow-y-auto max-h-[550px] pr-2 pb-4 custom-scrollbar">
              {filteredLots.map((lot) => (
                <button 
                  key={lot.id} 
                  onClick={() => lot.status === 'DISPONIBLE' && setSelectedLot(lot)}
                  className={`relative p-4 rounded-2xl border text-center transition-all duration-300 bg-white flex flex-col items-center justify-center min-h-[140px] shadow-sm
                    ${selectedLot.id === lot.id ? 'border-[var(--color-caribbean-blue)] bg-blue-50/50 shadow-[0_0_15px_rgba(0,163,224,0.2)] scale-[1.02] z-10' : 'border-gray-200'}
                    ${lot.status === 'VENDIDO' ? 'opacity-50 cursor-not-allowed bg-gray-100' : 'hover:border-[var(--color-caribbean-blue)] cursor-pointer hover:shadow-md'}
                  `}
                >
                  <p className={`text-[10px] sm:text-[11px] font-bold mb-2 uppercase tracking-widest ${lot.status === 'VENDIDO' ? 'text-gray-400' : 'text-blue-500'}`}>{lot.type}</p>
                  <p className="font-bold text-[var(--color-caribbean-dark)] text-base sm:text-xl font-serif tracking-widest mb-1">LOTE {lot.number}</p>
                  <p className="text-gray-400 text-xs sm:text-sm mb-3 font-light">{lot.area} m²</p>
                  {lot.status === 'DISPONIBLE' ? (
                    <>
                      <p className="font-bold text-[var(--color-caribbean-dark)] mb-2 text-xs sm:text-sm tracking-wider">{formatPrice(lot.price)}</p>
                      <span className="flex items-center justify-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-emerald-600 tracking-widest uppercase bg-emerald-50 px-2 py-1 rounded-full border border-emerald-100">
                        <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div> 
                        DISPONIBLE
                      </span>
                    </>
                  ) : (
                    <>
                      <p className="font-bold text-gray-400 mb-2 text-xs sm:text-sm line-through">VENDIDO</p>
                      <span className="flex items-center justify-center gap-1.5 text-[9px] sm:text-[10px] font-bold text-gray-500 tracking-widest uppercase bg-gray-100 px-2 py-1 rounded-full border border-gray-200">
                        <div className="w-1.5 h-1.5 rounded-full bg-gray-400"></div> 
                        NO DISPONIBLE
                      </span>
                    </>
                  )}
                </button>
              ))}
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-2 pt-5 border-t border-gray-200">
              <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Disponible</div>
              <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> Club Social</div>
              <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider"><div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div> Vendido</div>
            </div>
          </div>

          {/* Right Column: Details Pane */}
          <div className="w-full lg:w-[45%] flex flex-col bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 relative">
            
            {/* Image Header */}
            <div className="relative h-64 w-full bg-gray-100">
              <Image 
                src={selectedLot.image} 
                alt={`Lote ${selectedLot.number}`} 
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
              
              <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md border border-white/50 text-[var(--color-caribbean-dark)] text-[10px] font-bold uppercase px-4 py-2 rounded-full flex items-center gap-2 tracking-[0.2em] shadow-sm">
                <span className="text-[var(--color-gold-accent)]">★</span> {selectedLot.tag}
              </div>
              
              <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                <div>
                  <span className="text-[var(--color-gold-accent)] font-bold tracking-[0.2em] text-xs uppercase mb-1 block">Lote #{selectedLot.number}</span>
                  <h3 className="text-3xl font-bold text-white font-serif tracking-wide">{selectedLot.name}</h3>
                </div>
              </div>
            </div>

            {/* Details Content */}
            <div className="p-5 md:p-8 flex flex-col flex-grow relative z-10">
              
              <p className="text-gray-500 text-sm leading-relaxed mb-6 md:mb-8 pb-6 md:pb-8 border-b border-gray-100 font-light">
                Ubicación privilegiada en la primera franja de acceso a la playa de San Bernardo del Viento. Topografía 100% plana, delimitada y lista para construir la villa de sus sueños.
              </p>

              <div className="space-y-4 md:space-y-6 mb-8 md:mb-10">
                <div className="grid grid-cols-[140px_1fr] items-center text-sm">
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Área Total</span>
                  <span className="font-bold text-[var(--color-caribbean-dark)] text-lg tracking-wide">{selectedLot.area} m²</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] items-center text-sm">
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Dimensiones</span>
                  <span className="font-medium text-gray-600">{selectedLot.dimensions}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] items-center text-sm">
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">A la Playa</span>
                  <span className="font-bold text-[var(--color-caribbean-blue)]">{selectedLot.distance}</span>
                </div>
                <div className="grid grid-cols-[140px_1fr] items-start text-sm">
                  <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Respaldo Legal</span>
                  <span className="font-medium text-gray-600">Título Notariado e Impuestos al día</span>
                </div>
              </div>

              {/* Pricing Box */}
              <div className="bg-gray-50 rounded-2xl p-7 mb-8 text-[var(--color-caribbean-dark)] shadow-sm relative overflow-hidden border border-gray-200">
                
                <div className="flex justify-between items-end mb-5 pb-5 border-b border-gray-200 relative z-10">
                  <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Inversión Total</span>
                  <span className="text-2xl sm:text-3xl font-bold text-[var(--color-caribbean-blue)] tracking-tight">${selectedLot.price.toLocaleString()} COP</span>
                </div>
                <div className="flex justify-between items-center relative z-10">
                  <div>
                    <span className="block text-[10px] text-gray-500 mb-1 tracking-widest uppercase font-bold">Cuota Inicial</span>
                    <span className="font-bold text-[var(--color-caribbean-dark)] text-lg tracking-wide">$10.000.000 COP</span>
                  </div>
                  <div className="text-right">
                    <span className="bg-white px-3 py-1.5 rounded-lg text-[10px] font-bold text-[var(--color-caribbean-dark)] border border-gray-200 tracking-widest uppercase shadow-sm">0% Interés</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-3 mt-auto">
                <button 
                  onClick={handleWhatsApp}
                  className="w-full bg-[var(--color-caribbean-blue)] hover:bg-[#008CBA] text-white font-bold py-3.5 md:py-4 rounded-xl flex items-center justify-center gap-2 md:gap-3 transition-all shadow-[0_10px_20px_rgba(0,163,224,0.2)] hover:-translate-y-0.5 tracking-wider text-xs md:text-sm uppercase"
                >
                  <MessageCircle className="w-4 h-4 md:w-5 md:h-5" />
                  APARTAR LOTE AHORA
                </button>
                <Link href="#contacto" className="w-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-[var(--color-caribbean-dark)] font-bold py-3.5 md:py-4 rounded-xl flex items-center justify-center gap-2 md:gap-3 transition-all tracking-wider text-xs md:text-sm uppercase">
                  <FileText className="w-4 h-4 md:w-5 md:h-5" />
                  DESCARGAR BROCHURE PDF
                </Link>
              </div>

            </div>
          </div>
        </div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.02); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(0,0,0,0.1); border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: rgba(0,163,224,0.5); }
      `}} />
    </section>
  );
}
