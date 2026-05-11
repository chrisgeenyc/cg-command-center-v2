'use client';
import Icon from '@/components/Icon';
import { NAV, NAV_SETTINGS } from '@/lib/data';

const COLLAB_ALLOWED = new Set(["today", "projects", "pulse", "notes", "settings"]);

interface SidebarProps {
  active: string;
  onNavigate: (id: string) => void;
  persona?: string;
}

export default function Sidebar({ active, onNavigate, persona = "operator" }: SidebarProps) {
  const isCollab = persona === "collab";

  const filterNav = <T extends { id: string }>(items: T[]) =>
    isCollab ? items.filter(i => COLLAB_ALLOWED.has(i.id)) : items;

  const me = isCollab
    ? { name: "Sharisse Walker", role: "Collaborator · Service mode", avatar: "SW" }
    : { name: "Chris Gee", role: "Operator · Brooklyn, NY", avatar: "CG" };

  return (
    <aside className="sidebar" data-persona={persona}>
      <div className="brand">
        <div className="brand-mark has-logo">
          <img src="/logo.png" alt="Command Center" />
        </div>
        <div className="brand-name">Command Center</div>
        {isCollab && <span className="persona-tag">guest</span>}
      </div>

      <div className="nav-section">
        <div className="nav-label">Navigation</div>
        {filterNav(NAV).map(item => (
          <button key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`nav-item ${active === item.id ? "active" : ""} ${item.contextual ? "contextual" : ""}`}>
            <Icon name={item.icon} size={17} className="nav-icon" />
            <span>{item.label}</span>
            {item.contextual && active !== item.id && <span className="nav-count">{item.sub}</span>}
            {!item.contextual && item.count != null && <span className="nav-count">{item.count}</span>}
          </button>
        ))}
      </div>

      <div className="nav-section">
        <div className="nav-label">Settings</div>
        {filterNav(NAV_SETTINGS).map(item => (
          <button key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`nav-item ${active === item.id ? "active" : ""}`}>
            <Icon name={item.icon} size={17} className="nav-icon" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      <div className="user-tile">
        <div className={`user-avatar ${persona === "operator" ? "has-photo" : ""}`} data-persona={persona}>
          {persona === "operator"
            ? <img src="/headshot.png" alt={me.name} />
            : me.avatar}
        </div>
        <div>
          <div className="user-tile-name">{me.name}</div>
          <div className="user-tile-role">{me.role}</div>
        </div>
        <Icon name="logout" size={15} className="user-tile-icon" />
      </div>
    </aside>
  );
}
