import React, { useState } from 'react';
import { DEFAULT_ADMIN_USERNAME, DEFAULT_ADMIN_PASSWORD, ADMIN_ACTION_PASSWORD } from '../constants';

interface LoginScreenProps {
  onAdminLogin: () => void;
  onViewerLogin: (name: string) => void;
  onCommentatorLogin?: (name: string) => void;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onAdminLogin, onViewerLogin, onCommentatorLogin }) => {
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [showCommentator, setShowCommentator] = useState(false);

  // Admin state
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  // Viewer state
  const [viewerName, setViewerName] = useState('');
  const [viewerError, setViewerError] = useState('');

  // Commentator state
  const [commentatorName, setCommentatorName] = useState('');
  const [commentatorPass, setCommentatorPass] = useState('');
  const [commentatorError, setCommentatorError] = useState('');

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === DEFAULT_ADMIN_USERNAME && password === DEFAULT_ADMIN_PASSWORD) {
      setAdminError('');
      onAdminLogin();
    } else {
      setAdminError('Invalid username or password.');
    }
  };

  const handleViewerJoin = (e: React.FormEvent) => {
    e.preventDefault();
    let nameToUse = viewerName.trim();
    if (!nameToUse) {
      try{
        const saved = localStorage.getItem('viewerName');
        if(saved) nameToUse = saved;
      }catch{}
      if(!nameToUse){
        nameToUse = 'Viewer-' + Math.random().toString(36).substring(2, 6).toUpperCase();
      }
    }
    setViewerError('');
    onViewerLogin(nameToUse);
  };

  const handleCommentatorJoin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!onCommentatorLogin) return;
    const name = commentatorName.trim() || 'Commentator';
    if (commentatorPass !== ADMIN_ACTION_PASSWORD) {
      setCommentatorError('Invalid passcode for commentator.');
      return;
    }
    setCommentatorError('');
    onCommentatorLogin(name);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative">
        <div className="absolute top-6 right-6 flex gap-2">
          <button
            onClick={() => { setShowAdminLogin(false); setShowCommentator(false); }}
            className={`font-semibold transition-colors duration-300 py-2 px-3 rounded ${(!showAdminLogin && !showCommentator) ? 'bg-classic-blue text-white' : 'text-classic-blue hover:underline dark:text-blue-400'}`}
            aria-label="Switch to viewer join form"
          >Viewer</button>
          <button
            onClick={() => { setShowAdminLogin(true); setShowCommentator(false); }}
            className={`font-semibold transition-colors duration-300 py-2 px-3 rounded ${showAdminLogin ? 'bg-classic-blue text-white' : 'text-classic-blue hover:underline dark:text-blue-400'}`}
            aria-label="Switch to admin login form"
          >Admin</button>
          <button
            onClick={() => { setShowAdminLogin(false); setShowCommentator(true); }}
            className={`font-semibold transition-colors duration-300 py-2 px-3 rounded ${showCommentator ? 'bg-classic-blue text-white' : 'text-classic-blue hover:underline dark:text-blue-400'}`}
            aria-label="Switch to commentator login form"
          >Commentator</button>
        </div>

      <div className="w-full max-w-md mx-auto">
        <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-classic-green mb-2">Welcome to CricScore!</h1>
            <p className="text-gray-600 dark:text-gray-400">
                This app simplifies cricket tournament management and delivers real-time live match updates.
            </p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-medium-gray dark:border-gray-700">
          <div className="p-8">
            {!showAdminLogin && !showCommentator ? (
              <form onSubmit={handleViewerJoin} className="space-y-6">
                <h2 className="text-2xl font-bold text-center text-dark-gray dark:text-gray-200">Join Scoreboard</h2>
                <div>
                  <label htmlFor="viewerName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Your Name</label>
                  <input
                    id="viewerName"
                    type="text"
                    value={viewerName}
                    onChange={(e) => setViewerName(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-medium-gray dark:border-gray-600 rounded-md text-dark-gray dark:text-gray-200 focus:ring-2 focus:ring-classic-green focus:outline-none"
                    placeholder="Enter your name"
                  />
                </div>
                {viewerError && <p className="text-red-500 text-sm text-center">{viewerError}</p>}
                <div className="flex flex-col sm:flex-row gap-3">
                  <button type="submit" className="flex-1 bg-classic-green text-white font-bold py-3 rounded-md hover:bg-dark-green transition-all duration-300">
                    Watch Live
                  </button>
                  <button type="button" onClick={(e) => { e.preventDefault(); setViewerName(''); setViewerError(''); onViewerLogin('Viewer'); }} className="flex-1 bg-classic-blue text-white font-bold py-3 rounded-md hover:bg-blue-700 transition-all duration-300">
                    Quick Join
                  </button>
                </div>
              </form>
            ) : showAdminLogin ? (
              <form onSubmit={handleAdminLogin} className="space-y-6">
                 <h2 className="text-2xl font-bold text-center text-dark-gray dark:text-gray-200">Admin Login</h2>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Username</label>
                  <input
                    id="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-medium-gray dark:border-gray-600 rounded-md text-dark-gray dark:text-gray-200 focus:ring-2 focus:ring-classic-green focus:outline-none"
                    placeholder="username"
                  />
                </div>
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Password</label>
                  <input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-medium-gray dark:border-gray-600 rounded-md text-dark-gray dark:text-gray-200 focus:ring-2 focus:ring-classic-green focus:outline-none"
                    placeholder="••••••••"
                  />
                </div>
                {adminError && <p className="text-red-500 text-sm text-center">{adminError}</p>}
                <button type="submit" className="w-full bg-classic-green text-white font-bold py-3 rounded-md hover:bg-dark-green transition-all duration-300">
                  Login
                </button>
              </form>
            ) : (
              <form onSubmit={handleCommentatorJoin} className="space-y-6">
                <h2 className="text-2xl font-bold text-center text-dark-gray dark:text-gray-200">Commentator Login</h2>
                <div>
                  <label htmlFor="commentatorName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Display Name</label>
                  <input
                    id="commentatorName"
                    type="text"
                    value={commentatorName}
                    onChange={(e) => setCommentatorName(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-medium-gray dark:border-gray-600 rounded-md text-dark-gray dark:text-gray-200 focus:ring-2 focus:ring-classic-green focus:outline-none"
                    placeholder="e.g. Harsha Bhogle"
                  />
                </div>
                <div>
                  <label htmlFor="commentatorPass" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Passcode</label>
                  <input
                    id="commentatorPass"
                    type="password"
                    value={commentatorPass}
                    onChange={(e) => setCommentatorPass(e.target.value)}
                    className="w-full px-4 py-2 bg-white dark:bg-gray-700 border border-medium-gray dark:border-gray-600 rounded-md text-dark-gray dark:text-gray-200 focus:ring-2 focus:ring-classic-green focus:outline-none"
                    placeholder="••••••"
                  />
                </div>
                {commentatorError && <p className="text-red-500 text-sm text-center">{commentatorError}</p>}
                <button type="submit" className="w-full bg-classic-green text-white font-bold py-3 rounded-md hover:bg-dark-green transition-all duration-300">
                  Join as Commentator
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

       <div className="absolute bottom-4 left-0 right-0 text-center px-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">
                This app is created by Ashish Kumar Shaw. It is an open-source project, and developers can contribute to and improve it.
            </p>
        </div>
    </div>
  );
};

export default LoginScreen;