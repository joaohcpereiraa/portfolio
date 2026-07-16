import { useEffect, useRef, useState } from "react";
import WindowWrapper from "#hoc/WindowWrapper";
import useWindowStore from "../store/window";
import WindowControlls from "../components/WindowControlls";
import {
  careerTimeline,
  landingProjects,
  profile,
  socials,
  techStack,
} from "../constants";

const PROMPT = "joao@macbook ~ %";
const EMAIL = "joao.costa.20@hotmail.com";
const OPENABLE = ["finder", "safari", "contact", "resume", "photos"];
const COMMANDS = [
  "help",
  "whoami",
  "skills",
  "projects",
  "journey",
  "contact",
  "resume",
  "open",
  "neofetch",
  "echo",
  "date",
  "clear",
  "exit",
];

const HELP = [
  "Available commands:",
  "  whoami       who I am",
  "  skills       tech stack by category",
  "  projects     selected work",
  "  journey      education & experience",
  "  contact      email + socials",
  "  resume       open my CV",
  `  open <app>   ${OPENABLE.join(" | ")}`,
  "  neofetch     system info, sort of",
  "  echo <text>  print text",
  "  date         current date",
  "  clear        clear the screen (or Ctrl+L)",
  "  exit         close the terminal",
].join("\n");

const WHOAMI = `${profile.name} — ${profile.role}\n${profile.bio}`;

const SKILLS = techStack
  .map(({ category, items }) => `  ${category.padEnd(22)}${items.join(", ")}`)
  .join("\n");

const PROJECTS = landingProjects
  .map(
    (p) =>
      `  ${p.name} — ${p.tagline}\n` +
      `      ${p.stack.map((t) => t.name).join(" · ")}\n` +
      `      ${p.linkLabel}: ${p.link}`,
  )
  .join("\n\n");

// Most recent first, like a CV.
const JOURNEY = [...careerTimeline]
  .reverse()
  .map(
    (e) => `  ${e.period.padEnd(23)}${e.title}\n${" ".repeat(25)}${e.place}`,
  )
  .join("\n");

const CONTACT = [
  `  ${"Email".padEnd(10)}${EMAIL}`,
  ...socials.map((s) => `  ${s.text.padEnd(10)}${s.link}`),
].join("\n");

const ART = [
  "            .:'   ",
  "        __ :'__   ",
  "     .'`__`-'__``.",
  "    :__________.-'",
  "    :_________:   ",
  "     :_________`-;",
  "      `.__.-.__.' ",
];
const INFO = [
  "joao@macbook",
  "────────────",
  `Name:    ${profile.name}`,
  `Role:    ${profile.role}`,
  "Study:   MSc Cybersecurity & SysAdmin",
  "Shell:   zsh (simulated)",
  "Stack:   React · Node.js · .NET · AWS",
  `Contact: ${EMAIL}`,
];
const NEOFETCH = Array.from(
  { length: Math.max(ART.length, INFO.length) },
  (_, i) => `${(ART[i] ?? "").padEnd(22)}${INFO[i] ?? ""}`,
).join("\n");

const URL_RE = /(https?:\/\/\S+)/g;

// Plain-text output stays authentic; URLs still get to be clickable.
const linkify = (text) =>
  text.split(URL_RE).map((part, i) =>
    part.startsWith("http") ? (
      <a
        key={i}
        className="term-link"
        href={part}
        target="_blank"
        rel="noreferrer"
      >
        {part}
      </a>
    ) : (
      part
    ),
  );

