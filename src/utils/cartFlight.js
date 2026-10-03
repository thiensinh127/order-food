export const getCartFlightKeyframes = (sourceRect, targetRect) => {
  const x = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2);
  const y = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2);

  return [
    { transform: "translate(0, 0) scale(1)", opacity: 1 },
    { transform: `translate(${x}px, ${y}px) scale(0.25)`, opacity: 0.2 },
  ];
};

export const animateProductToCart = (image, cart) => {
  if (!image || !cart || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return;
  }

  const sourceRect = image.getBoundingClientRect();
  const clone = image.cloneNode(true);

  Object.assign(clone.style, {
    position: "fixed",
    left: `${sourceRect.left}px`,
    top: `${sourceRect.top}px`,
    width: `${sourceRect.width}px`,
    height: `${sourceRect.height}px`,
    margin: "0",
    zIndex: "10000",
    pointerEvents: "none",
    borderRadius: "14px",
    objectFit: "cover",
  });

  document.body.appendChild(clone);
  const animation = clone.animate(getCartFlightKeyframes(sourceRect, cart.getBoundingClientRect()), {
    duration: 650,
    easing: "cubic-bezier(.2, .8, .2, 1)",
    fill: "forwards",
  });

  animation.finished.catch(() => {}).finally(() => clone.remove());
};
