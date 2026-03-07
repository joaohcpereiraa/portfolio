import WindowControlls from "../components/WindowControlls";
import { socials } from "../constants";
import WindowWrapper from "../hoc/WindowWrapper";

const Contact = () => {
  return (
    <>
      <div id="window-header">
        <WindowControlls target="contact" />
        <h2>Contact Me</h2>
      </div>

      <div className="p-6 space-y-5 bg-gradient-to-b from-white to-gray-50/80">
        <div className="flex items-center gap-4">
          <img src="/images/joao.png" alt="João" className="w-20 rounded-full" />
          <div className="space-y-1">
            <h3>Let&apos;s Connect</h3>
            <a
              href="mailto:joao.costa.20@hotmail.com"
              className="inline-flex items-center rounded-md border border-gray-200 bg-white px-2.5 py-1 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-100"
            >
              joao.costa.20@hotmail.com
            </a>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-gray-700">
          I&apos;m always open to new opportunities, collaborations, or just a
          friendly chat about all things tech. Whether you have a project in
          mind, want to discuss the latest trends in web development, or just
          want to say hi, feel free to reach out!
        </p>

        <ul className="contact-socials">
          {socials.map(({ id, bg, link, icon, text }) => (
            <li key={id} style={{ backgroundColor: bg }} className="rounded-lg">
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                title={text}
                className="contact-social-link"
              >
                <img src={icon} alt={text} className="social-icon" />
                <p>{text}</p>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

const ContactWindow = WindowWrapper(Contact, "contact");

export default ContactWindow;
