import { useProgress } from "@react-three/drei";

// Full-screen loading screen while the room's models and textures download: a
// line of text, a thin progress bar and the percentage. Fades out (CSS) once
// everything is in.
const Loader = () => {
  const { active, progress } = useProgress();
  const done = !active && progress >= 100;

  return (
    <div className={`bedroom-loader ${done ? "done" : ""}`} aria-hidden={done}>
      <p>Turning on the lights</p>
      <div className="bedroom-loader-bar">
        <span style={{ width: `${progress}%` }} />
      </div>
      <p className="bedroom-loader-pct">{Math.round(progress)}%</p>
    </div>
  );
};

export default Loader;
