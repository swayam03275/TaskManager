const accentMap = {
  "warning":       { color: "#e8a020", bg: "rgba(232,160,32,0.10)",  icon: "◈" },
  "info":          { color: "#0891b2", bg: "rgba(8,145,178,0.10)",   icon: "◎" },
  "success":       { color: "#16a34a", bg: "rgba(22,163,74,0.10)",   icon: "◉" },
  "danger":        { color: "#d12b2b", bg: "rgba(209,43,43,0.10)",   icon: "⚑" },
  "primary":       { color: "var(--tm-accent)", bg: "rgba(200,75,26,0.10)", icon: "◆" },
  "text-warning":  { color: "#e8a020", bg: "rgba(232,160,32,0.10)",  icon: "◈" },
  "text-info":     { color: "#0891b2", bg: "rgba(8,145,178,0.10)",   icon: "◎" },
  "text-success":  { color: "#16a34a", bg: "rgba(22,163,74,0.10)",   icon: "◉" },
  "text-danger":   { color: "#d12b2b", bg: "rgba(209,43,43,0.10)",   icon: "⚑" },
  "text-primary":  { color: "var(--tm-accent)", bg: "rgba(200,75,26,0.10)", icon: "◆" },
};

const StatsCard = ({ title, value, accent = "primary", helper }) => {
  const theme = accentMap[accent] ?? accentMap["primary"];

  return (
    <div
      className="stat-tile h-100"
      style={{ "--tile-color": theme.color, "--tile-bg": theme.bg }}
    >
      <div className="stat-orb" aria-hidden="true">{theme.icon}</div>
      <div className="stat-kicker">{title}</div>
      <div className="stat-value" style={{ color: theme.color }}>{value}</div>
      {helper && <div className="stat-helper">{helper}</div>}
      <div className="stat-bar" />

      <style>{`
        .stat-tile {
          position: relative;
          overflow: hidden;
          padding: 20px 22px 18px;
          border-radius: 18px;
          background: var(--tm-card);
          border: 1px solid var(--tm-border);
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          cursor: default;
          isolation: isolate;
        }
        .stat-tile:hover {
          border-color: var(--tile-color);
          box-shadow: 0 0 0 1px var(--tile-color), 0 12px 40px color-mix(in srgb, var(--tile-color) 25%, transparent);
          transform: translateY(-4px) scale(1.015);
        }
        .stat-tile::before {
          content: '';
          position: absolute;
          inset: 0;
          background: var(--tile-bg);
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: 0;
          border-radius: inherit;
        }
        .stat-tile:hover::before { opacity: 1; }
        .stat-orb {
          position: absolute;
          top: 14px; right: 16px;
          font-size: 1.4rem;
          color: var(--tile-color);
          opacity: 0.3;
          transition: all 0.3s ease;
          z-index: 1;
          line-height: 1;
        }
        .stat-tile:hover .stat-orb { opacity: 0.7; transform: scale(1.2) rotate(-10deg); }
        .stat-kicker {
          position: relative; z-index: 1;
          color: var(--tm-muted);
          font-size: 0.7rem;
          text-transform: uppercase;
          letter-spacing: 1.5px;
          font-weight: 600;
          font-family: 'DM Sans', sans-serif;
          margin-bottom: 6px;
        }
        .stat-value {
          position: relative; z-index: 1;
          font-size: 2.5rem;
          font-weight: 800;
          font-family: 'Syne', serif;
          line-height: 1;
          margin-bottom: 6px;
          animation: countUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
        }
        .stat-helper {
          position: relative; z-index: 1;
          font-size: 0.78rem;
          color: var(--tm-muted);
          font-family: 'DM Sans', sans-serif;
        }
        .stat-bar {
          position: absolute;
          bottom: 0; left: 0;
          height: 3px; width: 0;
          background: linear-gradient(90deg, var(--tile-color), transparent);
          transition: width 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          border-radius: 0 0 0 18px;
        }
        .stat-tile:hover .stat-bar { width: 100%; }
        @keyframes countUp {
          from { opacity: 0; transform: scale(0.5) translateY(10px); }
          to   { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default StatsCard;