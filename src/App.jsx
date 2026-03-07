import Dock from "./components/Dock";
import Navbar from "./components/Navbar";
import Welcome from "./components/Welcome";
import gsap from "gsap";
import { Draggable } from "gsap/draggable";
import { Contact, Finder, ImageFile, Resume, Safari, Terminal, Text } from "./windows";
import Home from "./components/Home";

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
      <Contact />
      <Home />
    </main>
  );
};

export default App;
