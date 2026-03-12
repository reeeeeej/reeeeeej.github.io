export function buildPlaceholderCover(index: number, tone: string) {
  const tones: Record<string, { top: string; bottom: string; accent: string }> =
    {
      rose: { top: '#ffbadf', bottom: '#ff7fb8', accent: '#fff7fb' },
      violet: { top: '#d7c0ff', bottom: '#a97cf7', accent: '#f8f2ff' },
      pearl: { top: '#ffeccc', bottom: '#ffc88a', accent: '#fffdf8' },
    };

  const palette = tones[tone] ?? tones.rose;
  const label = `Card ${String(index).padStart(2, '0')}`;

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="480" height="560" viewBox="0 0 480 560">
      <defs>
        <linearGradient id="card-gradient" x1="0" y1="0" x2="0" y2="1">
          <stop stop-color="${palette.top}" />
          <stop offset="1" stop-color="${palette.bottom}" />
        </linearGradient>
      </defs>
      <rect width="480" height="560" rx="4" fill="url(#card-gradient)" />
      <circle cx="92" cy="92" r="46" fill="${palette.accent}" fill-opacity="0.34" />
      <circle cx="390" cy="138" r="56" fill="#ffffff" fill-opacity="0.18" />
      <path d="M110 390C160 310 320 298 370 390C330 460 145 470 110 390Z" fill="#ffffff" fill-opacity="0.14" />
      <text x="50%" y="46%" dominant-baseline="middle" text-anchor="middle" fill="${palette.accent}" font-size="42" font-family="Segoe UI, Arial, sans-serif" letter-spacing="4">${label}</text>
      <text x="50%" y="54%" dominant-baseline="middle" text-anchor="middle" fill="${palette.accent}" fill-opacity="0.82" font-size="20" font-family="Segoe UI, Arial, sans-serif">Placeholder Cover</text>
    </svg>
  `.trim();

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
