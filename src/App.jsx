import Dock from "./components/Dock";
import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import LockScreen from "./components/LockScreen";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";
import { Contact, Finder, ImageFile, NetworkError, Resume, Safari, Terminal, Text } from "./windows";
import Home from "./components/Home";
import useNetworkStore from "./store/network";
import useUiStore from "./store/ui";

gsap.registerPlugin(Draggable);

const App = () => {
  const { isOnline } = useNetworkStore();
  const locked = useUiStore((s) => s.locked);

  return (
    <main>
      <Navbar />
      <Welcome />
      <Dock />
      <Terminal />
      <Safari />
      <Resume />
      <ImageFile />
      <Text />
      <Finder />
      <Contact />
      <Home />
      {!isOnline && <NetworkError />}
      {locked && <LockScreen />}
    </main>
  );
};

export default App;
