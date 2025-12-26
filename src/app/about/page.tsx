import type { Metadata } from 'next';
import { AboutClient } from './about-client';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Shri. Uba. Ve. B. M. Sathya Ram Acharya, our founder and principal priest with over 30 years of experience in Vedic traditions and spiritual services.',
};

export default function AboutPage() {
  return <AboutClient />;
}
