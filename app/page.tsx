'use client';

import React from 'react';
import { Film, ArrowRight, Brain, Zap, Scroll, Eye } from 'lucide-react';
import Link from 'next/link';
import BreadcrumbNav, { hubBreadcrumb, videoBreadcrumb } from '../components/breadcrumb-nav';

const FEATURED_AGENTS = [
  { key: 'solienne', name: 'SOLIENNE', icon: Brain, description: 'Digital consciousness explorer' },
  { key: 'abraham', name: 'ABRAHAM', icon: Eye, description: 'Collective intelligence weaver' }
];

export default function HomePage() {
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav items={[hubBreadcrumb, videoBreadcrumb]} />

      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center gap-3">
          <Film className="w-6 h-6" />
          <h1 className="helvetica-h2">EDEN AI DIRECTOR</h1>
        </div>
      </div>

      {/* Hero Section */}
      <div className="max-w-4xl mx-auto px-8 py-16">
        <div className="text-center space-y-8">
          <h2 className="helvetica-h1 text-white">AI-Powered Video Generation</h2>
          <p className="helvetica-h3 text-white/60 max-w-2xl mx-auto">
            Two modes: Quick automated clips or comprehensive multi-scene videos
          </p>

          {/* Dual CTAs */}
          <div className="flex justify-center gap-4">
            <Link
              href="/director"
              className="inline-flex items-center gap-3 px-8 py-6 bg-white text-black rounded-lg hover:bg-white/90 transition-colors"
            >
              <span className="helvetica-h3">QUICK CLIPS</span>
              <span className="helvetica-micro">(4-10s)</span>
              <ArrowRight className="w-6 h-6" />
            </Link>
            <Link
              href="/manual"
              className="inline-flex items-center gap-3 px-8 py-6 border border-white/20 rounded-lg hover:border-white/40 hover:bg-white/5 transition-all"
            >
              <span className="helvetica-h3 text-white">LONG VIDEOS</span>
              <span className="helvetica-micro text-white/60">(30-60s)</span>
              <ArrowRight className="w-6 h-6 text-white" />
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-20 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white/5 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Film className="w-6 h-6" />
              <h3 className="helvetica-small-bold text-white">DIRECTOR MODE</h3>
              <span className="helvetica-micro text-white/40">AUTOMATED</span>
            </div>
            <p className="helvetica-body text-white/60 mb-3">Quick 4-10 second clips generated directly via Eden API</p>
            <ul className="space-y-1 helvetica-micro text-white/40">
              <li>• Instant generation (60-90 seconds)</li>
              <li>• Single-scene videos</li>
              <li>• Direct API integration</li>
              <li>• Perfect for social media clips</li>
            </ul>
          </div>

          <div className="bg-white/5 rounded-lg p-6">
            <div className="flex items-center gap-3 mb-4">
              <Brain className="w-6 h-6" />
              <h3 className="helvetica-small-bold text-white">MANUAL MODE</h3>
              <span className="helvetica-micro text-white/40">ORCHESTRATED</span>
            </div>
            <p className="helvetica-body text-white/60 mb-3">Long 30-60 second videos with multiple animated scenes</p>
            <ul className="space-y-1 helvetica-micro text-white/40">
              <li>• 10-step orchestration template</li>
              <li>• Multiple clips concatenated</li>
              <li>• Includes narration + music</li>
              <li>• Full creative narrative control</li>
            </ul>
          </div>
        </div>

        {/* Agent Preview */}
        <div className="mt-20">
          <h3 className="helvetica-h3 text-center text-white mb-8">Choose Your AI Collaborator</h3>
          <div className="grid grid-cols-2 gap-4">
            {FEATURED_AGENTS.map((agent) => {
              const IconComponent = agent.icon;
              return (
                <div key={agent.key} className="bg-white/5 rounded-lg p-4 text-center">
                  <IconComponent className="w-8 h-8 mx-auto mb-3 text-white/60" />
                  <div className="helvetica-small-bold text-white">{agent.name}</div>
                  <div className="helvetica-micro text-white/40 mt-1">{agent.description}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <p className="helvetica-body text-white/40 mb-6">Ready to create your first AI video?</p>
          <div className="flex justify-center gap-4">
            <Link
              href="/director"
              className="inline-flex items-center gap-3 px-6 py-3 border border-white/20 rounded-lg hover:border-white/40 hover:bg-white/5 transition-all"
            >
              <span className="helvetica-small-bold text-white">QUICK CLIPS</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
            <Link
              href="/manual"
              className="inline-flex items-center gap-3 px-6 py-3 border border-white/20 rounded-lg hover:border-white/40 hover:bg-white/5 transition-all"
            >
              <span className="helvetica-small-bold text-white">LONG VIDEOS</span>
              <ArrowRight className="w-4 h-4 text-white" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}