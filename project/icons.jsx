// Lightweight icon set — minimal stroked SVGs, sized via parent
const I = (size = 16) => ({
  width: size, height: size, viewBox: "0 0 24 24",
  fill: "none", stroke: "currentColor", strokeWidth: 1.6,
  strokeLinecap: "round", strokeLinejoin: "round",
});

const Icon = ({ name, size = 16, className = "" }) => {
  const p = I(size);
  switch (name) {
    case "sun": return <svg {...p} className={className}><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M2 12h2M20 12h2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>;
    case "trend": return <svg {...p} className={className}><path d="M3 17l6-6 4 4 7-8"/><path d="M14 7h6v6"/></svg>;
    case "grid": return <svg {...p} className={className}><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></svg>;
    case "video": return <svg {...p} className={className}><rect x="2.5" y="6" width="13" height="12" rx="2"/><path d="M15.5 10l5-3v10l-5-3z"/></svg>;
    case "compass": return <svg {...p} className={className}><circle cx="12" cy="12" r="9"/><path d="M15.5 8.5l-2 5-5 2 2-5z"/></svg>;
    case "note": return <svg {...p} className={className}><path d="M5 4h11l3 3v13H5z"/><path d="M9 10h6M9 14h6M9 18h4"/></svg>;
    case "gear": return <svg {...p} className={className}><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3 1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8 1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>;
    case "search": return <svg {...p} className={className}><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>;
    case "refresh": return <svg {...p} className={className}><path d="M3 12a9 9 0 0 1 15.5-6.3L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-15.5 6.3L3 16"/><path d="M3 21v-5h5"/></svg>;
    case "moon": return <svg {...p} className={className}><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/></svg>;
    case "export": return <svg {...p} className={className}><path d="M12 16V4"/><path d="M8 8l4-4 4 4"/><path d="M4 16v3a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-3"/></svg>;
    case "logout": return <svg {...p} className={className}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><path d="M16 17l5-5-5-5"/><path d="M21 12H9"/></svg>;
    case "plus": return <svg {...p} className={className}><path d="M12 5v14M5 12h14"/></svg>;
    case "check": return <svg {...p} className={className} stroke="white" strokeWidth="2.5"><path d="M5 12l5 5 9-11"/></svg>;
    case "arrow-right": return <svg {...p} className={className}><path d="M5 12h14"/><path d="M13 6l6 6-6 6"/></svg>;
    case "mail": return <svg {...p} className={className}><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg>;
    case "linkedin": return <svg {...p} className={className}><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 13v4"/></svg>;
    case "text": return <svg {...p} className={className}><path d="M21 15a2 2 0 0 1-2 2H8l-5 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>;
    case "phone": return <svg {...p} className={className}><path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2 4.2 2 2 0 0 1 4 2h3a2 2 0 0 1 2 1.7c.1.9.3 1.7.6 2.5a2 2 0 0 1-.5 2.1L8 9.5a16 16 0 0 0 6 6l1.2-1.2a2 2 0 0 1 2.1-.5c.8.3 1.6.5 2.5.6A2 2 0 0 1 22 16.9z"/></svg>;
    case "menu": return <svg {...p} className={className}><path d="M4 6h16M4 12h16M4 18h16"/></svg>;
    case "bell": return <svg {...p} className={className}><path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10 21a2 2 0 0 0 4 0"/></svg>;
    case "terminal": return <svg {...p} className={className}><path d="M4 17l5-5-5-5"/><path d="M12 19h8"/></svg>;
    case "alert": return <svg {...p} className={className}><path d="M12 9v4M12 17v.01"/><path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"/></svg>;
    case "calendar": return <svg {...p} className={className}><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/></svg>;
    case "archive": return <svg {...p} className={className}><rect x="3" y="4" width="18" height="4" rx="1"/><path d="M5 8v11a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8"/><path d="M10 12h4"/></svg>;
    case "sparkles": return <svg {...p} className={className}><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5z"/><path d="M19 15l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/></svg>;
    case "pulse": return <svg {...p} className={className}><path d="M3 12h4l2-6 4 12 2-6h6"/></svg>;
    case "share": return <svg {...p} className={className}><path d="M4 12v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7"/><path d="M16 6l-4-4-4 4"/><path d="M12 2v14"/></svg>;
    case "copy": return <svg {...p} className={className}><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15V5a2 2 0 0 1 2-2h10"/></svg>;
    case "shuffle": return <svg {...p} className={className}><path d="M16 3h5v5"/><path d="M4 20l17-17"/><path d="M21 16v5h-5"/><path d="M15 15l6 6"/><path d="M4 4l5 5"/></svg>;
    case "x": return <svg {...p} className={className}><path d="M6 6l12 12M6 18L18 6"/></svg>;
    case "star": return <svg {...p} className={className}><path d="M12 3l2.6 6 6.4.6-4.8 4.4 1.4 6.4L12 17l-5.6 3.4L7.8 14 3 9.6l6.4-.6z"/></svg>;
    case "pin": return <svg {...p} className={className}><path d="M12 17v5"/><path d="M9 10V4h6v6l3 4H6z"/></svg>;
    case "zap": return <svg {...p} className={className}><path d="M13 2L3 14h7l-1 8 10-12h-7z"/></svg>;
    case "more": return <svg {...p} className={className}><circle cx="5" cy="12" r="1.4"/><circle cx="12" cy="12" r="1.4"/><circle cx="19" cy="12" r="1.4"/></svg>;
    case "user": return <svg {...p} className={className}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>;
    default: return null;
  }
};

window.Icon = Icon;
