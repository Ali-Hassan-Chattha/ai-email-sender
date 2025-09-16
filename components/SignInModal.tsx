import React, { useState } from 'react';
import { GoogleIcon } from './icons/GoogleIcon';
import { YahooIcon } from './icons/YahooIcon';
import { OutlookIcon } from './icons/OutlookIcon';
import { MailIcon } from './icons/MailIcon';
import { XMarkIcon } from './icons/XMarkIcon';
import { ArrowLeftIcon } from './icons/ArrowLeftIcon';

interface SignInModalProps {
  onClose: () => void;
  onSignIn: (email: string) => void;
}

const SignInModal: React.FC<SignInModalProps> = ({ onClose, onSignIn }) => {
  const [step, setStep] = useState<'provider' | 'email'>('provider');
  const [email, setEmail] = useState('');

  const handleProviderClick = () => {
    setStep('email');
  };
  
  const handleBack = () => {
    setEmail('');
    setStep('provider');
  };

  const handleSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.includes('@') && email.includes('.')) {
        onSignIn(email);
    } else {
        alert("Please enter a valid email address.");
    }
  };

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      aria-labelledby="modal-title"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div 
        className="relative bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-sm p-8 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <button 
          onClick={onClose} 
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors z-10"
          aria-label="Close"
        >
          <XMarkIcon className="w-6 h-6" />
        </button>
        
        {step === 'email' && (
          <button
            onClick={handleBack}
            className="absolute top-4 left-4 text-slate-400 hover:text-white transition-colors"
            aria-label="Go back"
          >
            <ArrowLeftIcon className="w-6 h-6" />
          </button>
        )}

        {step === 'provider' && (
          <>
            <h2 id="modal-title" className="text-2xl font-bold text-white mb-2">Sign In</h2>
            <p className="text-slate-400 mb-8">Choose your provider to continue</p>
            
            <div className="space-y-4">
              <button onClick={handleProviderClick} className="w-full flex items-center justify-center p-3 bg-slate-700 hover:bg-slate-600/80 border border-slate-600 rounded-lg transition-colors">
                <GoogleIcon className="w-6 h-6 mr-3" />
                <span className="font-semibold">Sign in with Google</span>
              </button>
              <button onClick={handleProviderClick} className="w-full flex items-center justify-center p-3 bg-slate-700 hover:bg-slate-600/80 border border-slate-600 rounded-lg transition-colors">
                <YahooIcon className="w-6 h-6 mr-3" />
                <span className="font-semibold">Sign in with Yahoo</span>
              </button>
              <button onClick={handleProviderClick} className="w-full flex items-center justify-center p-3 bg-slate-700 hover:bg-slate-600/80 border border-slate-600 rounded-lg transition-colors">
                <OutlookIcon className="w-6 h-6 mr-3" />
                <span className="font-semibold">Sign in with Outlook</span>
              </button>
               <button onClick={handleProviderClick} className="w-full flex items-center justify-center p-3 bg-slate-700 hover:bg-slate-600/80 border border-slate-600 rounded-lg transition-colors">
                <MailIcon className="w-6 h-6 mr-3" />
                <span className="font-semibold">Sign in with Email</span>
              </button>
            </div>
          </>
        )}

        {step === 'email' && (
          <>
            <h2 id="modal-title" className="text-2xl font-bold text-white mb-2">Enter Your Email</h2>
            <p className="text-slate-400 mb-8">This will be used as the sender account.</p>
            <form onSubmit={handleSignIn} className="space-y-6 text-left">
              <div>
                <label htmlFor="email-input" className="block mb-2 text-sm font-medium text-slate-300">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-slate-900/70 border border-slate-600 text-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  placeholder="you@example.com"
                  required
                  autoFocus
                />
              </div>
              <button
                type="submit"
                className="w-full px-5 py-3 font-semibold text-white bg-sky-600 rounded-lg shadow-lg hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-800 focus:ring-sky-500 transition-colors"
              >
                Sign In & Continue
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default SignInModal;