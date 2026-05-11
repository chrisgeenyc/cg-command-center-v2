'use client';
import { useEffect } from 'react';
import Sidebar from '@/components/Sidebar';
import Icon from '@/components/Icon';
import TodayPage from '@/components/TodayPage';
import PipelinePage from '@/components/PipelinePage';
import ProjectsPage from '@/components/ProjectsPage';
import QuickiesPage from '@/components/QuickiesPage';
import PulsePage from '@/components/PulsePage';
import NotesPage from '@/components/NotesPage';
import SettingsPage from '@/components/SettingsPage';
import {
  TweaksPanel, TweakSection, TweakRadio, TweakToggle, TweakColor, TweakSelect,
  useTweaks, TweakValues
} from '@/components/TweaksPanel';

const DEFAULTS: TweakValues = {
  theme: "light",
  viewport: "desktop",
  priorityStyle: "gradient",
  postItTints: true,
  accent: "#C7F03B",
  page: "today",
  persona: "operator",
};

export default function Home() {
  const [t, setTweak] = useTweaks(DEFAULTS);
  const page = t.page;
  const isMobile = t.viewport === "mobile";

  const navigate = (id: string) => {
    setTweak("page", id);
  };

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", t.theme);
  }, [t.theme]);

  useEffect(() => {
    document.documentElement.style.setProperty("--accent", t.accent);
  }, [t.accent]);

  const pages: Record<string, React.ReactNode> = {
    today:    <TodayPage tweaks={t} setTweak={setTweak} isMobile={isMobile} navigate={navigate} />,
    pipeline: <PipelinePage />,
    projects: <ProjectsPage />,
    quickies: <QuickiesPage tints={t.postItTints} />,
    pulse:    <PulsePage />,
    notes:    <NotesPage />,
    settings: <SettingsPage />,
  };

  return (
    <div className={`app ${isMobile ? "mobile" : ""} ${page !== "today" ? "no-rail" : ""}`}>
      {!isMobile && <Sidebar active={page} onNavigate={navigate} persona={t.persona} />}

      {isMobile && (
        <div className="mobile-topbar">
          <button className="icon-btn" style={{ width: 34, height: 34 }}><Icon name="menu" size={16} /></button>
          <div className="brand-mark">c</div>
          <div className="mobile-brand-name">
            Command<span style={{ color: "var(--ink-3)", fontWeight: 400 }}>.cg</span>
          </div>
          <button className="icon-btn" style={{ marginLeft: "auto", width: 34, height: 34 }}
                  onClick={() => setTweak("theme", t.theme === "dark" ? "light" : "dark")}>
            <Icon name={t.theme === "dark" ? "sun" : "moon"} size={15} />
          </button>
        </div>
      )}

      {pages[page] || pages.today}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Page">
          <TweakSelect label="View" value={page}
            options={["today", "pipeline", "projects", "quickies", "pulse", "notes", "settings"]}
            onChange={v => navigate(v)} />
        </TweakSection>
        <TweakSection label="Persona">
          <TweakSelect label="View as" value={t.persona}
            options={["operator", "collab"]}
            onChange={v => setTweak("persona", v)} />
        </TweakSection>
        <TweakSection label="Display">
          <TweakRadio label="Theme" value={t.theme}
            options={["light", "dark"]}
            onChange={v => setTweak("theme", v)} />
          <TweakRadio label="Viewport" value={t.viewport}
            options={["desktop", "mobile"]}
            onChange={v => setTweak("viewport", v)} />
        </TweakSection>
        <TweakSection label="Priority Hero (Today)">
          <TweakRadio label="Treatment" value={t.priorityStyle}
            options={["gradient", "solid"]}
            onChange={v => setTweak("priorityStyle", v)} />
        </TweakSection>
        <TweakSection label="Quickies">
          <TweakToggle label="Post-It tints" value={t.postItTints}
            onChange={v => setTweak("postItTints", v)} />
        </TweakSection>
        <TweakSection label="Accent">
          <TweakColor label="Lime accent" value={t.accent}
            options={["#C7F03B", "#A6E22E", "#E0FF6A", "#9CD132"]}
            onChange={v => setTweak("accent", v)} />
        </TweakSection>
      </TweaksPanel>
    </div>
  );
}
