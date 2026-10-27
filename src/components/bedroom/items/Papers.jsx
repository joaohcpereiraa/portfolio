import { useEffect, useState } from "react";
import * as THREE from "three";
import { Html } from "@react-three/drei";
import { pdfjs } from "react-pdf";
import useBedroomStore from "#store/bedroom";
import { assetUrl } from "../../../utils/assetUrl";

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url,
).toString();

const CV_URL = assetUrl("/files/resumee.pdf");
const RENDER_HEIGHT = 1400; // px; enough to read the headings up close

// A small stack of printed CV pages on the desk, with a pen.
const PAGES = [
  { y: 0.002, rot: 0.12 },
  { y: 0.004, rot: -0.06 },
  { y: 0.006, rot: 0 },
];

// Renders the CV's first page into a texture for the top sheet. Null while
// loading, or if the PDF can't be read (the sheet then shows placeholder lines).
const useCvTexture = () => {
  const [texture, setTexture] = useState(null);

  useEffect(() => {
    let cancelled = false;
    let made = null;
    const task = pdfjs.getDocument(CV_URL);

    (async () => {
      try {
        const pdf = await task.promise;
        const page = await pdf.getPage(1);
        const base = page.getViewport({ scale: 1 });
        const viewport = page.getViewport({ scale: RENDER_HEIGHT / base.height });
        const canvas = document.createElement("canvas");
        canvas.width = Math.round(viewport.width);
        canvas.height = Math.round(viewport.height);
        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#fff";
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        await page.render({ canvasContext: ctx, canvas, viewport }).promise;
        if (cancelled) return;
        made = new THREE.CanvasTexture(canvas);
        made.colorSpace = THREE.SRGBColorSpace;
        made.anisotropy = 8;
        setTexture(made);
      } catch {
        // Keep the placeholder lines.
      }
    })();

    return () => {
      cancelled = true;
      task.destroy();
      made?.dispose();
    };
  }, []);

  return texture;
};

const PlaceholderLines = () => (
  <>
    <mesh position={[0, 0.0072, -0.115]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[0.17, 0.03]} />
      <meshBasicMaterial color="#3b82f6" />
    </mesh>
    {Array.from({ length: 9 }, (_, i) => (
      <mesh key={i} position={[-0.01 * (i % 3), 0.0072, -0.07 + i * 0.022]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[i % 3 === 0 ? 0.15 : 0.12, 0.006]} />
        <meshBasicMaterial color="#9a96b0" />
      </mesh>
    ))}
  </>
);

// With the desk in view, clicking the papers picks the CV up (it opens in
// front of the visitor and its sheet leaves the stack). Before that, the
// click bubbles to the Clickable, which flies to the desk.
const handleClick = (e) => {
  const { focused, setNoteIndex } = useBedroomStore.getState();
  if (focused !== "cv" || e.delta > 6) return;
  e.stopPropagation();
  setNoteIndex(0);
};

const Papers = () => {
  const cv = useCvTexture();
  const atDesk = useBedroomStore((s) => s.focused === "cv");
  const pickedUp = useBedroomStore((s) => s.focused === "cv" && s.noteIndex !== null);

  return (
    <group onClick={handleClick}>
      {PAGES.map(({ y, rot }, i) => (
        <mesh key={y} position={[0, y, 0]} rotation={[0, rot, 0]} visible={!(pickedUp && i === PAGES.length - 1)}>
          <boxGeometry args={[0.21, 0.002, 0.297]} />
          <meshStandardMaterial color="#f1effa" roughness={0.9} />
        </mesh>
      ))}

      {/* Top sheet: the actual CV, first page (gone while it's picked up) */}
      {pickedUp ? null : cv ? (
        <mesh position={[0, 0.0071, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[0.21, 0.297]} />
          <meshStandardMaterial map={cv} roughness={0.9} />
        </mesh>
      ) : (
        <PlaceholderLines />
      )}

      {/* At the desk, a floating hint points at the CV until it's picked up. */}
      {atDesk && !pickedUp && (
        <Html position={[0, 0.07, 0]} center style={{ pointerEvents: "none" }}>
          <div className="bedroom-label cv-pickup-hint">Click to pick up</div>
        </Html>
      )}

      {/* Pen */}
      <mesh position={[0.14, 0.008, 0.02]} rotation={[0, 0.5, Math.PI / 2]}>
        <cylinderGeometry args={[0.005, 0.005, 0.14, 8]} />
        <meshStandardMaterial color="#1f1b33" roughness={0.4} />
      </mesh>
    </group>
  );
};

export default Papers;
