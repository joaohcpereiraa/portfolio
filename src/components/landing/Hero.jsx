import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import { ChevronDown, FileDown } from "lucide-react";
import { profile, socials } from "#constants";
import { assetUrl } from "../../utils/assetUrl";
import { renderText, setupTextHover } from "../../utils/textHover";

const NAME_WEIGHTS = { min: 400, max: 900, default: 400 };

const Hero = () => {
  const nameRef = useRef(null);

  useGSAP(() => setupTextHover(nameRef.current, NAME_WEIGHTS), []);

  return (
    <div className="hero-inner">
      <p className="hero-greeting">Hey, I&apos;m</p>

      <h1 ref={nameRef} className="hero-name">
        {renderText(profile.name, "text-7xl md:text-8xl italic font-georama", 400)}
      </h1>

      <p className="hero-role">{profile.role}</p>
      <p className="hero-bio">{profile.bio}</p>

      <div className="hero-actions">
        {socials.map((s) => (
          <a
            key={s.id}
            className="hero-social"
            href={s.link}
            target="_blank"
            rel="noreferrer"
            title={s.text}
            aria-label={s.text}
            style={{ backgroundColor: s.bg }}
          >
            <img src={s.icon} alt={s.text} />
          </a>
        ))}

        <span className="hero-actions-divider" />

        <a
          className="hero-resume"
          href={assetUrl("/files/resumee.pdf")}
          target="_blank"
          rel="noreferrer"
        >
          <FileDown size={18} />
          <span>Resume</span>
        </a>
      </div>

      <div className="hero-scroll-cue">
        <span>Scroll</span>
        <ChevronDown className="animate-bounce" size={22} />
      </div>
    </div>
  );
};

export default Hero;
