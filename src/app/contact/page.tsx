import type { Metadata } from 'next';
import { ContactClient } from './contact-client';

export const metadata: Metadata = {
  title: 'Contact Us',
  description: 'Reach out to Shri. Uba. Ve. B. M. Sathya Ram Acharya for priest services, astrology consultations, or spiritual classes. Find our contact details and location in Salem, Tamil Nadu.',
};

export default function ContactPage() {
  return <ContactClient />;
}