const Terminal = () => {
  const { windows, openWindow, closeWindow } = useWindowStore();
  const isOpen = windows.terminal.isOpen;

  const [lines, setLines] = useState(() => {
    const d = new Date();
    return [
      {
        kind: "out",
        text: `Last login: ${d.toDateString().slice(0, 10)} ${d.toTimeString().slice(0, 8)} on ttys000`,
      },
      { kind: "out", text: "Type `help` to see available commands." },
    ];
  });
  const [value, setValue] = useState("");
  const [history, setHistory] = useState([]);
  const [histPos, setHistPos] = useState(null); // null = typing a fresh line

  const bodyRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isOpen) inputRef.current?.focus();
  }, [isOpen]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [lines]);

  const run = (cmd) => {
    const [name, ...args] = cmd.split(/\s+/);

    switch (name) {
      case "help":
        return HELP;
      case "whoami":
        return WHOAMI;
      case "skills":
        return SKILLS;
      case "projects":
        return PROJECTS;
      case "journey":
        return JOURNEY;
      case "contact":
        return CONTACT;
      case "neofetch":
        return NEOFETCH;
      case "date":
        return new Date().toString();
      case "echo":
        return args.join(" ");
      case "resume":
        openWindow("resume");
        return "Opening resume ...";
      case "open": {
        const app = (args[0] || "").toLowerCase();
        if (!app) return `usage: open <app>  (${OPENABLE.join(" | ")})`;
        if (!OPENABLE.includes(app)) return `open: no such app: ${app}`;
        openWindow(app);
        return `Opening ${app} ...`;
      }
      case "sudo":
        if (args.join(" ") === "hire-me") {
          setTimeout(() => openWindow("contact"), 900);
          return "[sudo] password for recruiter: ••••••\nAccess granted. Opening contact ...";
        }
        return "joao is not in the sudoers file. This incident will be reported.";
      case "exit":
        closeWindow("terminal");
        return "";
      default:
        return `zsh: command not found: ${name}\nType \`help\` to see available commands.`;
    }
  };

  const submit = () => {
    const raw = value;
    const cmd = raw.trim();
    setValue("");
    setHistPos(null);

    if (cmd) setHistory((h) => [...h, cmd]);
    if (cmd === "clear") {
      setLines([]);
      return;
    }

    const entry = { kind: "cmd", text: raw };
    const out = cmd ? run(cmd) : "";
    setLines((ls) =>
      out ? [...ls, entry, { kind: "out", text: out }] : [...ls, entry],
    );
  };

  const navigate = (dir) => {
    if (!history.length) return;
    let pos = (histPos ?? history.length) + dir;
    if (pos < 0) pos = 0;
    if (pos >= history.length) {
      setHistPos(null);
      setValue("");
      return;
    }
    setHistPos(pos);
    setValue(history[pos]);
  };

  const complete = () => {
    const parts = value.split(/\s+/);
    if (parts.length === 1 && parts[0]) {
      const matches = COMMANDS.filter((c) => c.startsWith(parts[0]));
      if (matches.length === 1) setValue(`${matches[0]} `);
    } else if (parts[0] === "open" && parts.length === 2) {
      const matches = OPENABLE.filter((a) => a.startsWith(parts[1]));
      if (matches.length === 1) setValue(`open ${matches[0]}`);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      submit();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      navigate(-1);
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      navigate(1);
    } else if (e.key === "Tab") {
      e.preventDefault();
      complete();
    } else if (e.key === "l" && e.ctrlKey) {
      e.preventDefault();
      setLines([]);
    }
  };

  return (
    <>
      <div id="window-header">
        <WindowControlls target="terminal" />
        <h2>joao@macbook — zsh</h2>
      </div>

      <div
        className="term-body"
        ref={bodyRef}
        onClick={() => inputRef.current?.focus()}
      >
        {lines.map((line, i) =>
          line.kind === "cmd" ? (
            <p key={i} className="term-line">
              <span className="term-prompt">{PROMPT}</span>{" "}
              <span className="term-cmd">{line.text}</span>
            </p>
          ) : (
            <p key={i} className="term-line">
              {linkify(line.text)}
            </p>
          ),
        )}

        <div className="term-input-row">
          <span className="term-prompt">{PROMPT}</span>
          <input
            ref={inputRef}
            className="term-input"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            spellCheck={false}
            autoComplete="off"
            autoCapitalize="off"
            aria-label="terminal input"
          />
        </div>
      </div>
    </>
  );
};

const TerminalWindow = WindowWrapper(Terminal, "terminal");

export default TerminalWindow;
