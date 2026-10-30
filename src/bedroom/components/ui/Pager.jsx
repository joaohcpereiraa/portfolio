import { ChevronLeft, ChevronRight } from "lucide-react";

// "‹ 2 / 5 ›" for stepping through the cards (or CV pages). `index` is
// 0-based; `label` names one item for the button labels ("Previous role").
const Pager = ({ className, index, count, onGo, label }) => (
  <nav className={className}>
    <button type="button" onClick={() => onGo(index - 1)} disabled={index === 0} aria-label={`Previous ${label}`}>
      <ChevronLeft size={16} />
    </button>
    <span>
      {index + 1} / {count}
    </span>
    <button type="button" onClick={() => onGo(index + 1)} disabled={index === count - 1} aria-label={`Next ${label}`}>
      <ChevronRight size={16} />
    </button>
  </nav>
);

export default Pager;
