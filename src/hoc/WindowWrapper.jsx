import { useGSAP } from "@gsap/react";
import useWindowStore from "../store/window";
import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Draggable } from "gsap/Draggable";

const WindowWrapper = (Component, windowKey) => {
  const Wrapped = (props) => {
    const { focusWindow, windows } = useWindowStore();
    const { isOpen, zIndex } = windows[windowKey];
    const ref = useRef(null);

    useGSAP(() => {
      const el = ref.current;
      if (!el || !isOpen) return () => {};
      el.style.display = "block";

      gsap.fromTo(
        el,
        { opacity: 0, scale: 0.8, y: 40 },
        {
          scale: 1,
          opacity: 1,
          y: 0,
          duration: 0.4,
          ease: "power3.out",
        },
      );
    }, [isOpen]);

    useGSAP(() => {
      const el = ref.current;
      if (!el) return () => {};
      const [instance] = Draggable.create(el, {
        onPress: () => focusWindow(windowKey),
      });

      return () => {
        if (instance) instance.kill();
      };
    }, []);

    useLayoutEffect(() => {
      const el = ref.current;
      if (!el) return;
      el.style.display = isOpen ? "block" : "none";
    }, [isOpen]);

    return (
      <section id={windowKey} ref={ref} style={{ zIndex }} className="absolute">
        <Component {...props} />
      </section>
    );
  };

  Wrapped.displayName = `WindowWrapper(${Component.displayName || Component.name || "Component"})`;
  return Wrapped;
};

export default WindowWrapper;
