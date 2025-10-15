import React, { useState, useEffect, useRef, useContext } from 'react';
import Confetti from 'react-confetti';
import { MatchState, MatchStatus, PlayerStats } from '../types';
import { useLanguage } from './LanguageContext';
import OverProgressRing from './common/OverProgressRing';
import { AppContext } from '../App';

interface ScoreboardProps {
  match: MatchState;
}

const usePrevious = <T,>(value: T) => {
  const ref = useRef<T>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const formatPlayerName = (player: PlayerStats) => {
    if (player.nickname) {
        return `${player.name} (${player.nickname})`;
    }
    return player.name;
};

const Scoreboard: React.FC<ScoreboardProps> = ({ match }) => {
  const { t } = useLanguage();
  const { settings } = useContext(AppContext);
  const { teamA, teamB, battingTeam, status, scheduledTime, tossWinner, choseTo, totalOvers, strikerId, nonStrikerId, bowlerId, targetScore, currentInning, resultMessage, isPaused } = match;

  const [showConfetti, setShowConfetti] = useState(false);
  const prevMatchState = usePrevious(match);

  useEffect(() => {
    if (prevMatchState) {
      const battingTeamData = battingTeam === 'teamA' ? teamA : teamB;
      const prevBattingTeamData = battingTeam === 'teamA' ? prevMatchState.teamA : prevMatchState.teamB;

      const scoreDiff = battingTeamData.score - prevBattingTeamData.score;
      const wicketsDiff = battingTeamData.wickets - prevBattingTeamData.wickets;

      if (scoreDiff === 4 || scoreDiff === 6 || wicketsDiff > 0) {
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);
      }
    }
  }, [match]);

  const battingTeamData = battingTeam === 'teamA' ? teamA : teamB;
  const bowlingTeamData = battingTeam === 'teamA' ? teamB : teamA;

  const striker = battingTeamData.players.find(p => p.id === strikerId);
  const nonStriker = battingTeamData.players.find(p => p.id === nonStrikerId);
  const bowler = bowlingTeamData.players.find(p => p.id === bowlerId);


  const formatOvers = (overs: number, balls: number) => `${overs}.${balls}`;

  const calculateRunRate = (score: number, overs: number, balls: number) => {
    const totalBalls = overs * 6 + balls;
    if (totalBalls === 0) return '0.00';
    return ((score / totalBalls) * 6).toFixed(2);
  };
  
  const getMatchStatus = () => {
    if (isPaused) {
        return { message: t('scoreboard.matchPaused'), color: "text-paused-yellow" };
    }
    if (status === MatchStatus.SUSPENDED) {
      return { message: t('scoreboard.matchSuspended'), color: "text-suspended-orange" };
    }
    if (status === MatchStatus.FINISHED) {
        return { message: resultMessage || t('scoreboard.matchFinished'), color: "text-classic-blue" };
    }
    if (status === MatchStatus.NOT_STARTED) {
        const date = new Date(scheduledTime);
        if(!scheduledTime) return { message: t('scoreboard.matchNotScheduled'), color: "text-gray-600 dark:text-gray-400" };
        return { message: `${t('scoreboard.matchStartsAt')} ${date.toLocaleTimeString()} ${t('scoreboard.on')} ${date.toLocaleDateString()}`, color: "text-gray-600 dark:text-gray-400" };
    }
    
    if (currentInning === 2) {
        const runsNeeded = targetScore - battingTeamData.score;
        const totalBallsRemaining = (totalOvers * 6) - (battingTeamData.overs * 6 + battingTeamData.balls);
        if (runsNeeded > 0 && totalBallsRemaining > 0) {
          return { message: `${battingTeamData.name} ${t('scoreboard.needRunsInBalls', { runsNeeded, totalBallsRemaining })}`, color: "text-dark-green dark:text-green-400" };
        }
    }

    if (tossWinner && status !== 'In Progress') {
        const winnerName = tossWinner === 'teamA' ? teamA.name : teamB.name;
        return { message: t('scoreboard.wonTossChoseTo', { winnerName, choseTo }), color: "text-gray-600 dark:text-gray-400" };
    }

    return { message: t('scoreboard.isBatting', { battingTeamName: battingTeamData.name }), color: "text-dark-green dark:text-green-400" };
  }

  const { message, color } = getMatchStatus();
  const isTeamHighlightActive = status === MatchStatus.IN_PROGRESS && !isPaused;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-2 sm:p-4 border border-medium-gray dark:border-gray-700">
  {showConfetti && settings?.confetti && <Confetti />}
      <div className="text-center mb-2 sm:mb-4">
        <p className={`font-bold text-sm sm:text-base ${color}`}>{message}</p>
      </div>
      
      <div className="flex justify-between items-center text-center">
        {/* Team A */}
        <div className="w-2/5">
          <h2 className="text-base sm:text-xl font-bold text-dark-gray dark:text-gray-200 truncate">{teamA.name}</h2>
          <p className="text-xl sm:text-3xl font-extrabold text-black dark:text-white my-1">
            {teamA.score} - {teamA.wickets}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
            ({formatOvers(teamA.overs, teamA.balls)} / {totalOvers > 0 ? totalOvers : 'N/A'})
          </p>
        </div>
        
        {/* VS */}
        <div className="w-1/5 text-lg sm:text-2xl font-bold text-gray-400 dark:text-gray-500">
          {t('scoreboard.vs')}
        </div>

        {/* Team B */}
        <div className="w-2/5">
          <h2 className="text-base sm:text-xl font-bold text-dark-gray dark:text-gray-200 truncate">{teamB.name}</h2>
           <p className="text-xl sm:text-3xl font-extrabold text-black dark:text-white my-1">
            {teamB.score} - {teamB.wickets}
          </p>
          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 font-medium">
            ({formatOvers(teamB.overs, teamB.balls)} / {totalOvers > 0 ? totalOvers : 'N/A'})
          </p>
        </div>
      </div>
      
       {status === 'In Progress' && (
        <>
            <div className="mt-4 sm:mt-6 pt-4 border-t border-medium-gray dark:border-gray-700 flex flex-col sm:flex-row justify-around text-center gap-4 sm:gap-0">
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('scoreboard.batting')}</p>
                    <p className="font-bold text-lg text-dark-gray dark:text-gray-200">{battingTeamData.name}</p>
                </div>
                <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('scoreboard.runRate')}</p>
                    <p className="font-bold text-lg text-classic-green">{calculateRunRate(battingTeamData.score, battingTeamData.overs, battingTeamData.balls)}</p>
                </div>
                {targetScore > 0 && <div>
                     <p className="text-sm text-gray-500 dark:text-gray-400">{t('scoreboard.target')}</p>
                    <p className="font-bold text-lg text-classic-blue">{targetScore}</p>
                </div>}
            </div>
             <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700 flex flex-col sm:flex-row justify-around text-center gap-4 sm:gap-0">
                 <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('scoreboard.striker')}</p>
                    <p className="font-bold text-md text-dark-gray dark:text-gray-200">{striker ? formatPlayerName(striker) : 'N/A'}*</p>
                </div>
                 <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('scoreboard.nonStriker')}</p>
                    <p className="font-bold text-md text-dark-gray dark:text-gray-200">{nonStriker ? formatPlayerName(nonStriker) : 'N/A'}</p>
                </div>
                 <div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{t('scoreboard.bowler')}</p>
                    <p className="font-bold text-md text-dark-gray dark:text-gray-200">{bowler ? `${formatPlayerName(bowler)} ${bowler.oversBowled}.${bowler.ballsBowled} (${bowler.wicketsTaken}/${bowler.runsConceded}) M:${bowler.maidens || 0}` : 'N/A'}</p>
                </div>
        <div className="flex items-center justify-center">
          <OverProgressRing ballsBowled={battingTeamData.balls} />
        </div>
            </div>
        </>
       )}
    </div>
  );
};

export default Scoreboard;