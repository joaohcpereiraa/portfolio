import { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { skillsOrbit } from "#constants";
import { reducedMotion } from "../motion";
import PixelIcon from "./PixelIcon";

const COLS = 4;
const SLOTS = 8; // two rows per bag; unused slots show as empty

// Types `text` out letter by letter, like an RPG dialogue box.
const useTypewriter = (text) => {
  const [count, setCount] = useState(reducedMotion ? text.length : 0);
  useEffect(() => {
    if (reducedMotion) return;
    const id = setInterval(() => {
      setCount((c) => {
        if (c >= text.length) clearInterval(id);
        return Math.min(c + 2, text.length);
      });
    }, 22);
    return () => clearInterval(id);
  }, [text]);
  return text.slice(0, count);
};

// Remounted per item (keyed), so the typing restarts on every inspect.
const ItemDetails = ({ item, stack }) => {
  const usedAt = useTypewriter(item.usedAt);
  return (
    <div className="hh-inspect">
      <div className="hh-inspect-icon">
        <PixelIcon src={item.icon} />
      </div>
      <div className="hh-inspect-text">
        <p className="hh-name">{item.name}</p>
        <p className="hh-class">Class · {stack}</p>
        <p className="hh-label">Item description</p>
        <p>{item.blurb}</p>
        <p className="hh-label">Used in</p>
        <p>
          {usedAt}
          <span className="hh-caret" />
        </p>
      </div>
    </div>
  );
};

// The handheld picked up off the bed: an RPG-style inventory where every
// technology is an item. L / R (or Q / E) switch bags (one per stack), the
// D-pad (or arrow keys) moves the cursor, A (Enter) inspects the item and
// B (Backspace) puts it back in the bag. Esc leaves, like everywhere else.
const HandheldScreen = ({ onClose }) => {
  const [bag, setBag] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [inspecting, setInspecting] = useState(false);

  const { stack, items } = skillsOrbit[bag];
  const item = items[Math.min(cursor, items.length - 1)];

  const switchBag = (dir) => {
    setBag((b) => (b + dir + skillsOrbit.length) % skillsOrbit.length);
    setCursor(0);
    setInspecting(false);
  };

  const move = (dx, dy) => {
    if (inspecting) return;
    setCursor((c) => {
      const col = (c % COLS) + dx;
      const row = Math.floor(c / COLS) + dy;
      if (col < 0 || col >= COLS) return c;
      const next = row * COLS + col;
      return next >= 0 && next < items.length ? next : c;
    });
  };

  const press = (button) => {
    if (button === "a") setInspecting(true);
    if (button === "b") setInspecting(false);
  };

  useEffect(() => {
    const KEYS = {
      ArrowLeft: () => move(-1, 0),
      ArrowRight: () => move(1, 0),
      ArrowUp: () => move(0, -1),
      ArrowDown: () => move(0, 1),
      Enter: () => press("a"),
      " ": () => press("a"),
      z: () => press("a"),
      Backspace: () => press("b"),
      x: () => press("b"),
      q: () => switchBag(-1),
      e: () => switchBag(1),
    };
    const onKey = (e) => {
      const action = KEYS[e.key.length === 1 ? e.key.toLowerCase() : e.key];
      if (!action) return;
      e.preventDefault();
      action();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const pick = (i) => {
    setCursor(i);
    setInspecting(true);
  };

  return (
    <div className="handheld-wrap">
      <button type="button" className="handheld-back" onClick={onClose}>
        <ArrowLeft size={14} /> Back
      </button>

      <div className="handheld">
        <button type="button" className="hh-shoulder left" onClick={() => switchBag(-1)} aria-label="Previous bag">
          L
        </button>
        <button type="button" className="hh-shoulder right" onClick={() => switchBag(1)} aria-label="Next bag">
          R
        </button>

        <div className="hh-controls">
          <div className="hh-dpad">
            <button type="button" className="up" onClick={() => move(0, -1)} aria-label="Up" />
            <button type="button" className="left" onClick={() => move(-1, 0)} aria-label="Left" />
            <span />
            <button type="button" className="right" onClick={() => move(1, 0)} aria-label="Right" />
            <button type="button" className="down" onClick={() => move(0, 1)} aria-label="Down" />
          </div>
          <button type="button" className="hh-pill" onClick={onClose}>
            Start
          </button>
        </div>

        <div className="hh-bezel">
          <div className="hh-screen">
            <header className="hh-header">
              <span className="hh-title">Inventory</span>
              <nav className="hh-bags">
                {skillsOrbit.map((s, i) => (
                  <button
                    key={s.stack}
                    type="button"
                    className={i === bag ? "active" : ""}
                    onClick={() => {
                      setBag(i);
                      setCursor(0);
                      setInspecting(false);
                    }}
                  >
                    {s.stack}
                  </button>
                ))}
              </nav>
            </header>

            {inspecting ? (
              <ItemDetails key={item.name} item={item} stack={stack} />
            ) : (
              <>
                <ul className="hh-grid">
                  {Array.from({ length: SLOTS }, (_, i) => {
                    const slot = items[i];
                    if (!slot) return <li key={i} className="hh-slot empty" />;
                    return (
                      <li key={slot.name}>
                        <button
                          type="button"
                          className={`hh-slot ${i === cursor ? "selected" : ""}`}
                          onMouseEnter={() => setCursor(i)}
                          onClick={() => pick(i)}
                          aria-label={slot.name}
                        >
                          <PixelIcon src={slot.icon} />
                        </button>
                      </li>
                    );
                  })}
                </ul>

                <div className="hh-dialog">
                  <p className="hh-name">{item.name}</p>
                  <p>{item.blurb}</p>
                </div>
              </>
            )}

            <footer className="hh-footer">
              {inspecting ? <span>Ⓑ Back to bag</span> : <span>Ⓐ Inspect</span>}
              <span>
                Bag {bag + 1}/{skillsOrbit.length} · Ⓛ Ⓡ
              </span>
            </footer>
          </div>
        </div>

        <div className="hh-controls">
          <div className="hh-ab">
            <button type="button" className="b" onClick={() => press("b")}>
              B
            </button>
            <button type="button" className="a" onClick={() => press("a")}>
              A
            </button>
          </div>
          <span className="hh-brand">pocket·dev</span>
        </div>
      </div>

      <p className="handheld-keys">Arrows move · Enter inspect · Backspace back · Q / E switch bag · Esc leave</p>
    </div>
  );
};

export default HandheldScreen;
