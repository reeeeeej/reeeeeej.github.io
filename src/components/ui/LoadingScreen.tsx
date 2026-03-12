interface LoadingScreenProps {
  title: string;
}

export function LoadingScreen({ title }: LoadingScreenProps) {
  return (
    <section className="loading-screen" aria-live="polite">
      <div className="loading-screen__core" />
      <p className="loading-screen__title">{title}</p>
      <p className="loading-screen__subtitle">Preparing the opening scene...</p>
    </section>
  );
}
