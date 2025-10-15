import React, { useState } from 'react';
import { MatchState } from '../../types';
import CricbuzzScorecard from './CricbuzzScorecard';
import LiveCommentary from '../common/LiveCommentary';
import PlayerStatsView from '../common/PlayerStatsView';

const TabButton: React.FC<{ active: boolean; onClick: () => void; children: React.ReactNode }> = ({ active, onClick, children }) => (
  <button
    onClick={onClick}
    className={`px-4 py-2 text-sm font-semibold rounded-md border ${active ? 'bg-classic-green text-white border-classic-green' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
  >
    {children}
  </button>
);

const CricbuzzTabs: React.FC<{ match: MatchState }> = ({ match }) => {
  const [tab, setTab] = useState<'scorecard' | 'stats'>('scorecard');
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <TabButton active={tab === 'scorecard'} onClick={() => setTab('scorecard')}>Scorecard</TabButton>
        <TabButton active={tab === 'stats'} onClick={() => setTab('stats')}>Stats</TabButton>
      </div>
      <div>
        {tab === 'scorecard' && <CricbuzzScorecard match={match} />}
        {tab === 'stats' && <PlayerStatsView match={match} />}
      </div>
    </div>
  );
};

export default CricbuzzTabs;
