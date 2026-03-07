import WindowControlls from "../components/WindowControlls";
import WindowWrapper from "../hoc/WindowWrapper";
import useWindowStore from "../store/window";

const ImageFile = () => {
  const imageData = useWindowStore((state) => state.windows.imgfile.data);

  if (!imageData) return null;

  const { name } = imageData;
  const image = imageData.image || imageData.imageUrl || imageData.href;

  if (!image) return null;

  return (
    <>
      <div id="window-header">
        <WindowControlls target="imgfile" />
        <p>{name}</p>
      </div>

      <div className="preview">
        <img src={image} alt={name} />
      </div>
    </>
  );
};

const ImageFileWindow = WindowWrapper(ImageFile, "imgfile");

export default ImageFileWindow;