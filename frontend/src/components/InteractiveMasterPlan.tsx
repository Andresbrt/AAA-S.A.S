'use client';
import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PiWhatsappLogoLight, PiFileTextLight, PiMapPinLight } from 'react-icons/pi';
import { Waves } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { buildWhatsAppUrl } from '@/lib/contact';
import { trackLotSelect, trackWhatsAppClick } from '@/lib/analytics';

export interface Lot {
  id: string | number;
  number: string;
  name: string;
  area: number;
  price: number;
  status: string;
  type: string;
  dimensions?: string;
  distance?: string;
  tag?: string;
  image: string;
}

// Fallback oficial de 66 lotes reales de Corales del Viento con áreas y precios calculados a $260.000 COP/m²
const defaultCoralesLots: Lot[] = [
  { id: 'lote-01', number: '01', name: 'Corales del Viento · Lote 01', area: 167.51, price: 43552600, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '150 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-02', number: '02', name: 'Corales del Viento · Lote 02', area: 151.65, price: 39429000, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '150 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-03', number: '03', name: 'Corales del Viento · Lote 03', area: 196.27, price: 51030200, status: 'DISPONIBLE', type: '150m Playa', dimensions: 'Según Plano', distance: '150 metros al mar', tag: 'Oportunidad Preventa', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-04', number: '04', name: 'Corales del Viento · Lote 04', area: 195.34, price: 50788400, status: 'DISPONIBLE', type: '150m Playa', dimensions: 'Según Plano', distance: '150 metros al mar', tag: 'Oportunidad Preventa', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-05', number: '05', name: 'Corales del Viento · Lote 05', area: 168.57, price: 43828200, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '160 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-06', number: '06', name: 'Corales del Viento · Lote 06', area: 164.25, price: 42705000, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '160 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-07', number: '07', name: 'Corales del Viento · Lote 07', area: 164.31, price: 42720600, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '160 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-08', number: '08', name: 'Corales del Viento · Lote 08', area: 177.46, price: 46139600, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '170 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-09', number: '09', name: 'Corales del Viento · Lote 09', area: 198.99, price: 51737400, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '170 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-10', number: '10', name: 'Corales del Viento · Lote 10', area: 166.89, price: 43391400, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '170 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-11', number: '11', name: 'Corales del Viento · Lote 11', area: 163.96, price: 42629600, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '180 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-12', number: '12', name: 'Corales del Viento · Lote 12', area: 152.49, price: 39647400, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '180 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-13', number: '13', name: 'Corales del Viento · Lote 13', area: 139.60, price: 36296000, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '180 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-14', number: '14', name: 'Corales del Viento · Lote 14', area: 194.49, price: 50567400, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '190 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-15', number: '15', name: 'Corales del Viento · Lote 15', area: 167.59, price: 43573400, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '190 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-16', number: '16', name: 'Corales del Viento · Lote 16', area: 166.99, price: 43417400, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '190 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-17', number: '17', name: 'Corales del Viento · Lote 17', area: 140.00, price: 36400000, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '200 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-18', number: '18', name: 'Corales del Viento · Lote 18', area: 144.61, price: 37598600, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '200 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-19', number: '19', name: 'Corales del Viento · Lote 19', area: 165.30, price: 42978000, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '200 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-20', number: '20', name: 'Corales del Viento · Lote 20', area: 168.00, price: 43680000, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '210 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-21', number: '21', name: 'Corales del Viento · Lote 21', area: 166.99, price: 43417400, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '210 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-22', number: '22', name: 'Corales del Viento · Lote 22', area: 140.00, price: 36400000, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '210 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-23', number: '23', name: 'Corales del Viento · Lote 23', area: 147.00, price: 38220000, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '220 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-24', number: '24', name: 'Corales del Viento · Lote 24', area: 179.34, price: 46628400, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '220 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-25', number: '25', name: 'Corales del Viento · Lote 25', area: 140.00, price: 36400000, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '220 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-26', number: '26', name: 'Corales del Viento · Lote 26', area: 137.64, price: 35786400, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '230 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-27', number: '27', name: 'Corales del Viento · Lote 27', area: 146.59, price: 38113400, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '230 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-28', number: '28', name: 'Corales del Viento · Lote 28', area: 146.86, price: 38183600, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '230 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-29', number: '29', name: 'Corales del Viento · Lote 29', area: 150.00, price: 39000000, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '240 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-30', number: '30', name: 'Corales del Viento · Lote 30', area: 140.00, price: 36400000, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '240 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-31', number: '31', name: 'Corales del Viento · Lote 31', area: 138.27, price: 35950200, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '240 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-32', number: '32', name: 'Corales del Viento · Lote 32', area: 145.32, price: 37783200, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '250 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-33', number: '33', name: 'Corales del Viento · Lote 33', area: 148.83, price: 38695800, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '250 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-34', number: '34', name: 'Corales del Viento · Lote 34', area: 205.64, price: 53466400, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '250 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-35', number: '35', name: 'Corales del Viento · Lote 35', area: 182.04, price: 47330400, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '260 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-36', number: '36', name: 'Corales del Viento · Lote 36', area: 144.19, price: 37489400, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '260 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-37', number: '37', name: 'Corales del Viento · Lote 37', area: 156.01, price: 40562600, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '260 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-38', number: '38', name: 'Corales del Viento · Lote 38', area: 189.00, price: 49140000, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '270 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-39', number: '39', name: 'Corales del Viento · Lote 39', area: 167.81, price: 43630600, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '270 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-40', number: '40', name: 'Corales del Viento · Lote 40', area: 144.31, price: 37520600, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '270 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-41', number: '41', name: 'Corales del Viento · Lote 41', area: 159.01, price: 41342600, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '280 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-42', number: '42', name: 'Corales del Viento · Lote 42', area: 148.47, price: 38602200, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '280 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-43', number: '43', name: 'Corales del Viento · Lote 43', area: 203.00, price: 52780000, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '280 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-44', number: '44', name: 'Corales del Viento · Lote 44', area: 180.00, price: 46800000, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '290 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-45', number: '45', name: 'Corales del Viento · Lote 45', area: 180.00, price: 46800000, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '290 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-46', number: '46', name: 'Corales del Viento · Lote 46', area: 234.63, price: 61003800, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '290 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-47', number: '47', name: 'Corales del Viento · Lote 47', area: 212.54, price: 55260400, status: 'DISPONIBLE', type: '150m Playa', dimensions: 'Según Plano', distance: '150 metros al mar', tag: 'Oportunidad Preventa', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-48', number: '48', name: 'Corales del Viento · Lote 48', area: 193.10, price: 50206000, status: 'DISPONIBLE', type: '150m Playa', dimensions: 'Según Plano', distance: '150 metros al mar', tag: 'Oportunidad Preventa', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-49', number: '49', name: 'Corales del Viento · Lote 49', area: 196.62, price: 51121200, status: 'DISPONIBLE', type: '150m Playa', dimensions: 'Según Plano', distance: '150 metros al mar', tag: 'Oportunidad Preventa', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-50', number: '50', name: 'Corales del Viento · Lote 50', area: 177.44, price: 46134400, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '160 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-51', number: '51', name: 'Corales del Viento · Lote 51', area: 186.32, price: 48443200, status: 'DISPONIBLE', type: '150m Playa', dimensions: 'Según Plano', distance: '150 metros al mar', tag: 'Oportunidad Preventa', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-52', number: '52', name: 'Corales del Viento · Lote 52', area: 253.17, price: 65824200, status: 'DISPONIBLE', type: 'Lotes XL', dimensions: 'Según Plano', distance: '210 metros al mar', tag: 'Lote XL Frente a Zona Verde', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-53', number: '53', name: 'Corales del Viento · Lote 53', area: 377.88, price: 98248800, status: 'DISPONIBLE', type: 'Lotes XL', dimensions: 'Según Plano', distance: '220 metros al mar', tag: 'Lote XL Premium', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-54', number: '54', name: 'Corales del Viento · Lote 54', area: 405.00, price: 105300000, status: 'DISPONIBLE', type: 'Lotes XL', dimensions: 'Según Plano', distance: '230 metros al mar', tag: 'Lote XL Gran Dimensión', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-55', number: '55', name: 'Corales del Viento · Lote 55', area: 228.67, price: 59454200, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '230 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-56', number: '56', name: 'Corales del Viento · Lote 56', area: 200.00, price: 52000000, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '240 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-57', number: '57', name: 'Corales del Viento · Lote 57', area: 235.28, price: 61172800, status: 'VENDIDO', type: '150m Playa', dimensions: 'Según Plano', distance: '240 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-58', number: '58', name: 'Corales del Viento · Lote 58', area: 265.09, price: 68923400, status: 'VENDIDO', type: 'Lotes XL', dimensions: 'Según Plano', distance: '250 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-59', number: '59', name: 'Corales del Viento · Lote 59', area: 278.41, price: 72386600, status: 'VENDIDO', type: 'Lotes XL', dimensions: 'Según Plano', distance: '250 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-60', number: '60', name: 'Corales del Viento · Lote 60', area: 294.46, price: 76559600, status: 'DISPONIBLE', type: 'Lotes XL', dimensions: 'Según Plano', distance: '260 metros al mar', tag: 'Lote XL Frente al Mar', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-61', number: '61', name: 'Corales del Viento · Lote 61', area: 303.79, price: 78985400, status: 'VENDIDO', type: 'Lotes XL', dimensions: 'Según Plano', distance: '260 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-62', number: '62', name: 'Corales del Viento · Lote 62', area: 303.58, price: 78930800, status: 'VENDIDO', type: 'Lotes XL', dimensions: 'Según Plano', distance: '270 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-63', number: '63', name: 'Corales del Viento · Lote 63', area: 257.08, price: 66840800, status: 'DISPONIBLE', type: 'Lotes XL', dimensions: 'Según Plano', distance: '270 metros al mar', tag: 'Lote XL Excelente Ubicación', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-64', number: '64', name: 'Corales del Viento · Lote 64', area: 259.70, price: 67522000, status: 'VENDIDO', type: 'Lotes XL', dimensions: 'Según Plano', distance: '280 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-65', number: '65', name: 'Corales del Viento · Lote 65', area: 504.34, price: 131128400, status: 'VENDIDO', type: 'Lotes XL', dimensions: 'Según Plano', distance: '280 metros al mar', tag: 'Adjudicado', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' },
  { id: 'lote-66', number: '66', name: 'Corales del Viento · Lote 66', area: 432.19, price: 112369400, status: 'DISPONIBLE', type: 'Lotes XL', dimensions: 'Según Plano', distance: '290 metros al mar', tag: 'Lote XL Familiar', image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp' }
];

export default function InteractiveMasterPlan({ projectSlug, companyPhone, properties }: { projectSlug?: string, companyPhone?: string, properties?: any[] }) {
  // Map API properties to the expected format
  const apiLots = (properties && properties.length > 0) ? properties.map((p, index) => {
    const rawNum = p.name?.replace(/\D/g, '') || String(index + 1);
    const num = rawNum.length === 1 ? `0${rawNum}` : rawNum;
    const area = p.privateArea || p.builtArea || 0;
    const isXL = area >= 250;
    const defaultType = isXL ? 'Lotes XL' : '150m Playa';
    return {
      id: p.id || `prop-${index}`,
      number: num,
      name: p.name ? `Corales del Viento · ${p.name}` : `Corales del Viento · Lote ${num}`,
      area: area,
      price: p.price || (area * 260000),
      status: p.status || 'DISPONIBLE',
      type: p.floorOrTower || defaultType,
      dimensions: 'Según Plano Oficial',
      distance: isXL ? '200 - 300 metros al mar' : '150 metros al mar',
      tag: p.status === 'VENDIDO' ? 'Adjudicado' : 'Oportunidad Preventa',
      image: 'https://xvderakdvfvmnuczamla.supabase.co/storage/v1/object/public/media/project/8b6c778a-7393-415d-9bb2-ba01dcdf6a41/72bd118c-ea71-4e02-9780-d98100681e0f-IMG_0533.JPG.webp'
    };
  }) : [];

  const lots: Lot[] = apiLots.length > 0 ? apiLots : defaultCoralesLots;

  const [selectedLot, setSelectedLot] = useState<Lot | null>(
    lots.find(l => l.status === 'DISPONIBLE') || lots[0] || null
  );
  const [filter, setFilter] = useState('Todos los Lotes');

  const filteredLots = lots.filter(lot => {
    if (filter === 'Todos los Lotes') return true;
    if (filter === 'Disponibles') return lot.status === 'DISPONIBLE';
    if (filter === 'Frente al Mar' || filter === 'Frente a Playa') return lot.type === '150m Playa' || lot.type === 'Frente al Mar' || lot.type?.includes('Playa') || lot.type?.includes('Mar');
    if (filter === 'Lotes XL') return lot.type === 'Lotes XL' || lot.type === 'Reserva Natural' || lot.area >= 250;
    
    // Dynamic fallback for custom types introduced from DB
    return lot.type?.toLowerCase().includes(filter.toLowerCase()) || lot.distance?.toLowerCase().includes(filter.toLowerCase());
  }).sort((a, b) => {
    // Primero ordenar por Disponibilidad (Disponibles arriba, Vendidos abajo)
    if (a.status === 'DISPONIBLE' && b.status === 'VENDIDO') return -1;
    if (a.status === 'VENDIDO' && b.status === 'DISPONIBLE') return 1;
    // Luego ordenar por número de lote para mantener el orden numérico dentro de su categoría
    return parseInt(a.number) - parseInt(b.number);
  });

  const formatPrice = (price: number) => {
    return `$${(price / 1000000).toLocaleString('es-CO', { maximumFractionDigits: 1 })}M COP`;
  };

  const handleWhatsApp = () => {
    if (!selectedLot) return;
    trackWhatsAppClick('masterplan_selected_lot', `Lote ${selectedLot.number}`);
    const message = `Hola, estoy muy interesado en SEPARAR el LOTE #${selectedLot.number} de Corales del Viento (${selectedLot.area} m² a $260.000/m²) por un valor de $${selectedLot.price.toLocaleString()} COP. ¿Me podrían brindar más información?`;
    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  };

  return (
    <section id="mapa-interactivo" className="py-16 lg:py-24 px-4 sm:px-6 bg-gray-50 relative overflow-hidden">
      
      <div className="container mx-auto max-w-7xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-16">
          <p className="text-[var(--color-gold-accent)] uppercase tracking-[0.2em] text-xs font-bold mb-3">
            PLANOS & DISPONIBILIDAD EN TIEMPO REAL
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-[var(--color-caribbean-dark)] mb-6 font-sans tracking-tight">
            SALA DE VENTAS VIRTUAL
          </h2>
          <div className="w-20 h-1 bg-[var(--color-gold-accent)] mx-auto mb-6 md:mb-8"></div>
          <p className="text-gray-500 max-w-2xl mx-auto text-base md:text-lg font-light leading-relaxed">
            Selecciona el lote de tu interés para conocer sus dimensiones, ubicación exacta dentro del proyecto y valor de inversión a <strong className="font-bold text-[var(--color-caribbean-dark)]">$260.000 COP/m²</strong>.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 md:gap-5 mb-10 md:mb-14" role="group" aria-label="Filtros de la sala de ventas virtual">
          <span className="w-full text-center md:w-auto text-[10px] md:text-xs font-bold text-gray-400 uppercase tracking-[0.2em] mb-2 md:mb-0">Filtrar por:</span>
          <button type="button" aria-pressed={filter === 'Todos los Lotes'} onClick={() => setFilter('Todos los Lotes')} className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${filter === 'Todos los Lotes' ? 'bg-[var(--color-caribbean-dark)] text-white border-[var(--color-caribbean-dark)] shadow-[0_5px_15px_rgba(55,111,135,0.25)] scale-105' : 'bg-transparent border-gray-300 text-gray-500 hover:border-[var(--color-caribbean-blue)] hover:text-[var(--color-caribbean-blue)]'}`}>Todos ({lots.length})</button>
          <button type="button" aria-pressed={filter === 'Disponibles'} onClick={() => setFilter('Disponibles')} className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${filter === 'Disponibles' ? 'bg-emerald-700 text-white border-emerald-700 shadow-[0_5px_15px_rgba(16,185,129,0.25)] scale-105' : 'bg-transparent border-emerald-300 text-emerald-700 hover:bg-emerald-50'}`}>Disponibles ({lots.filter(l => l.status === 'DISPONIBLE').length})</button>
          <button type="button" aria-pressed={filter === 'Frente al Mar'} onClick={() => setFilter('Frente al Mar')} className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${filter === 'Frente al Mar' ? 'bg-[var(--color-caribbean-dark)] text-white border-[var(--color-caribbean-dark)] shadow-[0_5px_15px_rgba(55,111,135,0.25)] scale-105' : 'bg-transparent border-gray-300 text-gray-500 hover:border-[var(--color-caribbean-blue)] hover:text-[var(--color-caribbean-blue)]'}`}>Frente al Mar</button>
          <button type="button" aria-pressed={filter === 'Lotes XL'} onClick={() => setFilter('Lotes XL')} className={`px-6 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest transition-all duration-300 border ${filter === 'Lotes XL' ? 'bg-[var(--color-caribbean-dark)] text-white border-[var(--color-caribbean-dark)] shadow-[0_5px_15px_rgba(55,111,135,0.25)] scale-105' : 'bg-transparent border-gray-300 text-gray-500 hover:border-[var(--color-caribbean-blue)] hover:text-[var(--color-caribbean-blue)]'}`}>Lotes XL (&ge; 250m²)</button>
        </div>

        {/* Main Interface */}
        <div className="bg-white border border-gray-100 rounded-[2rem] shadow-[0_15px_40px_rgba(0,0,0,0.06)] p-3 md:p-5 lg:p-8 flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* Left Column: The "Map" Grid */}
          <div className="w-full lg:w-[55%] flex flex-col gap-4 border border-gray-100 rounded-2xl p-3 md:p-5 bg-gray-50 shadow-inner">
            
            {/* Ocean Block */}
            <div className="bg-gradient-to-r from-sky-50 via-sky-100/60 to-sky-50 text-sky-800 text-center py-3.5 rounded-xl font-bold tracking-[0.25em] text-xs border border-sky-200/60 flex items-center justify-center gap-2.5 shadow-sm">
              <Waves className="w-4 h-4 text-sky-600 animate-pulse" />
              <span>OCÉANO CARIBE · ACCESO A 150m AL MAR</span>
            </div>


            {/* Dynamic Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 overflow-y-auto max-h-[600px] pr-2 pb-4 custom-scrollbar" role="region" aria-label="Cuadrícula de lotes disponibles">
              <AnimatePresence>
                {filteredLots.map((lot, index) => (
                  <motion.button 
                    key={lot.id} 
                    type="button"
                    aria-label={`Lote ${lot.number}, ${lot.area} metros cuadrados, tipo ${lot.type}, estado ${lot.status}`}
                    initial={{ opacity: 0, y: 20 }}

                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    onClick={() => {
                      if (lot.status === 'DISPONIBLE') {
                        setSelectedLot(lot);
                        trackLotSelect(lot.number, lot.area, lot.price);
                      }
                    }}
                    className={`relative p-5 rounded-2xl border transition-all duration-300 flex flex-col items-center justify-center min-h-[160px]
                      ${selectedLot?.id === lot.id 
                        ? 'border-[var(--color-gold-accent)] bg-white shadow-[0_10px_30px_rgba(212,175,55,0.15)] scale-[1.02] z-10' 
                        : 'border-gray-200/60 bg-white/40 hover:bg-white'}
                      ${lot.status === 'VENDIDO' 
                        ? 'opacity-40 cursor-not-allowed filter grayscale bg-gray-50 border-gray-100' 
                        : 'hover:border-[var(--color-caribbean-blue)]/50 cursor-pointer hover:shadow-lg'}
                    `}
                  >
                    <p className={`text-[9px] sm:text-[10px] font-bold mb-3 uppercase tracking-widest ${lot.status === 'VENDIDO' ? 'text-gray-400' : 'text-[var(--color-caribbean-blue)]'}`}>{lot.type}</p>
                    <p className="font-extrabold text-[var(--color-caribbean-dark)] text-lg sm:text-2xl font-sans tracking-tight mb-1">Lote {lot.number}</p>
                    <p className="text-gray-400 text-xs sm:text-sm mb-4 font-light tracking-wide">{lot.area} m²</p>
                    
                    {lot.status === 'DISPONIBLE' ? (
                      <>
                        <p className="font-bold text-[var(--color-caribbean-dark)] mb-3 text-sm tracking-wider">{formatPrice(lot.price)}</p>
                        <span className="flex items-center justify-center gap-1.5 text-[8px] sm:text-[9px] font-bold text-emerald-700 tracking-[0.2em] uppercase bg-emerald-50/80 px-3 py-1.5 rounded-full border border-emerald-100/50">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span> 
                          DISPONIBLE
                        </span>
                      </>
                    ) : (
                      <>
                        <p className="font-bold text-gray-400 mb-3 text-sm line-through tracking-wider">VENDIDO</p>
                        <span className="flex items-center justify-center gap-1.5 text-[8px] sm:text-[9px] font-bold text-gray-500 tracking-[0.2em] uppercase bg-gray-100 px-3 py-1.5 rounded-full border border-gray-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-gray-400"></span> 
                          VENDIDO
                        </span>
                      </>
                    )}
                  </motion.button>
                ))}
              </AnimatePresence>
            </div>
            
            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-8 mt-2 pt-5 border-t border-gray-200">
              <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider"><div className="w-2.5 h-2.5 rounded-full bg-emerald-500"></div> Disponible</div>
              <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-gray-500 font-bold uppercase tracking-wider"><div className="w-2.5 h-2.5 rounded-full bg-blue-500"></div> Club Social</div>
              <div className="flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs text-gray-400 font-bold uppercase tracking-wider"><div className="w-2.5 h-2.5 rounded-full bg-gray-300"></div> Vendido</div>
            </div>
          </div>

          {/* Right Column: Details Pane */}
          <AnimatePresence mode="wait">
            {selectedLot && (
              <motion.div 
                key={selectedLot.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.4 }}
                className="w-full lg:w-[45%] flex flex-col bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-100 relative"
              >
                
                {/* Image Header */}
                <div className="relative h-64 w-full bg-gray-100">
                  <Image 
                    src={selectedLot.image} 
                    alt={`Lote ${selectedLot.number}`} 
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                  
                  <div className="absolute top-5 left-5 bg-white/90 backdrop-blur-md border border-white/50 text-[var(--color-caribbean-dark)] text-[10px] font-bold uppercase px-4 py-2 rounded-full flex items-center gap-2 tracking-[0.2em] shadow-sm">
                    <span className="text-[var(--color-gold-accent)]">★</span> {selectedLot.tag}
                  </div>
                  
                  <div className="absolute bottom-6 left-6 right-6 flex justify-between items-end">
                    <div>
                      <span className="text-[var(--color-gold-accent)] font-bold tracking-[0.2em] text-xs uppercase mb-1 block">Lote #{selectedLot.number}</span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-sans tracking-tight">{selectedLot.name}</h3>
                    </div>
                  </div>
                </div>

                {/* Details Content */}
                <div className="p-5 md:p-8 flex flex-col flex-grow relative z-10">
                  
                  <p className="text-gray-500 text-sm leading-relaxed mb-6 md:mb-8 pb-6 md:pb-8 border-b border-gray-100 font-light">
                    Ubicación privilegiada en zona turística de alta valorización a solo 5 minutos del mar en San Bernardo del Viento. Terreno delimitado, 100% plano y listo para construir el hogar de tus sueños.
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
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Al Mar</span>
                      <span className="font-bold text-[var(--color-caribbean-blue)]">{selectedLot.distance}</span>
                    </div>
                    <div className="grid grid-cols-[140px_1fr] items-start text-sm">
                      <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest">Respaldo Legal</span>
                      <span className="font-medium text-gray-600">Escritura individual</span>
                    </div>
                  </div>

                  {/* Pricing Box */}
                  <div className="bg-gradient-to-br from-gray-50 to-white rounded-3xl p-8 mb-10 text-[var(--color-caribbean-dark)] shadow-[0_10px_40px_rgba(0,0,0,0.03)] relative overflow-hidden border border-[var(--color-gold-accent)]/20">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--color-gold-accent)]/5 rounded-full blur-2xl"></div>
                    
                    <div className="flex flex-col mb-6 pb-6 border-b border-gray-100 relative z-10">
                      <span className="text-[10px] text-gray-400 uppercase tracking-[0.25em] font-bold mb-2">Inversión Total</span>
                      <div className="flex items-baseline gap-2">
                        <span className="text-3xl sm:text-4xl lg:text-5xl font-sans font-extrabold text-[var(--color-caribbean-dark)] tracking-tight tabular-nums">
                          ${selectedLot.price.toLocaleString()}
                        </span>
                        <span className="text-base sm:text-lg font-sans text-gray-400 font-semibold tracking-wider">COP</span>
                      </div>
                    </div>
                    <div className="flex justify-between items-center relative z-10">
                      <div>
                        <span className="block text-[10px] text-gray-400 mb-1 tracking-[0.2em] uppercase font-bold">Cuota Inicial Sugerida</span>
                        <span className="font-sans font-extrabold text-[var(--color-caribbean-blue)] text-lg sm:text-xl tracking-tight tabular-nums">$10.000.000 COP</span>
                      </div>
                      <div className="text-right">
                        <span className="bg-[var(--color-caribbean-dark)] px-4 py-2 rounded-full text-[9px] font-bold text-white tracking-widest uppercase shadow-md">0% Interés</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="space-y-3 mt-auto">
                    <button 
                      type="button"
                      aria-label="Separar tu lote ahora por WhatsApp"
                      onClick={handleWhatsApp}
                      className="w-full bg-[var(--color-caribbean-dark)] hover:bg-[#2b596d] text-white font-bold py-3.5 md:py-4 rounded-xl flex items-center justify-center gap-2 md:gap-3 transition-all shadow-[0_10px_20px_rgba(55,111,135,0.25)] hover:-translate-y-0.5 tracking-wider text-xs md:text-sm uppercase"
                    >
                      <PiWhatsappLogoLight className="w-4 h-4 md:w-5 md:h-5" />
                      SEPARAR TU LOTE
                    </button>
                    <a href={buildWhatsAppUrl('Hola! Estoy interesado en el proyecto Corales del Viento. ¿Me podrías compartir el plano en PDF con los precios y lotes disponibles?')} target="_blank" rel="noopener noreferrer" className="w-full bg-white border border-gray-200 hover:border-gray-300 hover:bg-gray-50 text-[var(--color-caribbean-dark)] font-bold py-3.5 md:py-4 rounded-xl flex items-center justify-center gap-2 md:gap-3 transition-all tracking-wider text-xs md:text-sm uppercase">
                      <PiFileTextLight className="w-4 h-4 md:w-5 md:h-5" />
                      SOLICITAR PLANO Y PRECIOS
                    </a>
                  </div>



                </div>
              </motion.div>
            )}
          </AnimatePresence>
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
