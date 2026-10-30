import { ArrowLeft } from "lucide-react";

// The small bar at the bottom of a focused item: Back, a hint, and any extra
// buttons passed as children.
const TipBar = ({ onBack, hint, children }) => (
  <div className="bedroom-computer-tip">
    <button type="button" onClick={onBack}>
      <ArrowLeft size={14} /> Back
    </button>
    <span>{hint}</span>
    {children}
  </div>
);

export default TipBar;
