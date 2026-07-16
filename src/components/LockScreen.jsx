import { useEffect, useRef } from "react";
import gsap from "gsap";
import dayjs from "dayjs";
import { profile } from "#constants";
import useUiStore from "../store/ui";
import { assetUrl } from "../utils/assetUrl";

const LockScreen = () => {
  const unlock = useUiStore((s) => s.unlock);
  const ref = useRef(null);

  const handleUnlock = () => {
    gsap.to(ref.current, {
      opacity: 0,
      duration: 0.35,
      ease: "power2.in",
      onComplete: unlock,
    });
  };

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Enter") handleUnlock();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div id="lock-screen" ref={ref} onClick={handleUnlock}>
      <div className="lock-clock">
        <p className="lock-date">{dayjs().format("dddd, MMMM D")}</p>
        <p className="lock-time">{dayjs().format("h:mm")}</p>
      </div>

      <div className="lock-user">
        <img src={assetUrl("/images/joao.png")} alt={profile.name} />
        <p>{profile.name}</p>
        <button type="button">Click to log in</button>
      </div>
    </div>
  );
};

export default LockScreen;
