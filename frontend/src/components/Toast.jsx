import { useEffect } from 'react'

const Toast = ({ message, isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, onClose, duration]);

  if (!isVisible) return null;

  return (
    <div className={`fixed left-1/2 -translate-x-1/2 bg-[linear-gradient(135deg,#28a745_0%,#20c997_100%)] text-white px-8 py-4 max-sm:px-6 max-sm:py-3.5 rounded-xl shadow-[0_8px_24px_rgba(0,0,0,0.2)] z-10000 flex items-center gap-3 min-w-75 max-sm:min-w-70 max-w-125 max-sm:max-w-[calc(100%-2rem)] transition-[top] duration-400 ease-[cubic-bezier(0.68,-0.55,0.265,1.55)] font-medium ${isVisible ? 'top-8' : '-top-25'}`}>
      <div className="flex items-center gap-3 w-full">
        <span className="bg-white text-[#28a745] w-7 h-7 rounded-full flex items-center justify-center font-bold text-lg shrink-0">✓</span>
        <span className="flex-1 text-[15px] max-sm:text-sm leading-[1.4]">{message}</span>
      </div>
    </div>
  );
};

export default Toast;
