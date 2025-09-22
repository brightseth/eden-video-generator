'use client';

import React from 'react';
import { Film, Home, FileText, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function HubPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-white/10 px-6 py-8">
        <div className="text-center">
          <h1 className="helvetica-h1 text-white mb-4">SETH VIBE CODING</h1>
          <p className="helvetica-h3 text-white/60">Creative Tools for Eden Ecosystem</p>
        </div>
      </div>

      {/* Tools Grid */}
      <div className="max-w-6xl mx-auto px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Video Generator */}
          <Link href="/" className="block group">
            <div className="border border-white/20 rounded-lg p-8 hover:bg-white/5 transition-all">
              <Film className="w-12 h-12 mb-4 text-white/60 group-hover:text-white" />
              <h3 className="helvetica-h3 text-white mb-2">VIDEO GENERATOR</h3>
              <p className="helvetica-body text-white/60 mb-4">
                Dual-mode AI video creation with Director Mode (4-10s clips) and Manual Mode (30-60s videos)
              </p>
              <div className="flex items-center gap-2 text-white/40 group-hover:text-white/60">
                <span className="helvetica-micro">LAUNCH TOOL</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </Link>

          {/* Deck Generator */}
          <a href="https://chapter-2-deck.vercel.app/deck" target="_blank" rel="noopener noreferrer" className="block group">
            <div className="border border-white/20 rounded-lg p-8 hover:bg-white/5 transition-all">
              <FileText className="w-12 h-12 mb-4 text-white/60 group-hover:text-white" />
              <h3 className="helvetica-h3 text-white mb-2">DECK GENERATOR</h3>
              <p className="helvetica-body text-white/60 mb-4">
                AI agents creating professional pitch decks with Eden Sessions and Gamma API
              </p>
              <div className="flex items-center gap-2 text-white/40 group-hover:text-white/60">
                <span className="helvetica-micro">LAUNCH TOOL</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </a>

          {/* Main Hub */}
          <a href="https://chapter-2-deck.vercel.app" target="_blank" rel="noopener noreferrer" className="block group">
            <div className="border border-white/20 rounded-lg p-8 hover:bg-white/5 transition-all">
              <Home className="w-12 h-12 mb-4 text-white/60 group-hover:text-white" />
              <h3 className="helvetica-h3 text-white mb-2">MAIN HUB</h3>
              <p className="helvetica-body text-white/60 mb-4">
                Complete overview of all SETH VIBE CODING creative tools and technical architecture
              </p>
              <div className="flex items-center gap-2 text-white/40 group-hover:text-white/60">
                <span className="helvetica-micro">VIEW HUB</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </a>

          {/* Vibe Codings (if exists) */}
          <a href="https://vibecodings.vercel.app" target="_blank" rel="noopener noreferrer" className="block group">
            <div className="border border-white/20 rounded-lg p-8 hover:bg-white/5 transition-all opacity-50">
              <div className="w-12 h-12 mb-4 text-white/30 flex items-center justify-center">
                <span className="text-2xl">🎨</span>
              </div>
              <h3 className="helvetica-h3 text-white/50 mb-2">VIBE CODINGS</h3>
              <p className="helvetica-body text-white/30 mb-4">
                Additional creative tools (if available)
              </p>
              <div className="flex items-center gap-2 text-white/20">
                <span className="helvetica-micro">CHECK AVAILABILITY</span>
                <ArrowRight className="w-4 h-4" />
              </div>
            </div>
          </a>
        </div>

        {/* Navigation Links */}
        <div className="mt-16 pt-16 border-t border-white/10">
          <h3 className="helvetica-h3 text-white mb-8">Quick Navigation</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/director" className="helvetica-micro text-white/60 hover:text-white">
              → DIRECTOR MODE
            </Link>
            <Link href="/manual" className="helvetica-micro text-white/60 hover:text-white">
              → MANUAL MODE
            </Link>
            <a href="https://chapter-2-deck.vercel.app/deck" className="helvetica-micro text-white/60 hover:text-white">
              → DECK GENERATOR
            </a>
            <a href="https://chapter-2-deck.vercel.app" className="helvetica-micro text-white/60 hover:text-white">
              → MAIN HUB
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}