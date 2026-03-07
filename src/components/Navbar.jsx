import { navLinks } from "#constants";
import { navIcons } from "#constants";
import { locations } from "#constants";
import useWindowStore from "#store/window";
import { useState, useRef } from "react";
import dayjs from "dayjs";
import { assetUrl } from "../utils/assetUrl";
import ControlCenter from "./ControlCenter";


const Navbar = () => {
   const { openWindow } = useWindowStore();
   const [ccOpen, setCcOpen] = useState(false);
   const ccTriggerRef = useRef(null);

   const handleOpenWindow = (type) => {
    if (type === "about-me") {
      const aboutTextFile = locations.about.children.find(
        (item) => item.name === "about-me.txt" && item.fileType === "txt",
      );
      if (aboutTextFile) return openWindow("txtfile", aboutTextFile);
      return;
    }

    openWindow(type);
   };

  return (
    <nav>
      <div>
        <img src={assetUrl("/images/logo.svg")} alt="Logo" className="nav-icon" />
        <p className="font-bold">João's Portfolio</p>

        <ul>
          {navLinks.map(({ id, name, type }) => (
            <li key={id} onClick={() => handleOpenWindow(type)}>
              <p>{name}</p>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative">
        <ul>
          {navIcons.map(({ id, img }) => (
            <li
              key={id}
              ref={id === 4 ? ccTriggerRef : undefined}
              onClick={id === 4 ? () => setCcOpen((o) => !o) : undefined}
              className={id === 4 ? `cursor-pointer rounded px-1 py-0.5 transition-colors ${ccOpen ? "bg-black/10 dark:bg-white/20" : ""}` : ""}
              title={id === 4 ? "Control Centre" : undefined}
            >
              <img src={img} className="icon-hover nav-icon" alt={`icon-${id}`} />
            </li>
          ))}
        </ul>

        <time>{dayjs().format("ddd, MMM D h:mm A")}</time>

        {ccOpen && <ControlCenter onClose={() => setCcOpen(false)} triggerRef={ccTriggerRef} />}
      </div>

    </nav>
  );
};

export default Navbar;
