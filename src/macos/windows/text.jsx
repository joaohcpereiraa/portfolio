import WindowControlls from "../components/WindowControlls";
import WindowWrapper from "../hoc/WindowWrapper";
import useWindowStore from "../store/window";

const Text = () => {
  const textData = useWindowStore((state) => state.windows.txtfile.data);

  if (!textData) return null;

  const { name, subtitle, description } = textData;
  const image = textData.image || textData.imageUrl;
  const paragraphs = Array.isArray(description) ? description : [];

  return (
    <>
      <div id="window-header">
        <WindowControlls target="txtfile" />
        <h2>{name}</h2>
      </div>

      <div className="p-5 space-y-4 bg-white dark:bg-gray-900 text-sm text-gray-700 dark:text-gray-300">
        {image && (
          <img
            src={image}
            alt={name}
            className="w-full h-72 object-fill object-center rounded-lg"
          />
        )}

        {subtitle && <p className="font-semibold text-gray-900 dark:text-gray-100">{subtitle}</p>}

        {paragraphs.map((paragraph, index) => (
          <p key={`${name}-paragraph-${index}`}>{paragraph}</p>
        ))}
      </div>
    </>
  );
};

const TextWindow = WindowWrapper(Text, "txtfile");

export default TextWindow;