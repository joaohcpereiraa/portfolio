import { X } from "lucide-react";
import { careerTimeline } from "#constants";
import useEscape from "#shared/hooks/useEscape";
import { shortPlace, shortTitle } from "../../../utils/badges";
import { periodEnds } from "../../../utils/period";

// "Sep 2022 — Jun 2025" → "Sep 2022 – Jun 2025".
const dates = (period) => periodEnds(period).join(" – ");

// The badges as a list ("View as list" on the badge rail): a small glass
// panel at the side of the room with a plain table, one row per role in date
// order, like a CV. Picking a row takes that badge off the rail.
const ExperiencePanel = ({ onClose, onPick }) => {
  // Escape closes only the list, not the badge rail behind it.
  useEscape(onClose);

  return (
    <aside className="xp" aria-label="Journey">
      <header className="xp-head">
        <h2>Journey</h2>
        <button type="button" className="xp-close" onClick={onClose} aria-label="Close list">
          <X size={16} />
        </button>
      </header>

      <table className="xp-table">
        <thead>
          <tr>
            <th scope="col">Role</th>
            <th scope="col">Place</th>
            <th scope="col">Dates</th>
          </tr>
        </thead>
        <tbody>
          {careerTimeline.map((entry, i) => (
            <tr
              key={entry.id}
              tabIndex={0}
              onClick={() => onPick(i)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  onPick(i);
                }
              }}
            >
              <td>{shortTitle(entry.title)}</td>
              <td>{shortPlace(entry.place)}</td>
              <td className="xp-dates">{dates(entry.period)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </aside>
  );
};

export default ExperiencePanel;
