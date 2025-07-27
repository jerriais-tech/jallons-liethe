import { useCallback, useRef } from "react";

export function useClickableCard<T extends HTMLElement = HTMLAnchorElement>() {
  const linkRef = useRef<T>(null);

  const handleCardClick = useCallback(() => {
    const isTextSelected = window.getSelection()?.toString();
    if (!isTextSelected) {
      linkRef.current?.click();
    }
  }, []);

  const stopPropagation = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      event.stopPropagation();
    },
    []
  );

  return [linkRef, handleCardClick, stopPropagation] as const;
}
