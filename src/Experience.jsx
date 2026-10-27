import App from "./App";
import useBootStore from "./store/boot";
import Bedroom from "./components/bedroom/Bedroom";
import BootScreen from "./components/BootScreen";

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
