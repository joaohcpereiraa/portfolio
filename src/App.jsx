import Dock from "./components/Dock";
import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import gsap from "gsap";
import { Draggable } from "gsap/draggable";
import { Finder, ImageFile, Resume, Safari, Terminal, Text } from "./windows";

gsap.registerPlugin(Draggable);

const App = () => {
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
    </main>
  );
};

export default App;
