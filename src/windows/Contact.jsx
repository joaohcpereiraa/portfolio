import WindowControlls from "../components/WindowControlls";
import { socials } from "../constants";
import WindowWrapper from "../hoc/WindowWrapper";
import { assetUrl } from "../utils/assetUrl";

const Contact = () => {
  return (
    <>
      <div id="window-header">
        <WindowControlls target="contact" />
        <h2>Contact Me</h2>
      </div>

      <div className="p-6 space-y-5 bg-gradient-to-b from-white to-gray-50/80 dark:from-gray-900 dark:to-gray-900">
        <div className="flex items-center gap-4">
          <img src={assetUrl("/images/joao.png")} alt="João" className="w-20 rounded-full" />
          <div className="space-y-1">
            <h3>Let&apos;s Connect</h3>
            <a
              href="mailto:joao.costa.20@hotmail.com"
              className="inline-flex items-center rounded-md border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 px-2.5 py-1 text-xs font-medium text-gray-700 dark:text-gray-200 transition-colors hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              joao.costa.20@hotmail.com
            </a>
          </div>
        </div>

        <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
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
