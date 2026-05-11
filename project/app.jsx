// Main app — composes everything; manages tweaks state + page routing
const { Sidebar, UtilityRow, TodayPage, PipelinePage, ProjectsPage,
        QuickiesPage, PulsePage, NotesPage, SettingsPage,
        TweaksPanel, TweakSection, TweakRadio, TweakToggle, TweakColor, TweakSelect,
        useTweaks, Icon } = window;

function App() {
  const [t, setTweak] = useTweaks(window.CG_TWEAK_DEFAULTS);
  const [page, setPage] = React.useState("today");

  // Apply theme
  React.useEffect(() => {
    document.documentElement.setAttribute("data-theme", t.theme);
  }, [t.theme]);

  // Apply accent
  React.useEffect(() => {
    document.documentElement.style.setProperty("--accent", t.accent);
  }, [t.accent]);

  // Sync page from tweaks (so the Tweaks page-selector drives the same state)
  React.useEffect(() => {
    if (t.page && t.page !== page) setPage(t.page);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [t.page]);

  const navigate = (id) => {
    setPage(id);
    setTweak("page", id);
  };

  const isMobile = t.viewport === "mobile";
  const onTheme = () => setTweak("theme", t.theme === "dark" ? "light" : "dark");

  const PAGES = {
    today:    <TodayPage tweaks={t} setTweak={setTweak} isMobile={isMobile} navigate={navigate} />,
    pipeline: <PipelinePage isMobile={isMobile} />,
    projects: <ProjectsPage isMobile={isMobile} />,
    quickies: <QuickiesPage isMobile={isMobile} tints={t.postItTints} />,
    pulse:    <PulsePage isMobile={isMobile} />,
    notes:    <NotesPage isMobile={isMobile} />,
    settings: <SettingsPage isMobile={isMobile} />,
  };

  return (
    <div className={`app ${isMobile ? "mobile" : ""} ${page !== "today" ? "no-rail" : ""}`} data-screen-label={`CG Command Center · ${page}`}>
      {!isMobile && <Sidebar active={page} onNavigate={navigate} />}

      {isMobile && (
        <div className="mobile-topbar">
          <button className="icon-btn" style={{ width: 34, height: 34 }}><Icon name="menu" size={16} /></button>
          <div className="brand-mark">c</div>
          <div className="mobile-brand-name">Command<span style={{ color: "var(--ink-3)", fontWeight: 400 }}>.cg</span></div>
          <button className="icon-btn" style={{ marginLeft: "auto", width: 34, height: 34 }} onClick={onTheme}>
            <Icon name={t.theme === "dark" ? "sun" : "moon"} size={15} />
          </button>
        </div>
      )}

      {PAGES[page] || PAGES.today}

      <TweaksPanel title="Tweaks">
        <TweakSection label="Page">
          <TweakSelect label="View" value={page}
            options={["today", "pipeline", "projects", "quickies", "pulse", "notes", "settings"]}
            onChange={v => navigate(v)} />
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

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
