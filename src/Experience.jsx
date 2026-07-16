import App from "./App";
import useBootStore from "./store/boot";
import Landing from "./components/landing/Landing";
import BootScreen from "./components/BootScreen";

const Experience = () => {
  const phase = useBootStore((s) => s.phase);

  return (
    <>
      {(phase === "landing" || phase === "entering") && <Landing />}
      {phase === "booting" && <BootScreen />}
      {phase === "desktop" && <App />}
    </>
  );
};

export default Experience;
