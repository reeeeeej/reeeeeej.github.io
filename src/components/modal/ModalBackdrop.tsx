interface ModalBackdropProps {
  onClick: () => void;
}

export function ModalBackdrop({ onClick }: ModalBackdropProps) {
  return <button type="button" className="modal-backdrop" onClick={onClick} />;
}
