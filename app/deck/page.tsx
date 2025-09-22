'use client';

import { useEffect } from 'react';

export default function DeckRedirect() {
  useEffect(() => {
    // Redirect to the main hub deck page
    window.location.href = 'https://chapter-2-deck.vercel.app/deck';
  }, []);

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center">
        <h1 className="helvetica-h2 mb-4">Redirecting to Deck Generator...</h1>
        <p className="helvetica-body text-white/60">
          Taking you to the SETH VIBE CODING Deck Generator
        </p>
      </div>
    </div>
  );
}