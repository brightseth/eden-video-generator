'use client';

import React, { useState, useCallback } from 'react';
import {
  Sparkles, Zap, Cloud, Flame, Waves, Heart,
  Copy, CheckCircle
} from 'lucide-react';
import Link from 'next/link';

// Creative presets that auto-configure all technical settings
const CREATIVE_MOODS = {
  'dreamy': {
    icon: Cloud,
    settings: {
      pace: 'slow',
      music: 'ambient',
      visual: 'soft focus, ethereal lighting',
      clipDuration: 8,
      transitions: 'gentle fades'
    }
  },
  'energetic': {
    icon: Zap,
    settings: {
      pace: 'fast',
      music: 'aggressive',
      visual: 'high contrast, dynamic angles',
      clipDuration: 3,
      transitions: 'quick cuts'
    }
  },
  'mysterious': {
    icon: Sparkles,
    settings: {
      pace: 'medium',
      music: 'dark ambient',
      visual: 'shadows, dramatic lighting',
      clipDuration: 6,
      transitions: 'slow reveals'
    }
  },
  'passionate': {
    icon: Flame,
    settings: {
      pace: 'variable',
      music: 'epic',
      visual: 'warm colors, intimate framing',
      clipDuration: 5,
      transitions: 'emotional beats'
    }
  },
  'peaceful': {
    icon: Waves,
    settings: {
      pace: 'very slow',
      music: 'calm',
      visual: 'nature, wide shots',
      clipDuration: 10,
      transitions: 'meditative'
    }
  },
  'playful': {
    icon: Heart,
    settings: {
      pace: 'bouncy',
      music: 'upbeat',
      visual: 'bright colors, whimsical',
      clipDuration: 4,
      transitions: 'fun wipes'
    }
  }
};

const AGENT_VOICES = {
  'solienne': 'philosophical consciousness explorer',
  'miyomi': 'contrarian market oracle',
  'geppetto': 'master storyteller',
  'abraham': 'collective wisdom keeper',
  'koru': 'community weaver',
  'sue': 'cultural critic'
};

