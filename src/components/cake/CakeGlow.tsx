export function CakeGlow() {
  return (
    <div className="cake-glow" aria-hidden="true">
      <span className="cake-glow__halo cake-glow__halo--ambient" />
      <span className="cake-glow__halo cake-glow__halo--outer" />
      <span className="cake-glow__halo cake-glow__halo--inner" />
      <span className="cake-glow__ring" />
    </div>
  );
}
