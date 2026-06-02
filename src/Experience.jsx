import App from "./App";
import useBootStore from "./store/boot";
import Landing from "./components/landing/Landing";
import BootScreen from "./components/BootScreen";

const Experience = () => {
  const phase = useBootStore((s) => s.phase);
  const skip = useBootStore((s) => s.skip);

  return (
    <>
      {(phase === "landing" || phase === "entering") && <Landing />}
      {phase === "booting" && <BootScreen />}
      {phase === "desktop" && <App />}

      {phase !== "desktop" && phase !== "booting" && (
        <button type="button" className="skip-intro" onClick={skip}>
          Skip intro
        </button>
      )}
    </>
  );
};

export default Experience;