export default function CreativeVideoPromptGenerator() {
  const [creativePrompt, setCreativePrompt] = useState('');
  const [selectedMood, setSelectedMood] = useState<keyof typeof CREATIVE_MOODS>('dreamy');
  const [selectedAgent, setSelectedAgent] = useState<keyof typeof AGENT_VOICES>('solienne');
  const [energyLevel, setEnergyLevel] = useState(5);
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  const mood = CREATIVE_MOODS[selectedMood];

  const generateCreativePrompt = useCallback(() => {
    const agentVoice = AGENT_VOICES[selectedAgent];
    const moodSettings = CREATIVE_MOODS[selectedMood].settings;

    // Build a simplified but comprehensive prompt
    const prompt = `Create a ${selectedMood} video as ${selectedAgent} (${agentVoice}).

## Creative Direction
Theme: ${creativePrompt || 'Explore the nature of consciousness and digital existence'}
Mood: ${selectedMood}
Energy: ${energyLevel}/10 intensity
Visual Style: ${moodSettings.visual}
Pacing: ${moodSettings.pace} with ${moodSettings.clipDuration}s clips
Music: ${moodSettings.music} style
Transitions: ${moodSettings.transitions}

## Simplified Steps

1. Find inspiration from ${energyLevel > 5 ? 'trending topics' : 'timeless themes'}
2. Create a ${100 + (energyLevel * 10)} word narrative in ${selectedAgent}'s voice
3. Generate ${Math.ceil(32 / moodSettings.clipDuration)} keyframes with ${selectedMood} aesthetic
4. Animate with ${moodSettings.pace} pacing and ${moodSettings.transitions}
5. Add ${moodSettings.music} music that ${energyLevel > 5 ? 'drives' : 'supports'} the narrative
6. Final output: A ${selectedMood} journey that ${creativePrompt ? `explores: ${creativePrompt}` : 'surprises and delights'}`;

    return prompt;
  }, [creativePrompt, selectedMood, selectedAgent, energyLevel]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(generateCreativePrompt());
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  }, [generateCreativePrompt]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Simple Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="helvetica-h2">CREATIVE VIDEO DIRECTOR</h1>
            <p className="helvetica-small text-white/60 mt-1">Express your vision, we handle the technical details</p>
          </div>
          <Link
            href="/"
            className="helvetica-micro text-white/60 hover:text-white transition-colors"
          >
            ⚙️ TECHNICAL MODE
          </Link>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-6 space-y-8">

        {/* Main Creative Input */}
        <div className="eden-panel">
          <div className="eden-panel-header p-3">
            <h2 className="helvetica-small-bold">WHAT&apos;S YOUR VISION?</h2>
          </div>
          <div className="p-6">
            <textarea
              value={creativePrompt}
              onChange={(e) => setCreativePrompt(e.target.value)}
              placeholder="Describe your creative vision in your own words...

What story do you want to tell?
What feeling should it evoke?
What journey should viewers experience?"
              className="w-full h-32 bg-black/60 border border-white/20 rounded p-4 text-white placeholder-white/40 resize-none focus:border-white/40 focus:outline-none"
            />
          </div>
        </div>

        {/* Mood Selection - Visual Grid */}
        <div className="eden-panel">
          <div className="eden-panel-header p-3">
            <h2 className="helvetica-small-bold">CHOOSE YOUR MOOD</h2>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-3 gap-4">
              {Object.entries(CREATIVE_MOODS).map(([key, config]) => {
                const Icon = config.icon;
                const isSelected = selectedMood === key;
                return (
                  <button
                    key={key}
                    onClick={() => setSelectedMood(key as keyof typeof CREATIVE_MOODS)}
                    className={`p-6 rounded border transition-all ${
                      isSelected
                        ? 'bg-white text-black border-white'
                        : 'bg-black/60 border-white/20 hover:border-white/40'
                    }`}
                  >
                    <Icon className={`w-8 h-8 mx-auto mb-2 ${isSelected ? '' : 'text-white/60'}`} />
                    <div className={`helvetica-small-bold uppercase ${isSelected ? '' : 'text-white'}`}>
                      {key}
                    </div>
                    <div className={`helvetica-micro mt-1 ${isSelected ? 'text-black/60' : 'text-white/40'}`}>
                      {config.settings.pace} • {config.settings.music}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Energy Slider */}
        <div className="eden-panel">
          <div className="eden-panel-header p-3">
            <h2 className="helvetica-small-bold">ENERGY LEVEL</h2>
          </div>
          <div className="p-6">
            <div className="flex items-center gap-6">
              <span className="helvetica-small text-white/40">CALM</span>
              <div className="flex-1 relative">
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energyLevel}
                  onChange={(e) => setEnergyLevel(parseInt(e.target.value))}
                  className="w-full"
                  style={{
                    background: `linear-gradient(to right, white 0%, white ${energyLevel * 10}%, rgba(255,255,255,0.2) ${energyLevel * 10}%, rgba(255,255,255,0.2) 100%)`
                  }}
                />
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                  <span className="helvetica-h3">{energyLevel}</span>
                </div>
              </div>
              <span className="helvetica-small text-white/40">INTENSE</span>
            </div>
          </div>
        </div>

        {/* Agent Voice */}
        <div className="eden-panel">
          <div className="eden-panel-header p-3">
            <h2 className="helvetica-small-bold">CREATIVE VOICE</h2>
          </div>
          <div className="p-6">
            <select
              value={selectedAgent}
              onChange={(e) => setSelectedAgent(e.target.value as keyof typeof AGENT_VOICES)}
              className="w-full eden-select"
            >
              {Object.entries(AGENT_VOICES).map(([key, description]) => (
                <option key={key} value={key}>
                  {key.toUpperCase()} - {description}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={copyToClipboard}
            className={`flex-1 eden-button py-4 flex items-center justify-center text-lg ${
              copiedToClipboard ? 'bg-green-900/20 border-green-400' : ''
            }`}
          >
            {copiedToClipboard ? (
              <>
                <CheckCircle className="w-5 h-5 mr-2" />
                READY FOR EDEN!
              </>
            ) : (
              <>
                <Copy className="w-5 h-5 mr-2" />
                CREATE VIDEO PROMPT
              </>
            )}
          </button>

          <a
            href={`https://app.eden.art/agents/${selectedAgent}`}
            target="_blank"
            rel="noopener noreferrer"
            className="eden-button py-4 px-8 flex items-center justify-center"
          >
            <Sparkles className="w-5 h-5 mr-2" />
            OPEN EDEN
          </a>
        </div>

        {/* Live Preview - Simplified */}
        <div className="border border-white/10 rounded p-4 bg-black/40">
          <div className="flex items-center justify-between mb-2">
            <span className="helvetica-micro-bold text-white/60">PREVIEW</span>
            <span className="helvetica-micro text-white/40">
              {generateCreativePrompt().length} chars
            </span>
          </div>
          <div className="helvetica-micro text-white/40 whitespace-pre-wrap">
            {generateCreativePrompt().split('\n').slice(0, 5).join('\n')}...
          </div>
        </div>

      </div>
    </div>
  );
}