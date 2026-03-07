import clsx from "clsx";
import { locations } from "../constants";
import { useGSAP } from "@gsap/react";
import { Draggable } from "gsap/draggable";
import useWindowStore from "../store/window";
import useLocationStore from "../store/location";
import { assetUrl } from "../utils/assetUrl";

const projects = locations.work?.children ?? [];

const Home = () => {
  const { setActiveLocation } = useLocationStore();
  const { openWindow } = useWindowStore();

  const handleOpenProjectFinder = (project) => {
    setActiveLocation(project);
    openWindow("finder");
  };

  useGSAP(() => {
    Draggable.create(".folder");
  }, []);

  return (
    <section id="home">
      <ul>
        {projects.map((project) => (
          <li
            key={project.id}
            className={clsx("group folder", project.windowPosition)}
            onClick={() => handleOpenProjectFinder(project)}
          >
            <img src={assetUrl("/images/folder.png")} alt={project.name} />
            <p>{project.name}</p>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default Home;
