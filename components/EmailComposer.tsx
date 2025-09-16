import React, { useState, useCallback } from 'react';
import { generateRecipients, sendEmail } from '../services/emailService';
import { Feedback, EmailData } from '../types';
import { PaperAirplaneIcon } from './icons/PaperAirplaneIcon';
import { CheckCircleIcon } from './icons/CheckCircleIcon';
import { XCircleIcon } from './icons/XCircleIcon';

interface EmailComposerProps {
  isLocked: boolean;
  userEmail: string | null;
  onEmailSent: (emailData: EmailData) => void;
}

const EmailComposer: React.FC<EmailComposerProps> = ({ isLocked, userEmail, onEmailSent }) => {
  const [numberOfRecipients, setNumberOfRecipients] = useState('5');
  const [location, setLocation] = useState('');
  const [subject, setSubject] = useState('');
  const [body, setBody] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<Feedback | null>(null);

  const clearForm = useCallback(() => {
    setSubject('');
    setBody('');
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (isLocked || !userEmail) {
        setFeedback({ type: 'error', message: 'You must be signed in to send an email.' });
        return;
    }
    setFeedback(null);

    const recipientCount = parseInt(numberOfRecipients, 10);

    if (isNaN(recipientCount) || recipientCount <= 0 || !subject || !body) {
      setFeedback({ type: 'error', message: 'Please provide a valid number of recipients and fill in the subject and message.' });
      return;
    }

    setIsLoading(true);

    try {
      const recipientList = await generateRecipients(recipientCount, location);
      if (recipientList.length === 0) {
        throw new Error("AI failed to generate any recipients. Please try again.");
      }

      const emailData = { recipients: recipientList, subject, body };
      const result = await sendEmail(emailData, userEmail);

      if (result.success) {
        setFeedback({ type: 'success', message: `${result.message} Sent to ${result.sentTo.length} AI-generated recipient(s).` });
        onEmailSent(emailData);
        clearForm();
      } else {
        setFeedback({ type: 'error', message: result.message });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred.';
      setFeedback({ type: 'error', message: `Submission failed: ${errorMessage}` });
    } finally {
      setIsLoading(false);
    }
  };

  const isDisabled = isLoading || isLocked;

  return (
    <div className="relative bg-slate-800/50 backdrop-blur-sm border border-slate-700 rounded-2xl shadow-2xl p-6 md:p-8 h-fit">
      {isLocked && (
        <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10">
          <p className="text-xl font-semibold text-slate-300">Please sign in to compose an email.</p>
        </div>
      )}
      {feedback && (
        <div 
          className={`flex items-center p-4 mb-6 rounded-lg ${feedback.type === 'success' ? 'bg-green-900/50 text-green-300 border border-green-700' : 'bg-red-900/50 text-red-300 border border-red-700'}`}
          role="alert"
        >
          {feedback.type === 'success' ? <CheckCircleIcon className="w-6 h-6 mr-3" /> : <XCircleIcon className="w-6 h-6 mr-3" />}
          <span className="font-medium">{feedback.message}</span>
          <button onClick={() => setFeedback(null)} className="ml-auto -mx-1.5 -my-1.5 p-1.5 rounded-full hover:bg-white/10 transition-colors">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex flex-col md:flex-row md:space-x-4">
          <div className="flex-1">
            <label htmlFor="numberOfRecipients" className="block mb-2 text-sm font-medium text-slate-300">
              Number of AI-Generated Recipients
            </label>
            <input
              type="number"
              id="numberOfRecipients"
              value={numberOfRecipients}
              onChange={(e) => setNumberOfRecipients(e.target.value)}
              className="w-full bg-slate-900/70 border border-slate-600 text-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition disabled:opacity-50"
              placeholder="e.g., 5"
              min="1"
              disabled={isDisabled}
            />
          </div>
          <div className="flex-1 mt-6 md:mt-0">
            <label htmlFor="location" className="block mb-2 text-sm font-medium text-slate-300">
              Location (Optional)
            </label>
            <input
              type="text"
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-slate-900/70 border border-slate-600 text-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition disabled:opacity-50"
              placeholder="e.g., Paris, France"
              disabled={isDisabled}
            />
          </div>
        </div>
        <div>
          <label htmlFor="subject" className="block mb-2 text-sm font-medium text-slate-300">
            Subject
          </label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            className="w-full bg-slate-900/70 border border-slate-600 text-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition disabled:opacity-50"
            placeholder="Regarding our meeting..."
            disabled={isDisabled}
          />
        </div>
        <div>
          <label htmlFor="body" className="block mb-2 text-sm font-medium text-slate-300">
            Message
          </label>
          <textarea
            id="body"
            rows={10}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            className="w-full bg-slate-900/70 border border-slate-600 text-slate-200 rounded-lg p-3 focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition disabled:opacity-50"
            placeholder="Compose your email here..."
            disabled={isDisabled}
          />
        </div>
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isDisabled}
            className="inline-flex items-center justify-center px-6 py-3 font-semibold text-white bg-sky-600 rounded-lg shadow-lg hover:bg-sky-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 focus:ring-sky-500 transition-all duration-300 disabled:bg-slate-600 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending...
              </>
            ) : (
              <>
                Send Email
                <PaperAirplaneIcon className="w-5 h-5 ml-2" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EmailComposer;