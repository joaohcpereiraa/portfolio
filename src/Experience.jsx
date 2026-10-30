import App from "./macos/App";
import useBootStore from "./shared/store/boot";
import Bedroom from "./bedroom/Bedroom";
import BootScreen from "./macos/BootScreen";

const Experience = () => {
  const phase = useBootStore((s) => s.phase);

  return (
    <>
      {(phase === "landing" || phase === "entering") && <Bedroom />}
      {phase === "booting" && <BootScreen />}
      {phase === "desktop" && <App />}
    </>
  );
};

export default Experience;
