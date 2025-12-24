import Image from 'next/image';
import { cn } from '@/lib/utils';

export function Logo({ className, size = 32 }: { className?: string, size?: number }) {
  return (
    <Image
      src="/logo.png"
      alt="Gururbrahma Services Logo"
      width={size}
      height={size}
      className={cn('rounded-full object-contain', className)}
    />
  );
}
