interface OpeningSceneProps {
  onOpen: () => void;
  exiting?: boolean;
}

export function OpeningScene({
  onOpen,
  exiting = false,
}: OpeningSceneProps) {
  return (
    <section
      className={`opening-scene ${exiting ? 'is-exiting' : ''}`}
      aria-label="Opening card"
    >
      <div className="opening-scene__halo" aria-hidden="true" />
      <div className="opening-scene__panel">
        <p className="opening-scene__for-you">For You</p>
        <button
          type="button"
          className="opening-scene__button"
          onClick={onOpen}
          aria-label="Open the birthday gift"
        >
          <span className="opening-scene__button-core">Open</span>
        </button>
        <p className="opening-scene__note">送给最好的妳</p>
      </div>
    </section>
  );
}
