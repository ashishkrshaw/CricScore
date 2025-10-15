import React from 'react';
import { MatchState, PlayerStats } from '../../types';

const sr = (r: number, b: number) => (b > 0 ? ((r / b) * 100).toFixed(2) : '0.00');
const econ = (r: number, o: number, b: number) => {
  const balls = o * 6 + b;
  return balls > 0 ? ((r / balls) * 6).toFixed(2) : '0.00';
};

const nameFmt = (p: PlayerStats) => (p.nickname ? `${p.name} (${p.nickname})` : p.name);

const CricbuzzScorecard: React.FC<{ match: MatchState }> = ({ match }) => {
  const { teamA, teamB, battingTeam, strikerId, nonStrikerId, bowlerId, currentOverHistory } = match;
  const bat = battingTeam === 'teamA' ? teamA : teamB;
  const bowl = battingTeam === 'teamA' ? teamB : teamA;

  const battingRows = bat.players.filter(p => p.isOut || p.ballsFaced > 0 || p.id === strikerId || p.id === nonStrikerId);
  const bowlingRows = bowl.players.filter(p => p.ballsBowled > 0 || p.oversBowled > 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Batting card */}
      <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-md shadow border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">{bat.name} • Batting</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-xs uppercase text-gray-500 dark:text-gray-400">
                <th className="px-4 py-2 text-left">Batsman</th>
                <th className="px-4 py-2 text-center">R</th>
                <th className="px-4 py-2 text-center">B</th>
                <th className="px-4 py-2 text-center">4s</th>
                <th className="px-4 py-2 text-center">6s</th>
                <th className="px-4 py-2 text-center">SR</th>
              </tr>
            </thead>
            <tbody>
              {battingRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">No batting data yet</td>
                </tr>
              )}
              {battingRows.map((p) => {
                const isStriker = p.id === strikerId;
                const isNonStriker = p.id === nonStrikerId;
                const active = isStriker || isNonStriker;
                const status = p.isOut ? 'out' : active ? 'not out' : p.ballsFaced > 0 || p.runs > 0 ? 'not out' : '';
                return (
                  <tr key={p.id} className={`border-t border-gray-100 dark:border-gray-700 ${active ? 'bg-green-50/60 dark:bg-gray-700/40' : ''}`}>
                    <td className="px-4 py-2 text-gray-800 dark:text-gray-100 font-medium">
                      {nameFmt(p)}{isStriker ? '*' : ''}
                      <div className="text-xs text-gray-500 dark:text-gray-400">{status}</div>
                    </td>
                    <td className="px-4 py-2 text-center font-semibold text-gray-900 dark:text-gray-100">{p.runs}</td>
                    <td className="px-4 py-2 text-center">{p.ballsFaced}</td>
                    <td className="px-4 py-2 text-center">{p.fours}</td>
                    <td className="px-4 py-2 text-center">{p.sixes}</td>
                    <td className="px-4 py-2 text-center">{sr(p.runs, p.ballsFaced)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* This Over */}
      <div className="bg-white dark:bg-gray-800 rounded-md shadow border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">This Over</h3>
        </div>
        <div className="p-4">
          {currentOverHistory.length > 0 ? (
            <div className="flex flex-wrap gap-2">
              {currentOverHistory.map((e, i) => {
                const wicket = e === 'W';
                const wide = e === 'wd';
                const nb = e === 'nb';
                const four = e.includes('4');
                const six = e.includes('6');
                let cls = 'bg-gray-200 dark:bg-gray-600 text-gray-900 dark:text-gray-100';
                if (wicket) cls = 'bg-red-600 text-white';
                else if (wide) cls = 'bg-yellow-400 text-black';
                else if (nb) cls = 'bg-amber-500 text-white';
                else if (four) cls = 'bg-blue-600 text-white';
                else if (six) cls = 'bg-green-700 text-white';
                return (
                  <span key={i} className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-xs shadow ${cls}`}>{e}</span>
                );
              })}
            </div>
          ) : (
            <div className="text-gray-500 dark:text-gray-400">Waiting for first ball…</div>
          )}
        </div>
      </div>

      {/* Bowling card */}
      <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-md shadow border border-gray-200 dark:border-gray-700">
        <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h3 className="text-base sm:text-lg font-bold text-gray-800 dark:text-gray-100">{bowl.name} • Bowling</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="text-xs uppercase text-gray-500 dark:text-gray-400">
                <th className="px-4 py-2 text-left">Bowler</th>
                <th className="px-4 py-2 text-center">O</th>
                <th className="px-4 py-2 text-center">R</th>
                <th className="px-4 py-2 text-center">W</th>
                <th className="px-4 py-2 text-center">M</th>
                <th className="px-4 py-2 text-center">Econ</th>
              </tr>
            </thead>
            <tbody>
              {bowlingRows.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-6 text-center text-gray-500 dark:text-gray-400">No bowling yet</td>
                </tr>
              )}
              {bowlingRows.map((p) => (
                <tr key={p.id} className={`border-t border-gray-100 dark:border-gray-700 ${p.id === bowlerId ? 'bg-green-50/60 dark:bg-gray-700/40' : ''}`}>
                  <td className="px-4 py-2 text-gray-800 dark:text-gray-100 font-medium">{nameFmt(p)}{p.id === bowlerId ? '*' : ''}</td>
                  <td className="px-4 py-2 text-center">{p.oversBowled}.{p.ballsBowled}</td>
                  <td className="px-4 py-2 text-center">{p.runsConceded}</td>
                  <td className="px-4 py-2 text-center font-semibold">{p.wicketsTaken}</td>
                  <td className="px-4 py-2 text-center">{p.maidens || 0}</td>
                  <td className="px-4 py-2 text-center">{econ(p.runsConceded, p.oversBowled, p.ballsBowled)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CricbuzzScorecard;
