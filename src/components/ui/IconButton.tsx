import type { PropsWithChildren } from 'react';

interface IconButtonProps extends PropsWithChildren {
  label: string;
  onClick: () => void;
}

export function IconButton({ children, label, onClick }: IconButtonProps) {
  return (
    <button
      type="button"
      className="icon-button"
      aria-label={label}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
