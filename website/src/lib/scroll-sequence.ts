export function sequenceFrame(progress: number, count: number) {
  if (count < 1 || !Number.isFinite(count)) return 0;
  return Math.round(Math.min(1, Math.max(0, Number.isFinite(progress) ? progress : 0)) * (count - 1));
}

export function sequenceProgress(position: number, start: number, end: number) {
  if (end <= start) return 0;
  return Math.min(1, Math.max(0, (position - start) / (end - start)));
}

export function containedFrame(width: number, height: number, frameWidth: number, frameHeight: number) {
  const scale = Math.min(width / frameWidth, height / frameHeight);
  const w = frameWidth * scale;
  const h = frameHeight * scale;
  return { x: (width - w) / 2, y: (height - h) / 2, width: w, height: h };
}

export function coveredFrame(width: number, height: number, frameWidth: number, frameHeight: number) {
  const scale = Math.max(width / frameWidth, height / frameHeight);
  const w = frameWidth * scale;
  const h = frameHeight * scale;
  // Right-weighted composition keeps the owner visible beside the text.
  return { x: (width - w) * .65, y: (height - h) / 2, width: w, height: h };
}
