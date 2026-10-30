import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { renderText, setupTextHover } from "#shared/utils/textHover";

const FONT_WEIGHTS = {
  subtitle: { min: 100, max: 400, default: 100 },
  title: { min: 400, max: 900, default: 400 },
};

const Welcome = () => {
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);

  useGSAP(() => {
    const titleCleanup = setupTextHover(titleRef.current, FONT_WEIGHTS.title);
    const subtitleCleanup = setupTextHover(subtitleRef.current, FONT_WEIGHTS.subtitle);

    return () => {
      subtitleCleanup();
      titleCleanup();
    };
  }, []);

  return (
    <section id="welcome">
      <p ref={subtitleRef}>
        {" "}
        {renderText(
          "Hey, I'm João! Welcome to my",
          "text-3xl font-georama",
          100,
        )}
      </p>
      <h1 ref={titleRef} className="mt-7">
        {renderText("Portfolio", "text-9xl italic font-georama")}
      </h1>

      <div className="small-screen">
        <p> This portfolio is designed for desktop/tablet screens only.</p>
      </div>
    </section>
  );
};

export default Welcome;
