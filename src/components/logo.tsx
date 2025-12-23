import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="https://placehold.co/64x64/FBBF24/854D0E?text=L"
      alt="Gururbrahma Services Logo"
      width={32}
      height={32}
      className={cn('rounded-full', className)}
    />
  );
}
