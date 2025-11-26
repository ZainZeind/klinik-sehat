interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className = "", showText = true, size = 'md' }: LogoProps) => {
  const sizes = {
    sm: { container: 'w-8 h-8', text: 'text-lg', textContainer: 'text-base' },
    md: { container: 'w-10 h-10', text: 'text-xl', textContainer: 'text-xl' },
    lg: { container: 'w-14 h-14', text: 'text-2xl', textContainer: 'text-2xl' },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {/* Logo Icon */}
      <div className={`${currentSize.container} bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-xl flex items-center justify-center shadow-lg relative overflow-hidden group`}>
        {/* Animated background glow */}
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400/50 to-cyan-400/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {/* Medical Cross with Heart */}
        <svg
          className={`relative z-10 ${size === 'sm' ? 'w-5 h-5' : size === 'md' ? 'w-6 h-6' : 'w-8 h-8'}`}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cross */}
          <path
            d="M12 2V22M2 12H22"
            stroke="white"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Heart overlay */}
          <path
            d="M12 8C10.5 6.5 8 7 8 9C8 11 12 14 12 14C12 14 16 11 16 9C16 7 13.5 6.5 12 8Z"
            fill="white"
            opacity="0.9"
          />
        </svg>
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`${currentSize.textContainer} font-bold bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent`}>
            Klinik Sehat
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
