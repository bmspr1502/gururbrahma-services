import { BookOpenCheck, Gem, HeartHandshake, Home, LayoutGrid, MessageCircle, Shield, Users } from 'lucide-react';
import type { Service, Post, Video } from './types';

export const services: Service[] = [
  {
    id: 'sudarshana-homam',
    category: 'Purohitam',
    name: 'Sudarshana Homam',
    description: 'A powerful fire ritual to remove obstacles and negative energies.',
    price: 'Contact for details',
    detailedHtml: '<p>The Sudarshana Homam is one of the most effective homams for any person to overcome their enemies and sufferings. This homam is performed to accomplish any desire and for any purpose.</p>',
    icon: Shield,
    image: 'service-sudarshana-homam',
  },
  {
    id: 'ganapathi-homam',
    category: 'Purohitam',
    name: 'Ganapathi Homam',
    description: 'Performed to ensure success and prosperity in new ventures.',
    price: 'Contact for details',
    detailedHtml: '<p>Ganapathi Homam is performed to beget happiness, prosperity and good health. It is highly recommended to perform this homam before starting any new venture or project.</p>',
    icon: LayoutGrid,
    image: 'service-ganapathi-homam',
  },
  {
    id: 'graha-pravesham',
    category: 'Purohitam',
    name: 'Graha Pravesham',
    description: 'A housewarming ceremony to bless a new home.',
    price: 'Contact for details',
    detailedHtml: '<p>Graha Pravesham, or housewarming ceremony, is an important ritual to purify the space and bring positive energy, peace, and prosperity to the new home and its inhabitants.</p>',
    icon: Home,
    image: 'service-graha-pravesham',
  },
  {
    id: 'kalyanam',
    category: 'Purohitam',
    name: 'Kalyanams',
    description: 'Sacred wedding ceremonies performed according to Vedic traditions.',
    price: 'Contact for details',
    detailedHtml: '<p>We perform traditional Vedic wedding ceremonies (Kalyanam), invoking divine blessings for a long, happy, and prosperous married life for the couple.</p>',
    icon: Gem,
    image: 'service-kalyanam',
  },
  {
    id: 'jadhagam-analysis',
    category: 'Jyotisham',
    name: 'Jadhagam Analysis',
    description: 'In-depth analysis of your birth chart for life predictions.',
    price: 'Contact for details',
    detailedHtml: '<p>A detailed analysis of your Jadhagam (birth chart) can reveal insights into your personality, strengths, weaknesses, and the course of your life. It helps in making informed decisions.</p>',
    icon: BookOpenCheck,
    image: 'service-jadhagam-analysis',
  },
  {
    id: 'compatibility-check',
    category: 'Jyotisham',
    name: 'Compatibility Check',
    description: 'Marriage matching based on astrological charts of the couple.',
    price: 'Contact for details',
    detailedHtml: '<p>Astrological compatibility check is crucial for a harmonious married life. We analyze the birth charts of the prospective bride and groom to assess their compatibility on various levels.</p>',
    icon: Users,
    image: 'service-compatibility-check',
  },
  {
    id: 'general-advice',
    category: 'Jyotisham',
    name: 'General Advice',
    description: 'Astrological guidance for career, finance, and health.',
    price: 'Contact for details',
    detailedHtml: '<p>Get answers to your life\'s questions. We provide astrological guidance on matters related to career, finance, health, and relationships to help you navigate through life with clarity.</p>',
    icon: MessageCircle,
    image: 'service-general-advice',
  },
  {
    id: 'matrimony-assistance',
    category: 'Matrimony',
    name: 'Sourashtra Matrimony',
    description: 'Personal consultation to help find matches within the community.',
    price: 'Informational Only',
    detailedHtml: '<p>We help families find the right match within the Sourashtra community through personal consultation. This service is based on our extensive network and understanding of cultural values. We do not maintain a database of profiles online.</p>',
    icon: HeartHandshake,
    image: 'service-matrimony-assistance',
  },
];

export const allPosts: Post[] = [
  {
    id: 'post-1',
    title: 'The Significance of Diwali',
    content: '<h3>The Festival of Lights</h3><p>Diwali, also known as Deepavali, is one of the most prominent festivals in Hinduism. It symbolizes the spiritual "victory of light over darkness, good over evil, and knowledge over ignorance."</p><p>During this festival, people illuminate their homes, temples, and workspaces with diyas (oil lamps), candles, and lanterns. It is a time for family gatherings, feasting, and exchanging gifts.</p>',
    imageUrl: 'post-1',
    timestamp: new Date('2023-11-12T10:00:00Z'),
    tags: ['festival', 'diwali', 'spirituality'],
  },
  {
    id: 'post-2',
    title: 'Understanding Your Zodiac Sign',
    content: '<h3>The Twelve Houses of the Zodiac</h3><p>In Vedic astrology, the zodiac is divided into twelve houses, or Bhāvas, each representing a different aspect of life. Your rising sign, or Ascendant, determines the first house and sets the stage for the entire chart.</p><p>For example, Aries as the first house signifies beginnings and leadership, while the seventh house, Libra, represents partnerships and balance.</p>',
    imageUrl: 'post-2',
    timestamp: new Date('2023-10-25T14:30:00Z'),
    tags: ['astrology', 'zodiac', 'jyotisham'],
  },
  {
    id: 'post-3',
    title: 'The Power of Mantras',
    content: '<h3>Sound and Consciousness</h3><p>A mantra is a sacred utterance, a syllable, word, or phonemes, believed by practitioners to have psychological and spiritual powers. The repetition of a mantra, known as Japa, is a common practice in many spiritual traditions.</p><p>The Gayatri Mantra, for instance, is one of the oldest and most powerful of Sanskrit mantras. It is a prayer to the Sun deity for the illumination of the intellect.</p>',
    imageUrl: 'post-3',
    timestamp: new Date('2023-09-15T09:00:00Z'),
    tags: ['mantra', 'meditation', 'spirituality'],
  },
  {
    id: 'post-4',
    title: 'Vastu Shastra for a Harmonious Home',
    content: '<h3>The Science of Architecture</h3><p>Vastu Shastra is a traditional Indian system of architecture based on ancient texts that describe principles of design, layout, measurements, ground preparation, space arrangement, and spatial geometry. The designs are intended to integrate architecture with nature, the relative functions of various parts of the structure, and ancient beliefs utilizing geometric patterns (yantra), symmetry, and directional alignments.</p><p>For a peaceful home, Vastu suggests that the entrance should ideally face east or north, and the kitchen should be in the southeast corner.</p>',
    imageUrl: 'post-4',
    timestamp: new Date('2023-08-01T11:00:00Z'),
    tags: ['vastu', 'home', 'wellness'],
  },
];

export const latestPosts = allPosts.slice(0, 2);

export const latestVideos: Video[] = [
  {
    id: 'vid-1',
    youtubeUrl: 'https://www.youtube.com/watch?v=LXb3EKWsInQ', // Example: "lofi girl"
    title: 'Daily Chants for Positive Energy',
    type: 'video',
    timestamp: new Date(),
  },
  {
    id: 'vid-2',
    youtubeUrl: 'https://www.youtube.com/shorts/3n7dptK1jF4', // Example: "satisfying short"
    title: 'Quick Tip: Vastu for Home Office',
    type: 'short',
    timestamp: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
];
