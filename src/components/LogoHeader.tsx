interface LogoHeaderProps {
  onClick?: () => void;
}

export default function LogoHeader({ onClick }: LogoHeaderProps) {
  return (
    <header className="logo-header" aria-label="Site logo">
      <div
        className="logo-placeholder"
        onClick={onClick}
        style={{ cursor: onClick ? 'pointer' : 'default' }}
        role={onClick ? 'button' : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick() : undefined}
        aria-label={onClick ? 'Go to home' : undefined}
      >
        {/* 
          TO ADD YOUR LOGO:
          1. Drop your logo file into /public/images/logo.png (or .svg, .jpg)
          2. Replace the <span> below with:
             <img src="/images/logo.png" alt="Your Logo" style={{ maxHeight: '44px', width: 'auto' }} />
          The logo should ideally be white or transparent for best contrast.
        */}
        <span className="logo-text-fallback">Your Logo Here</span>
      </div>
    </header>
  );
}
