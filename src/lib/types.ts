import type React from "react";

export type ServiceCategory = "Purohitam" | "Jyotisham" | "Matrimony";

export type Service = {
  id: string;
  category: ServiceCategory;
  name: string;
  description: string;
  price: string;
  detailedHtml: string;
  // store icon as a string key (resolved client-side) to avoid passing functions
  icon: string;
  image: string;
};

export type Post = {
  id: string;
  title: string;
  content: string;
  imageUrl: string;
  timestamp: Date;
  tags: string[];
};

export type Video = {
  id: string;
  youtubeUrl: string;
  title: string;
  type: "short" | "video";
  timestamp: Date;
};
