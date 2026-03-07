import { navLinks } from "#constants";
import { navIcons } from "#constants";
import { locations } from "#constants";
import useWindowStore from "#store/window";
import dayjs from "dayjs";
import { assetUrl } from "../utils/assetUrl";


const Navbar = () => {
   const { openWindow } = useWindowStore();

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
        <img src={assetUrl("/images/logo.svg")} alt="Logo" />
        <p className="font-bold">João's Portfolio</p>

        <ul>
          {navLinks.map(({ id, name, type }) => (
            <li key={id} onClick={() => handleOpenWindow(type)}>
              <p>{name}</p>
            </li>
          ))}
        </ul>
      </div>

      <div>
        <ul>
          {navIcons.map(({ id, img }) => (
            <li key={id}>
              <img src={img} className="icon-hover" alt={`icon-${id}`} />
            </li>
          ))}
        </ul>

        <time>{dayjs().format("ddd, MMM D h:mm A")}</time>
      </div>

    </nav>
  );
};

export default Navbar;
