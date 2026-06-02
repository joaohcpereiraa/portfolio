import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import useBootStore from "../store/boot";
import { assetUrl } from "../utils/assetUrl";

const BOOT_DURATION = 2.6; // seconds, fixed timed fill

const BootScreen = () => {
  const rootRef = useRef(null);
  const finish = useBootStore((s) => s.finish);

  useGSAP(
    () => {
      const tl = gsap.timeline();
      tl.from(".boot-logo", { opacity: 0, duration: 0.5, ease: "power2.out" });
      tl.to(
        ".boot-bar-fill",
        { width: "100%", duration: BOOT_DURATION, ease: "power1.inOut" },
        0.1,
      );
      tl.to(".boot-screen", { opacity: 0, duration: 0.4, onComplete: finish }, ">");
    },
    { scope: rootRef },
  );

  return (
    <div className="boot-screen" ref={rootRef}>
      <img className="boot-logo" src={assetUrl("/images/apple-logo.png")} alt="" />
      <div className="boot-bar">
        <div className="boot-bar-fill" />
      </div>
    </div>
  );
};

export default BootScreen;
