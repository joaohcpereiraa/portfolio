import { useEffect, useRef, useState } from "react";
import { ArrowUp, BatteryFull, ChevronLeft, MessageCircle, Signal, UserRound, Wifi, X } from "lucide-react";
import { aboutCard, profile, socials } from "#constants";
import { assetUrl } from "#shared/utils/assetUrl";
import useDragScroll from "../../../hooks/useDragScroll";

const PHOTO_URL = assetUrl("/images/joao.png");
const EMAIL = aboutCard.rows.find((r) => r.label === "email").value;

// João's side of the Messages thread, already waiting when it opens.
const OPENERS = [
  "Hey! 👋 Thanks for stopping by my room.",
  "I'm open to new opportunities and always happy to chat about a project.",
  "Write me something here and it'll go straight to my inbox.",
];
const SENT_REPLY = "Your email app should open with that message, just hit send there and I'll get back to you soon!";

// Current time, refreshed every second (drives the clock widget's hands).
const useClock = () => {
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  return now;
};

const hhmm = (d) => d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", hour12: false });

const SocialApp = ({ social, small = false }) => (
  <a
    className={small ? "iphone-action" : "iphone-app"}
    href={social.link}
    target="_blank"
    rel="noreferrer"
    aria-label={social.text}
  >
    <span className="iphone-icon" style={{ backgroundColor: social.bg }}>
      <img src={social.icon} alt="" />
    </span>
    <span>{social.text}</span>
  </a>
);

// iOS Calendar widget: weekday in red, big day number, month underneath.
const CalendarWidget = ({ now }) => (
  <div className="iphone-widget iphone-calendar">
    <p className="iphone-calendar-day">
      {now.toLocaleDateString("en-GB", { weekday: "long" })}
    </p>
    <p className="iphone-calendar-date">{now.getDate()}</p>
    <p className="iphone-calendar-month">
      {now.toLocaleDateString("en-GB", { month: "long", year: "numeric" })}
    </p>
  </div>
);

const HOUR_MARKS = [12, 3, 6, 9];

// iOS Clock widget: analog face with live hour, minute and second hands.
const ClockWidget = ({ now }) => {
  const s = now.getSeconds();
  const m = now.getMinutes() + s / 60;
  const h = (now.getHours() % 12) + m / 60;

  return (
    <div className="iphone-widget iphone-clock">
      <svg viewBox="0 0 100 100" aria-label={hhmm(now)}>
        <circle cx="50" cy="50" r="46" fill="#fff" />
        {Array.from({ length: 60 }, (_, i) => (
          <line
            key={i}
            x1="50"
            y1={i % 5 === 0 ? 8 : 7}
            x2="50"
            y2={i % 5 === 0 ? 13 : 10}
            stroke={i % 5 === 0 ? "#111" : "#9ca3af"}
            strokeWidth={i % 5 === 0 ? 1.6 : 0.6}
            transform={`rotate(${i * 6} 50 50)`}
          />
        ))}
        {HOUR_MARKS.map((n, i) => {
          const a = (i * Math.PI) / 2;
          return (
            <text key={n} x={50 + Math.sin(a) * 27} y={50 - Math.cos(a) * 27 + 4} textAnchor="middle" fontSize="12" fontWeight="600" fill="#111">
              {n}
            </text>
          );
        })}
        <line x1="50" y1="50" x2="50" y2="28" stroke="#111" strokeWidth="3.5" strokeLinecap="round" transform={`rotate(${h * 30} 50 50)`} />
        <line x1="50" y1="50" x2="50" y2="15" stroke="#111" strokeWidth="2.5" strokeLinecap="round" transform={`rotate(${m * 6} 50 50)`} />
        <line x1="50" y1="58" x2="50" y2="12" stroke="#ff9f0a" strokeWidth="1" strokeLinecap="round" transform={`rotate(${s * 6} 50 50)`} />
        <circle cx="50" cy="50" r="2.4" fill="#ff9f0a" />
      </svg>
    </div>
  );
};

