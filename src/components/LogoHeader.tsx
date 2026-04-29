interface LogoHeaderProps {
  onClick?: () => void;
  darkMode?: boolean; // true = black logo (for white backgrounds like mobile art section)
}

export default function LogoHeader({ onClick, darkMode = false }: LogoHeaderProps) {
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
        <img
          src={darkMode ? '/images/logo-black.png' : '/images/logo-white.png'}
          alt="Dominique Schleider"
          style={{ maxHeight: '44px', width: 'auto' }}
        />
      </div>
    </header>
  );
}
