interface AlbumBackButtonProps {
  onClick: () => void;
}

export function AlbumBackButton({ onClick }: AlbumBackButtonProps) {
  return (
    <button
      type="button"
      className="album-back-button"
      aria-label="Back to birthday cake"
      onClick={onClick}
    >
      <span className="album-back-button__icon" aria-hidden="true">
        {'<'}
      </span>
      <span className="album-back-button__label">Cake</span>
    </button>
  );
}
