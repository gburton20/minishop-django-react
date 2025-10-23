export function Logo({ size = 'md', showText = true, className = '' }) {
  const sizes = {
    sm: { container: 'h-8', icon: 24, text: 'text-xl' },
    md: { container: 'h-12', icon: 32, text: 'text-3xl' },
    lg: { container: 'h-16', icon: 48, text: 'text-4xl' }
  };

  const currentSize = sizes[size];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <svg
        width={currentSize.icon}
        height={currentSize.icon}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        {/* Shopping bag background */}
        <rect
          x="10"
          y="14"
          width="28"
          height="30"
          rx="6"
          fill="#05abf3"
        />
        
        {/* Bag handle */}
        <path
          d="M18 14V12C18 8.68629 20.6863 6 24 6C27.3137 6 30 8.68629 30 12V14"
          stroke="#05abf3"
          strokeWidth="3"
          strokeLinecap="round"
        />
        
        {/* Mini accent - small circle */}
        <circle
          cx="24"
          cy="26"
          r="4"
          fill="white"
        />
        
        {/* Mini accent - small dot inside */}
        <circle
          cx="24"
          cy="26"
          r="1.5"
          fill="#05abf3"
        />
      </svg>
      
      {showText && (
        <span className={`${currentSize.text} tracking-tight rounded-full`} style={{ fontFamily: 'system-ui, Avenir, Helvetica, Arial, sans-serif', fontVariationSettings: '"wght" 600' }}>
          <span style={{ color: '#05abf3' }}>Mini</span>
          <span className="text-gray-900">shop</span>
        </span>
      )}
    </div>
  );
}