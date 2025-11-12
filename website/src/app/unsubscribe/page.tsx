'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function UnsubscribePage() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');

  const email = searchParams.get('email');
  const leadId = searchParams.get('lead_id');

  useEffect(() => {
    if (!email) {
      setStatus('error');
      setMessage('E-Mail-Adresse fehlt.');
      return;
    }

    const unsubscribe = async () => {
      try {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
        const response = await fetch(`${apiUrl}/api/leads/unsubscribe`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            email: email,
            ...(leadId && { lead_id: leadId }),
          }),
        });

        const data = await response.json();

        if (data.success) {
          setStatus('success');
          setMessage(data.message || 'Du wurdest erfolgreich von unseren E-Mails abgemeldet.');
        } else {
          setStatus('error');
          setMessage('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
        }
      } catch (error) {
        setStatus('error');
        setMessage('Ein Fehler ist aufgetreten. Bitte versuche es später erneut.');
      }
    };

    unsubscribe();
  }, [email, leadId]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-orange-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Abmeldung wird verarbeitet...
              </h1>
              <p className="text-gray-600">
                Bitte warte einen Moment.
              </p>
            </>
          )}

          {status === 'success' && (
            <>
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-green-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Erfolgreich abgemeldet
              </h1>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <Link
                href="/"
                className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
              >
                Zur Startseite
              </Link>
            </>
          )}

          {status === 'error' && (
            <>
              <div className="mb-4">
                <svg
                  className="mx-auto h-12 w-12 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">
                Fehler
              </h1>
              <p className="text-gray-600 mb-6">
                {message}
              </p>
              <div className="space-y-3">
                <Link
                  href="/contact"
                  className="block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors text-center"
                >
                  Kontakt aufnehmen
                </Link>
                <Link
                  href="/"
                  className="block text-gray-600 hover:text-gray-900 text-center"
                >
                  Zur Startseite
                </Link>
              </div>
            </>
          )}
        </div>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 text-center">
            Falls du Fragen hast oder Hilfe benötigst, kontaktiere uns gerne unter{' '}
            <a href="mailto:info@g3crossfit.de" className="text-green-600 hover:underline">
              info@g3crossfit.de
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

