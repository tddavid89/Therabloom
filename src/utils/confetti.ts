import confetti from 'canvas-confetti';

export function fireCelebration() {
  // Gentle therapeutic celebration colors: sage, rose gold, soft emerald, cream
  const colors = ['#2D5A43', '#C86D51', '#4B7B94', '#9C6644', '#E8C547', '#5B8E7D'];

  confetti({
    particleCount: 50,
    spread: 60,
    origin: { y: 0.8 },
    colors,
    disableForReducedMotion: true,
  });
}

export function fireLevelUpCelebration() {
  const duration = 2 * 1000;
  const animationEnd = Date.now() + duration;
  const colors = ['#2D5A43', '#4E8163', '#8CB369', '#F4A261', '#E76F51'];

  const frame = () => {
    confetti({
      particleCount: 3,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors,
    });
    confetti({
      particleCount: 3,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors,
    });

    if (Date.now() < animationEnd) {
      requestAnimationFrame(frame);
    }
  };
  frame();
}
