import React, { useContext } from 'react';
import { AppContext } from '../../App';
import Header from '../Header';
import CricbuzzHeader from './CricbuzzHeader';
import { MatchStatus } from '../../types';
import PlayerStatsView from '../common/PlayerStatsView';
import LiveCommentary from '../common/LiveCommentary';
import CricbuzzTabs from './CricbuzzTabs';
import ConfettiOverlay from '../common/ConfettiOverlay';
import EventSounds from '../common/EventSounds';
import { useLanguage } from '../LanguageContext';

const EmailIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M1.5 8.67v8.58a3 3 0 003 3h15a3 3 0 003-3V8.67l-8.928 5.493a3 3 0 01-3.144 0L1.5 8.67z" />
        <path d="M22.5 6.908V6.75a3 3 0 00-3-3h-15a3 3 0 00-3 3v.158l9.714 5.978a1.5 1.5 0 001.572 0L22.5 6.908z" />
    </svg>
);

const ViewerScoreboard: React.FC = () => {
    const { serverState, settings } = useContext(AppContext);
  const { match } = serverState;
  const { t } = useLanguage();
  const battingTeamData = match.battingTeam === 'teamA' ? match.teamA : match.teamB;

  const runsNeeded = match.targetScore - battingTeamData.score;
  const ballsRemaining = (match.totalOvers * 6) - (battingTeamData.overs * 6 + battingTeamData.balls);

    return (
        <div className="min-h-screen flex flex-col">
            {settings.confetti && <ConfettiOverlay match={match} />}
            <EventSounds match={match} enabled={settings.sounds} />
            <Header showLogout={true} />
            <main className="container mx-auto p-4 md:p-8 flex-grow">
                <div className="grid grid-cols-1 gap-6">
                    <div>
                        <CricbuzzHeader match={match} />
                    </div>
                    <div>
                        {/* Integrated scrolling commentary box below header */}
                        <LiveCommentary />
                    </div>
                                <div>
                                    {/* Scorecard and stats below commentary */}
                                    <CricbuzzTabs match={match} />
                                </div>
                </div>
            </main>
            <a
                href="mailto:admisure215@gmail.com?subject=Feedback for CricScore Scoreboard"
                className="fixed bottom-5 right-5 bg-classic-blue text-white font-bold py-3 px-5 rounded-full shadow-lg hover:bg-blue-700 transition-all duration-300 z-50 flex items-center gap-2"
                target="_blank"
                rel="noopener noreferrer"
                title={t('viewerScoreboard.sendFeedback')}
            >
                <EmailIcon className="w-5 h-5" />
                <span className="hidden sm:inline">{t('viewerScoreboard.sendFeedback')}</span>
            </a>
        </div>
    );
};

export default ViewerScoreboard;