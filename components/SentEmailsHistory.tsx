import React from 'react';
import { EmailData } from '../types';
import { InboxStackIcon } from './icons/InboxStackIcon';

interface SentEmailsHistoryProps {
  emails: EmailData[];
}

const SentEmailsHistory: React.FC<SentEmailsHistoryProps> = ({ emails }) => {
  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-6 md:p-8">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
        <InboxStackIcon className="w-7 h-7 mr-3 text-sky-400" />
        Sent History
      </h2>
      {emails.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-full text-center text-slate-500 py-16">
          <InboxStackIcon className="w-16 h-16 mb-4" />
          <p className="text-lg font-semibold">No emails sent yet.</p>
          <p className="mt-1">Your sent emails will appear here.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[70vh] overflow-y-auto pr-2">
          {emails.map((email, index) => (
            <div key={index} className="bg-slate-900/70 border border-slate-700 rounded-lg p-4 animate-fade-in">
              <h3 className="font-semibold text-slate-200 truncate">{email.subject}</h3>
              <p className="text-sm text-slate-400 mt-1 line-clamp-2">{email.body}</p>
              <div className="text-right text-xs text-sky-400 mt-3 font-mono">
                Sent to {email.recipients.length} recipient(s)
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SentEmailsHistory;

// Add this to your global CSS or in a <style> tag in index.html if you don't have a CSS file
const style = document.createElement('style');
style.textContent = `
  @keyframes fade-in {
    from { opacity: 0; transform: translateY(-10px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fade-in 0.5s ease-out forwards;
  }
  .line-clamp-2 {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;  
    overflow: hidden;
  }
`;
document.head.append(style);
