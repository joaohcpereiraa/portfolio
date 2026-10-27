import { useEffect, useRef } from "react";

const SIZE = 16; // sprite resolution: every logo becomes a 16×16 pixel sprite

// Draws a tech logo into a tiny canvas so CSS can blow it up with hard pixel
// edges. Alpha is snapped to on/off and very dark pixels are lifted to the
// screen's ink colour, so black logos (Next.js, GitHub…) stay visible on the
// dark LCD.
const PixelIcon = ({ src, className = "" }) => {
  const ref = useRef(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;
    let cancelled = false;
    const img = new Image();
    img.onload = () => {
      if (cancelled) return;
      ctx.clearRect(0, 0, SIZE, SIZE);
      ctx.drawImage(img, 1, 1, SIZE - 2, SIZE - 2);
      const data = ctx.getImageData(0, 0, SIZE, SIZE);
      const px = data.data;
      for (let i = 0; i < px.length; i += 4) {
        if (px[i + 3] < 110) {
          px[i + 3] = 0;
          continue;
        }
        px[i + 3] = 255;
        if (px[i] + px[i + 1] + px[i + 2] < 120) {
          px[i] = 232;
          px[i + 1] = 228;
          px[i + 2] = 255;
        }
      }
      ctx.putImageData(data, 0, 0);
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);

  return <canvas ref={ref} width={SIZE} height={SIZE} className={`pixel-icon ${className}`} aria-hidden="true" />;
};

export default PixelIcon;
