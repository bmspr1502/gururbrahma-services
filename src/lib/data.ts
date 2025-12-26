import {
  BookOpenCheck,
  Gem,
  HeartHandshake,
  Home,
  LayoutGrid,
  MessageCircle,
  Shield,
  Users,
} from "lucide-react";
import type { Service, Post, Video } from "./types";

export const services: Service[] = [
  // Purohitam
  {
    id: "sudarshana-homam",
    category: "Purohitam",
    name: "sudarshana_homam_name",
    description: "sudarshana_homam_desc",
    price: "Contact for details",
    detailedHtml: "sudarshana_homam_detail",
    icon: "Shield",
    image: "service-sudarshana-homam",
  },
  {
    id: "ganapathi-homam",
    category: "Purohitam",
    name: "ganapathi_homam_name",
    description: "ganapathi_homam_desc",
    price: "Contact for details",
    detailedHtml: "ganapathi_homam_detail",
    icon: "LayoutGrid",
    image: "service-ganapathi-homam",
  },
  {
    id: "gruhapravesham",
    category: "Purohitam",
    name: "gruhapravesham_name",
    description: "gruhapravesham_desc",
    price: "Contact for details",
    detailedHtml: "gruhapravesham_detail",
    icon: "Home",
    image: "service-graha-pravesham",
  },
  {
    id: "muhurtham",
    category: "Purohitam",
    name: "muhurtham_name",
    description: "muhurtham_desc",
    price: "Contact for details",
    detailedHtml: "muhurtham_detail",
    icon: "Gem",
    image: "service-kalyanam",
  },
  {
    id: "upanyasam",
    category: "Purohitam",
    name: "upanyasam_name",
    description: "upanyasam_desc",
    price: "Contact for details",
    detailedHtml: "upanyasam_detail",
    icon: "MessageCircle",
    image: "service-general-advice", // Reuse advice image
  },
  {
    id: "bhagavata-saptaaham",
    category: "Purohitam",
    name: "bhagavata_saptaaham_name",
    description: "bhagavata_saptaaham_desc",
    price: "Contact for details",
    detailedHtml: "bhagavata_saptaaham_detail",
    icon: "Users",
    image: "service-compatibility-check", // Reuse compatibility image
  },

  // Jyotisham
  {
    id: "jadhaga-parivarthanai",
    category: "Jyotisham",
    name: "jadhaga_parivarthanai_name",
    description: "jadhaga_parivarthanai_desc",
    price: "Contact for details",
    detailedHtml: "jadhaga_parivarthanai_detail",
    icon: "BookOpenCheck",
    image: "service-jadhagam-analysis",
  },
  {
    id: "compatibility-check",
    category: "Jyotisham",
    name: "compatibility_check_name",
    description: "compatibility_check_desc",
    price: "Contact for details",
    detailedHtml: "compatibility_check_detail",
    icon: "Users",
    image: "service-compatibility-check",
  },
  {
    id: "matrimony-assistance",
    category: "Jyotisham",
    name: "matrimony_assistance_name",
    description: "matrimony_assistance_desc",
    price: "Informational Only",
    detailedHtml: "matrimony_assistance_detail",
    icon: "HeartHandshake",
    image: "service-matrimony-assistance",
  },

  // Teaching
  {
    id: "sanskrit-classes",
    category: "Teaching",
    name: "sanskrit_classes_name",
    description: "sanskrit_classes_desc",
    price: "Contact for details",
    detailedHtml: "sanskrit_classes_detail",
    icon: "BookOpenCheck",
    image: "service-jadhagam-analysis",
  },
  {
    id: "bhagavad-gita-classes",
    category: "Teaching",
    name: "srimad_bhagavad_gita_classes_name",
    description: "srimad_bhagavad_gita_desc",
    price: "Contact for details",
    detailedHtml: "srimad_bhagavad_gita_classes_detail",
    icon: "BookOpenCheck",
    image: "service-jadhagam-analysis",
  },
  {
    id: "divya-prabandham-classes",
    category: "Teaching",
    name: "divya_prabandham_classes_name",
    description: "divya_prabandham_desc",
    price: "Contact for details",
    detailedHtml: "divya_prabandham_classes_detail",
    icon: "BookOpenCheck",
    image: "service-jadhagam-analysis",
  },
  {
    id: "hindi-classes",
    category: "Teaching",
    name: "hindi_classes_name",
    description: "hindi_classes_desc",
    price: "Contact for details",
    detailedHtml: "hindi_classes_detail",
    icon: "BookOpenCheck",
    image: "service-jadhagam-analysis",
  },
  {
    id: "vishnu-sahasranamam-classes",
    category: "Teaching",
    name: "sri_vishnu_sahasranamam_classes_name",
    description: "sri_vishnu_sahasranamam_desc",
    price: "Contact for details",
    detailedHtml: "sri_vishnu_sahasranamam_classes_detail",
    icon: "BookOpenCheck",
    image: "service-jadhagam-analysis",
  },
];

export const allPosts: Post[] = [
  {
    id: "post-1",
    title: "The Significance of Diwali",
    content:
      "An article about the spiritual meaning of the festival of lights...",
    imageUrl: "post-1",
    timestamp: new Date(),
    tags: ["festival", "diwali", "spirituality"],
  },
  {
    id: "post-2",
    title: "Understanding Your Zodiac Sign",
    content:
      "A deep dive into how your zodiac sign influences your personality...",
    imageUrl: "post-2",
    timestamp: new Date(new Date().setDate(new Date().getDate() - 5)),
    tags: ["astrology", "zodiac", "jyotisham"],
  },
  {
    id: "post-3",
    title: "The Power of Mantras",
    content:
      "<h3>Sound and Consciousness</h3><p>A mantra is a sacred utterance, a syllable, word, or phonemes, believed by practitioners to have psychological and spiritual powers. The repetition of a mantra, known as Japa, is a common practice in many spiritual traditions.</p><p>The Gayatri Mantra, for instance, is one of the oldest and most powerful of Sanskrit mantras. It is a prayer to the Sun deity for the illumination of the intellect.</p>",
    imageUrl: "post-3",
    timestamp: new Date("2023-09-15T09:00:00Z"),
    tags: ["mantra", "meditation", "spirituality"],
  },
  {
    id: "post-4",
    title: "Vastu Shastra for a Harmonious Home",
    content:
      "<h3>The Science of Architecture</h3><p>Vastu Shastra is a traditional Indian system of architecture based on ancient texts that describe principles of design, layout, measurements, ground preparation, space arrangement, and spatial geometry. The designs are intended to integrate architecture with nature, the relative functions of various parts of the structure, and ancient beliefs utilizing geometric patterns (yantra), symmetry, and directional alignments.</p><p>For a peaceful home, Vastu suggests that the entrance should ideally face east or north, and the kitchen should be in the southeast corner.</p>",
    imageUrl: "post-4",
    timestamp: new Date("2023-08-01T11:00:00Z"),
    tags: ["vastu", "home", "wellness"],
  },
];

export const latestPosts = allPosts.slice(0, 2);

export const latestVideos: Video[] = [
  {
    id: "vid-1",
    youtubeUrl: "https://www.youtube.com/watch?v=LXb3EKWsInQ", // Example: "lofi girl"
    title: "Daily Chants for Positive Energy",
    type: "video",
    timestamp: new Date(),
  },
  {
    id: "vid-2",
    youtubeUrl: "https://www.youtube.com/shorts/3n7dptK1jF4", // Example: "satisfying short"
    title: "Quick Tip: Vastu for Home Office",
    type: "short",
    timestamp: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
];
