import { useEffect, useRef } from "react";
import gsap from "gsap";
import useThemeStore from "../store/theme";
import useNetworkStore from "../store/network";

const ControlCenter = ({ onClose, triggerRef }) => {
  const { isDark, toggleTheme } = useThemeStore();
  const { isOnline, toggleWifi } = useNetworkStore();
  const panelRef = useRef(null);

  // Entrance animation
  useEffect(() => {
    if (!panelRef.current) return;
    gsap.fromTo(
      panelRef.current,
      { opacity: 0, scale: 0.92, y: -8, transformOrigin: "top right" },
      { opacity: 1, scale: 1, y: 0, duration: 0.22, ease: "power3.out" }
    );
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      const clickedTrigger = triggerRef?.current?.contains(e.target);
      if (
        !clickedTrigger &&
        panelRef.current &&
        !panelRef.current.contains(e.target)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose, triggerRef]);

  const tileStyle = {
    background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.55)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.7)",
    boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.12)",
  };
  const btnStyle = {
    background: isDark ? "rgba(255,255,255,0.08)" : "rgba(255,255,255,0.55)",
    backdropFilter: "blur(20px) saturate(180%)",
    WebkitBackdropFilter: "blur(20px) saturate(180%)",
    border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid rgba(255,255,255,0.7)",
    boxShadow: isDark ? "0 2px 8px rgba(0,0,0,0.3)" : "0 2px 8px rgba(0,0,0,0.12)",
    color: isDark ? "#f5f5f7" : "#0a0a0a",
  };

  return (
    <div id="control-center" ref={panelRef}>
      {/* Network tile */}
      <div className="cc-group">
        <div
          className="cc-tile cc-tile--active"
          style={{
            ...tileStyle,
            background: isOnline
              ? tileStyle.background
              : isDark ? "rgba(239,68,68,0.15)" : "rgba(254,202,202,0.8)",
            cursor: "pointer",
          }}
          onClick={toggleWifi}
          title={isOnline ? "Click to disconnect" : "Click to reconnect"}
        >
          <div className="cc-tile-icon" style={{ background: isOnline ? "#007AFF" : "#ef4444" }}>
            <svg width="16" height="12" viewBox="0 0 16 11" fill="none">
              <path
                d="M8 10.8315C7.91536 10.8315 7.83073 10.8083 7.74609 10.7617C7.66569 10.7152 7.56201 10.6284 7.43506 10.5015L5.86719 8.99707C5.80794 8.93783 5.76986 8.87435 5.75293 8.80664C5.74023 8.7347 5.75293 8.66699 5.79102 8.60352C6.02376 8.2946 6.3348 8.03646 6.72412 7.8291C7.11768 7.61751 7.54297 7.51172 8 7.51172C8.44434 7.51172 8.85905 7.61117 9.24414 7.81006C9.62923 8.00895 9.93815 8.25439 10.1709 8.54639C10.2301 8.61833 10.2534 8.69661 10.2407 8.78125C10.2323 8.86589 10.1963 8.93783 10.1328 8.99707L8.56494 10.5015C8.43799 10.6284 8.33219 10.7152 8.24756 10.7617C8.16715 10.8083 8.08464 10.8315 8 10.8315ZM4.19775 7.27686L3.18848 6.29297C3.125 6.22949 3.09115 6.15967 3.08691 6.0835C3.08268 6.00309 3.10807 5.92904 3.16309 5.86133C3.50163 5.45931 3.92057 5.10384 4.41992 4.79492C4.91927 4.48177 5.47363 4.23633 6.08301 4.05859C6.69661 3.88086 7.33561 3.79199 8 3.79199C8.66439 3.79199 9.30127 3.88086 9.91064 4.05859C10.52 4.23633 11.0744 4.48177 11.5737 4.79492C12.0773 5.10384 12.4963 5.45931 12.8306 5.86133C12.8898 5.92904 12.9152 6.00309 12.9067 6.0835C12.9025 6.1639 12.8687 6.23372 12.8052 6.29297L11.7959 7.27686C11.7155 7.35303 11.6287 7.39111 11.5356 7.39111C11.4468 7.39111 11.3664 7.35303 11.2944 7.27686C10.8924 6.84945 10.3994 6.50033 9.81543 6.22949C9.23568 5.95866 8.63053 5.82536 8 5.82959C7.37793 5.82536 6.7749 5.95654 6.19092 6.22314C5.61117 6.48551 5.12451 6.82829 4.73096 7.25146C4.65479 7.3361 4.56592 7.38265 4.46436 7.39111C4.36702 7.39535 4.27816 7.35726 4.19775 7.27686ZM1.53174 4.64258L0.636719 3.72852C0.573242 3.66081 0.539388 3.58675 0.535156 3.50635C0.530924 3.42171 0.556315 3.34766 0.611328 3.28418C1.12337 2.64518 1.76872 2.08024 2.54736 1.58936C3.32601 1.09424 4.18083 0.709147 5.11182 0.434082C6.04704 0.154785 7.00977 0.0151367 8 0.0151367C8.986 0.0151367 9.94661 0.154785 10.8818 0.434082C11.8171 0.713379 12.6719 1.09847 13.4463 1.58936C14.2249 2.08024 14.8703 2.64518 15.3823 3.28418C15.4416 3.34766 15.4691 3.42171 15.4648 3.50635C15.4648 3.58675 15.431 3.66081 15.3633 3.72852L14.4619 4.62988C14.39 4.70182 14.3053 4.73991 14.208 4.74414C14.1107 4.74837 14.026 4.71452 13.9541 4.64258C13.1755 3.80469 12.2783 3.16992 11.2627 2.73828C10.2513 2.30241 9.16374 2.08447 8 2.08447C6.84473 2.08447 5.76139 2.30241 4.75 2.73828C3.73861 3.16992 2.83936 3.80257 2.05225 4.63623C1.98031 4.7124 1.89355 4.7526 1.79199 4.75684C1.69466 4.75684 1.60791 4.71875 1.53174 4.64258Z"
                fill="currentColor"
              />
            </svg>
          </div>
          <div className="cc-tile-label">
            <p className="cc-tile-name">Wi-Fi</p>
            <p className="cc-tile-sub">{isOnline ? "Connected" : "Off"}</p>
          </div>
        </div>

        <div className="cc-tile cc-tile--active" style={tileStyle}>
          <div className="cc-tile-icon">
            <svg width="14" height="18" viewBox="0 0 14 18" fill="none">
              <path
                d="M7.9 1L2 10.5h5.1L6.1 17 12 7.5H6.9L7.9 1Z"
                stroke="currentColor"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <div className="cc-tile-label">
            <p className="cc-tile-name">Bluetooth</p>
            <p className="cc-tile-sub">On</p>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="cc-divider" />

      {/* Appearance */}
      <div className="cc-section-label">Appearance</div>
      <div className="cc-appearance">
        <button
          onClick={toggleTheme}
          className="cc-appearance-btn cc-appearance-btn--active"
          style={btnStyle}
        >
          {isDark ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ) : (
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
              <circle
                cx="12"
                cy="12"
                r="4"
                stroke="currentColor"
                strokeWidth="2"
              />
              <path
                d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          )}
          {isDark ? "Dark" : "Light"}
        </button>
      </div>
    </div>
  );
};

export default ControlCenter;
