"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import type { Service } from "@/lib/types";

interface ServiceCardProps {
  service: Service;
}

export function ServiceCard({ service }: ServiceCardProps) {
  // Resolve icon component client-side from a string key to avoid passing functions
  const Icon = (Icons as any)[service.icon] ?? Icons.Home;

  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: "0px 10px 20px rgba(0,0,0,0.1)" }}
      className="h-full"
    >
      <Card className="flex flex-col h-full text-center bg-card/80 backdrop-blur-sm border-primary/10 shadow-lg transition-all duration-300 hover:border-primary/30">
        <CardHeader className="items-center">
          <div className="bg-primary/10 p-4 rounded-full text-primary">
            <Icon className="w-8 h-8" />
          </div>
          <CardTitle className="mt-4">{service.name}</CardTitle>
        </CardHeader>
        <CardContent className="flex-grow">
          <CardDescription>{service.description}</CardDescription>
        </CardContent>
        <CardFooter className="justify-center">
          <Button asChild variant="secondary">
            <Link href={`/services/${service.id}`}>
              Learn More <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
