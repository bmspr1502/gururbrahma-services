import type { Metadata } from 'next';
import { ServicesClient } from './services-client';

export const metadata: Metadata = {
  title: 'Our Services',
  description: 'Authentic Vedic spiritual services including Purohitam (Sudarshana Homam, Ganapathi Homam), Jyotisham (Horoscope Analysis), and Teaching (Sanskrit, Bhagavad Gita).',
};

export default function ServicesPage() {
  return <ServicesClient />;
}
