import React, { useContext, useState } from 'react';
import { AppContext } from '../../App';
import Header from '../Header';
import Scoreboard from '../Scoreboard';
import PlayerStatsView from '../common/PlayerStatsView';
import * as client from '../../websocket-client';

const CommentatorDashboard: React.FC = () => {
  const { serverState } = useContext(AppContext);
  const { match } = serverState;
  const [text, setText] = useState('');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const v = text.trim();
    if (!v) return;
    client.addCommentary({ text: v });
    setText('');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header showLogout={true} />
      <main className="container mx-auto p-4 md:p-8 flex-grow">
        {/* Cricbuzz-like layout: left scoreboard, right panel for input */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-medium-gray dark:border-gray-700">
              <div className="p-4 sm:p-6">
                <Scoreboard match={match} />
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-medium-gray dark:border-gray-700">
              <div className="p-4 sm:p-6">
                <PlayerStatsView match={match} />
              </div>
            </div>
          </div>
          <aside className="lg:col-span-1">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md border border-medium-gray dark:border-gray-700 sticky top-4">
              <div className="p-4 sm:p-6">
                <h2 className="text-xl font-bold text-dark-gray dark:text-gray-200 mb-4">Add Commentary</h2>
                <form onSubmit={submit} className="space-y-3">
                  <textarea
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={4}
                    className="w-full bg-white dark:bg-gray-700 border border-medium-gray dark:border-gray-600 rounded-md p-3 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-classic-green"
                    placeholder="Type ball-by-ball commentary..."
                  />
                  <button
                    type="submit"
                    className="w-full bg-classic-green hover:bg-dark-green text-white font-semibold py-2.5 rounded-md transition-colors"
                  >
                    Post Commentary
                  </button>
                </form>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
};

export default CommentatorDashboard;
