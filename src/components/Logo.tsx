import logoImage from '@/assets/logo.png';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const Logo = ({ className = "", showText = true, size = 'md' }: LogoProps) => {
  const sizes = {
    sm: { logo: 'h-16', text: 'text-lg' },
    md: { logo: 'h-24', text: 'text-2xl' },
    lg: { logo: 'h-32', text: 'text-3xl' },
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Image */}
      <div className="relative">
        <img 
          src={logoImage} 
          alt="Klinik Sehat Logo" 
          className={`${currentSize.logo} w-auto object-contain drop-shadow-2xl`}
          style={{
            filter: 'brightness(1.1) contrast(1.2) saturate(1.3)',
          }}
        />
      </div>

      {/* Text */}
      {showText && (
        <div className="flex flex-col leading-tight">
          <span className={`${currentSize.text} font-bold bg-gradient-primary bg-clip-text text-transparent drop-shadow-sm`}>
            Klinik Sehat
          </span>
        </div>
      )}
    </div>
  );
};

export default Logo;
