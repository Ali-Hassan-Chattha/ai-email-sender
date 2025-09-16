import React, { useState } from 'react';
import EmailComposer from './components/EmailComposer';
import SignInModal from './components/SignInModal';
import { UserCircleIcon } from './components/icons/UserCircleIcon';
import SentEmailsHistory from './components/SentEmailsHistory';
import { EmailData } from './types';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [sentEmails, setSentEmails] = useState<EmailData[]>([]);


  const handleSignInSuccess = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setShowSignInModal(false);
  };

  const handleSignOut = () => {
    setIsLoggedIn(false);
    setUserEmail(null);
    setSentEmails([]); // Clear history on sign out
  };

  const handleEmailSent = (email: EmailData) => {
    setSentEmails(prevEmails => [email, ...prevEmails]);
  };


  return (
    <div className="min-h-screen flex flex-col items-center p-4 lg:p-8 bg-slate-900 font-sans">
      {showSignInModal && <SignInModal onClose={() => setShowSignInModal(false)} onSignIn={handleSignInSuccess} />}
      <div className="w-full max-w-7xl mx-auto">
        <header className="flex justify-between items-center text-center mb-8">
          <div className="text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-sky-400 to-blue-600">
              AI Bulk Email Sender
            </h1>
            <p className="text-slate-400 mt-2 text-lg">
              Compose and send emails with AI confirmation.
            </p>
          </div>
          <div>
            {isLoggedIn && userEmail ? (
               <div className="flex items-center space-x-4">
                 <div className="flex items-center space-x-3">
                    <UserCircleIcon className="w-10 h-10 text-slate-400" />
                    <span className="text-slate-300 font-medium hidden md:block">{userEmail}</span>
                 </div>
                 <button 
                  onClick={handleSignOut}
                  className="px-4 py-2 text-sm font-semibold bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
                 >
                   Sign Out
                 </button>
               </div>
            ) : (
              <button 
                onClick={() => setShowSignInModal(true)}
                className="px-5 py-2 font-semibold text-white bg-sky-600 rounded-lg shadow-lg hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-colors"
              >
                Sign In
              </button>
            )}
          </div>
        </header>
        <main className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <EmailComposer 
            isLocked={!isLoggedIn} 
            userEmail={userEmail}
            onEmailSent={handleEmailSent}
          />
          <SentEmailsHistory emails={sentEmails} />
        </main>
        <footer className="text-center mt-8 text-slate-500 text-sm">
          <p>Powered by Gemini API. This is a simulation. Emails are not actually sent from your account.</p>
        </footer>
      </div>
    </div>
  );
};

export default App;