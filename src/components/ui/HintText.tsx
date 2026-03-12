import type { PropsWithChildren } from 'react';

export function HintText({ children }: PropsWithChildren) {
  return <p className="hint-text">{children}</p>;
}
