import React from 'react';

// Keep a local copy of AdminView to avoid broad refactors
export type AdminView = 'scoring' | 'setup' | 'controls' | 'history' | 'actions';

// Icons – same style as AdminDashboard's inline icons
const ScoreIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" />
  </svg>
);

const SetupIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.007 1.11-1.226l.554-.221a.75.75 0 011.002 0l.553.221c.55.219 1.02.684 1.11 1.226l.099.608a.75.75 0 00.584.585l.608.1a1.125 1.125 0 011.226 1.11l.221.554a.75.75 0 010 1.002l-.221.553a1.125 1.125 0 01-1.226 1.11l-.608.1a.75.75 0 00-.584.585l-.1.608a1.125 1.125 0 01-1.11 1.226l-.554.221a.75.75 0 01-1.002 0l-.553-.221a1.125 1.125 0 01-1.11-1.226l-.1-.608a.75.75 0 00-.584-.585l-.608-.1a1.125 1.125 0 01-1.226-1.11l-.221-.554a.75.75 0 010-1.002l.221-.553a1.125 1.125 0 011.226-1.11l.608-.1a.75.75 0 00.584-.585l.1-.608z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const ControlsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 13.5a3.375 3.375 0 00-3.375-3.375L18 13.5m0 0L19.5 12l-1.5-1.5m0 3l-1.5 1.5L18 13.5m0 0L16.5 15l1.5 1.5m0-3l1.5-1.5L18 13.5" />
  </svg>
);

const ActionsIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" {...props}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 010 3.75H5.625a1.875 1.875 0 010-3.75z" />
  </svg>
);

export const AdminSidebar: React.FC<{
  activeView: AdminView;
  setActiveView: (v: AdminView) => void;
  onClose?: () => void; // for mobile drawer
  className?: string;
}> = ({ activeView, setActiveView, onClose, className = '' }) => {
  const BaseButton: React.FC<{ view: AdminView; label: string; icon: React.ReactNode }> = ({ view, label, icon }) => (
    <button
      onClick={() => { setActiveView(view); onClose?.(); }}
      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-200 ${
        activeView === view
          ? 'bg-classic-green text-white shadow-md'
          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
      }`}
      role="tab"
      aria-selected={activeView === view}
    >
      <span className="w-5 h-5">{icon}</span>
      <span className="font-semibold">{label}</span>
    </button>
  );

  return (
    <nav className={`flex flex-col gap-2 ${className}`} aria-label="Admin navigation">
      <BaseButton view="scoring" label="Live Scoring" icon={<ScoreIcon />} />
      <BaseButton view="setup" label="Match Setup" icon={<SetupIcon />} />
      <BaseButton view="controls" label="Match Controls" icon={<ControlsIcon />} />
      <BaseButton view="history" label="Match History" icon={<svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3"/><path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9 9 0 110-18 9 9 0 010 18z"/></svg>} />
      <BaseButton view="actions" label="Action Log" icon={<ActionsIcon />} />
    </nav>
  );
};

export default AdminSidebar;
