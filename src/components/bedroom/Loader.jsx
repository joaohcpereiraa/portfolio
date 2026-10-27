import { useProgress } from "@react-three/drei";

// Full-screen loading bar while the room's models and textures download.
// Fades out (CSS) once everything is in.
const Loader = () => {
  const { active, progress } = useProgress();
  const done = !active && progress >= 100;

  return (
    <div className={`bedroom-loader ${done ? "done" : ""}`} aria-hidden={done}>
      <p>Turning on the lights…</p>
      <div className="bedroom-loader-bar">
        <span style={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

export default Loader;
