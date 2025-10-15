import React from 'react';
import { MatchState } from '../../types';

const oversFmt = (o: number, b: number) => `${o}${b === 0 ? '' : `.${b}`}`;

const CricbuzzHeader: React.FC<{ match: MatchState }> = ({ match }) => {
  const { teamA, teamB, battingTeam, totalOvers, targetScore, currentInning } = match;
  const bat = battingTeam === 'teamA' ? teamA : teamB;
  const bowl = battingTeam === 'teamA' ? teamB : teamA;

  const ballsFaced = bat.overs * 6 + bat.balls;
  const rr = ballsFaced > 0 ? ((bat.score / ballsFaced) * 6) : 0;

  let rrrDisplay: string | null = null;
  if (currentInning === 2 && targetScore > 0) {
    const ballsLeft = totalOvers * 6 - ballsFaced;
    const runsNeeded = targetScore - bat.score;
    if (ballsLeft > 0 && runsNeeded > 0) {
      const rrr = (runsNeeded / ballsLeft) * 6;
      rrrDisplay = rrr.toFixed(2);
    }
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-md shadow border border-gray-200 dark:border-gray-700 p-4 sm:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div className="min-w-0">
          <div className="text-xs uppercase tracking-wide text-gray-500 dark:text-gray-400">Live</div>
          <div className="text-xl sm:text-2xl font-extrabold text-gray-900 dark:text-gray-100 truncate">{bat.name} {bat.score}/{bat.wickets} ({oversFmt(bat.overs, bat.balls)}/{totalOvers > 0 ? totalOvers : '—'})</div>
          <div className="text-sm text-gray-600 dark:text-gray-300 truncate">vs {bowl.name}</div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-xs text-gray-500 dark:text-gray-400">CRR</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{rr.toFixed(2)}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 dark:text-gray-400">Target</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{targetScore > 0 ? targetScore : '—'}</div>
          </div>
          <div className="text-right">
            <div className="text-xs text-gray-500 dark:text-gray-400">RRR</div>
            <div className="text-lg font-semibold text-gray-900 dark:text-gray-100">{rrrDisplay ?? '—'}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CricbuzzHeader;
