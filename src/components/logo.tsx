import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className }: { className?: string }) {
  return (
    <Image
      src="/logo.png"
      alt="Gururbrahma Services Logo"
      width={32}
      height={32}
      className={cn('rounded-full', className)}
    />
  );
}
