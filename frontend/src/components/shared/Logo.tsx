import type { ClassValue } from 'class-variance-authority/types';
import { Shield } from 'lucide-react';
import { cn } from '@/utils';
import { Link } from 'react-router-dom';

const Logo = ({className, color = "text-white"}: {className?: ClassValue, color?: string}) => {
  return (
    <Link to="/" title="Paylink" className={cn("flex items-center gap-3", className && className)}>
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600">
        <Shield className="h-5 w-5 text-white" />
      </div>
      <span className={cn("font-display text-xl font-bold", color && color)}>PayLink</span>
    </Link>
  );
}

export default Logo