const Home = ({ now, open }) => (
  <div className="iphone-home">
    <div className="iphone-widgets">
      <CalendarWidget now={now} />
      <ClockWidget now={now} />
    </div>

    <div className="iphone-grid">
      {socials.map((s) => (
        <SocialApp key={s.id} social={s} />
      ))}
      <button type="button" className="iphone-app" onClick={() => open("messages")}>
        <span className="iphone-icon iphone-icon-messages">
          <MessageCircle size={26} fill="currentColor" />
        </span>
        <span>Messages</span>
      </button>
      <button type="button" className="iphone-app" onClick={() => open("contact")}>
        <span className="iphone-icon iphone-icon-contacts">
          <UserRound size={26} />
        </span>
        <span>Contacts</span>
      </button>
    </div>
  </div>
);

const ContactCard = ({ back }) => {
  const scrollRef = useRef(null);
  useDragScroll(scrollRef);

  return (
    <div ref={scrollRef} className="iphone-contact">
      <button type="button" className="iphone-back" onClick={back}>
        <ChevronLeft size={18} /> Contacts
      </button>

      <div className="iphone-contact-head">
        <img src={PHOTO_URL} alt={profile.name} />
        <h3>{profile.name}</h3>
        <p>{profile.role}</p>
        <div className="iphone-actions">
          {socials.map((s) => (
            <SocialApp key={s.id} social={s} small />
          ))}
        </div>
      </div>

      <ul className="iphone-rows">
        {aboutCard.rows.map((r) => (
          <li key={r.label}>
            <span>{r.label}</span>
            {r.href ? <a href={r.href}>{r.value}</a> : r.value}
          </li>
        ))}
      </ul>

      <div className="iphone-rows iphone-notes">
        <span>about</span>
        <p>{aboutCard.summary}</p>
      </div>
    </div>
  );
};

// Messages app: a chat with João. Sending opens the visitor's email app with
// the message filled in (mailto), and the thread shows it as sent.
const Messages = ({ back }) => {
  const [draft, setDraft] = useState("");
  const [sent, setSent] = useState([]);
  const threadRef = useRef(null);

  useEffect(() => {
    const el = threadRef.current;
    el?.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [sent]);

  const send = (e) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    setSent((s) => [...s, text]);
    setDraft("");
    const subject = encodeURIComponent("Hi João! (from your portfolio)");
    window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${encodeURIComponent(text)}`;
  };

  return (
    <div className="iphone-messages">
      <div className="iphone-messages-head">
        <button type="button" className="iphone-back" onClick={back} aria-label="Back">
          <ChevronLeft size={22} />
        </button>
        <img src={PHOTO_URL} alt="" />
        <span>{profile.name}</span>
      </div>

      <div ref={threadRef} className="iphone-thread">
        {OPENERS.map((text) => (
          <p key={text} className="iphone-bubble in">{text}</p>
        ))}
        {sent.map((text, i) => (
          <p key={i} className="iphone-bubble out">{text}</p>
        ))}
        {sent.length > 0 && <p className="iphone-bubble in">{SENT_REPLY}</p>}
      </div>

      <form className="iphone-compose" onSubmit={send}>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="iMessage"
          aria-label="Message to João"
        />
        <button type="submit" disabled={!draft.trim()} aria-label="Send">
          <ArrowUp size={16} strokeWidth={3} />
        </button>
      </form>
    </div>
  );
};

// iPhone overlay for the phone on the bed: a home screen whose LinkedIn and
// GitHub apps open those profiles, Messages to write to João, and a
// Contacts app with his card.
const PhoneScreen = ({ onClose }) => {
  const now = useClock();
  const [screen, setScreen] = useState("home");

  return (
    <div className="iphone-wrap">
      <div className="iphone" role="dialog" aria-label="About me">
        <div className="iphone-screen">
          <div className="iphone-island" />
          <div className="iphone-status">
            <span>{hhmm(now)}</span>
            <span className="iphone-status-icons">
              <Signal size={13} />
              <Wifi size={13} />
              <BatteryFull size={16} />
            </span>
          </div>

          {screen === "home" && <Home now={now} open={setScreen} />}
          {screen === "messages" && <Messages back={() => setScreen("home")} />}
          {screen === "contact" && <ContactCard back={() => setScreen("home")} />}

          <button
            type="button"
            className="iphone-home-bar"
            onClick={() => setScreen("home")}
            aria-label="Home screen"
          />
        </div>
      </div>

      <button type="button" className="iphone-close" onClick={onClose}>
        <X size={14} /> Close
      </button>
    </div>
  );
};

export default PhoneScreen;
