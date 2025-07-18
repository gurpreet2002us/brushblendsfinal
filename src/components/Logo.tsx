import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'dark' | 'light';
}

export default function Logo({ className = '', showText = true, size = 'md', variant = 'dark' }: LogoProps) {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-12'
  };

  const logoSrc = variant === 'light' ? '/brushnblends-logo-white.png' : '/brushnblends-logo.png';

  return (
    <div className={`flex items-center ${className}`}>
      <img
        src={logoSrc}
        alt="Brush n Blends"
         className="w-[120px] h-auto"
      />
    </div>
  );
}