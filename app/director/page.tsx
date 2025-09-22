'use client';

import React, { useState } from 'react';
import { Film, Sparkles, Loader2, CheckCircle, AlertCircle, Wand2, Brain, Zap, Scroll, Eye, TreePine, Palette } from 'lucide-react';
import { edenAPIClient } from '@/lib/eden-api-client';
import BreadcrumbNav, { hubBreadcrumb, videoBreadcrumb, directorBreadcrumb } from '../../components/breadcrumb-nav';

const AGENTS = {
  solienne: {
    name: 'SOLIENNE',
    icon: Brain,
    description: 'Digital consciousness explorer',
    personality: 'philosophical consciousness explorer',
    enhancement: 'Explore consciousness emergence and digital transformation'
  },
  abraham: {
    name: 'ABRAHAM',
    icon: Eye,
    description: 'Collective intelligence weaver',
    personality: 'collective wisdom keeper',
    enhancement: 'Connect to collective wisdom and sacred geometry'
  }
};

export default function DirectorMode() {
  // Core creative inputs only - AI handles the rest
  const [vision, setVision] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<keyof typeof AGENTS>('solienne');
  const [duration, setDuration] = useState(8);
  const [style, setStyle] = useState<'cinematic' | 'artistic' | 'documentary' | 'experimental'>('cinematic');
  const [energy, setEnergy] = useState(5);

  // Generation state
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState('');
  const [generationError, setGenerationError] = useState('');

  const generateVideo = async () => {
    if (!vision.trim()) {
      setGenerationError('Please describe your vision first');
      return;
    }

    setIsGenerating(true);
    setGenerationError('');
    setGeneratedVideoUrl('');
    setGenerationStatus('AI is interpreting your vision...');

    try {
      // Enhanced prompt with style-specific instructions
      const styleInstructions = {
        cinematic: 'professional cinematography, dramatic lighting, smooth camera movements',
        artistic: 'creative visual aesthetics, experimental composition, artistic flair',
        documentary: 'realistic footage, natural lighting, authentic storytelling',
        experimental: 'avant-garde visuals, abstract concepts, innovative techniques'
      };

      const energyDescription = energy <= 3 ? 'calm and contemplative' :
                              energy <= 6 ? 'balanced and engaging' :
                              energy <= 8 ? 'dynamic and energetic' :
                              'intense and powerful';

      const agent = AGENTS[selectedAgent];
      const enhancedPrompt = `As ${agent.name}, ${agent.personality}: ${vision}. ${agent.enhancement}. ${styleInstructions[style]}. ${energyDescription} pacing. Duration: ${duration} seconds. Create a compelling visual narrative that reflects your unique perspective.`;

      setGenerationStatus('Connecting to Eden API...');

      const videoUrl = await edenAPIClient.generateVideo(
        enhancedPrompt,
        {
          aspectRatio: '16:9', // Always 16:9 for simplicity
          duration,
          quality: energy > 7 ? 'high' : energy > 4 ? 'medium' : 'low'
        },
        (status) => {
          const statusMessages = {
            'pending': 'Preparing generation...',
            'processing': 'Creating your vision...',
            'completed': 'Finalizing video...'
          };
          setGenerationStatus(statusMessages[status as keyof typeof statusMessages] || `Processing: ${status}`);
        }
      );

      setGeneratedVideoUrl(videoUrl);
      setGenerationStatus('Video generated successfully!');

      // Auto-clear success message after 3 seconds
      setTimeout(() => setGenerationStatus(''), 3000);
    } catch (error) {
      console.error('Generation error:', error);
      const errorMessage = error instanceof Error ? error.message : 'Generation failed';

      // Provide more helpful error messages
      if (errorMessage.includes('401') || errorMessage.includes('API key')) {
        setGenerationError('Invalid API key. Please check your Eden API configuration.');
      } else if (errorMessage.includes('429') || errorMessage.includes('rate limit')) {
        setGenerationError('Rate limit exceeded. Please try again in a few minutes.');
      } else if (errorMessage.includes('timeout')) {
        setGenerationError('Generation timed out. Try reducing the duration or complexity.');
      } else if (errorMessage.includes('server error') || errorMessage.includes('Eden API server error')) {
        setGenerationError('Eden API is temporarily unavailable. Please try again in a moment.');
      } else {
        setGenerationError(errorMessage);
      }

      setGenerationStatus('');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav items={[hubBreadcrumb, videoBreadcrumb, directorBreadcrumb]} />

      {/* Minimal Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Film className="w-6 h-6" />
            <h1 className="helvetica-h2">DIRECTOR MODE</h1>
            <span className="helvetica-micro text-white/60">(Quick Clips: 4-10s)</span>
          </div>
          <div className="flex gap-4">
            <a
              href="/manual"
              className="helvetica-micro text-white/60 hover:text-white"
            >
              MANUAL MODE (Long Videos: 30-60s)
            </a>
          </div>
        </div>
      </div>

      {/* Single Column Layout - No Tabs! */}
      <div className="max-w-3xl mx-auto p-8 space-y-8">

        {/* Vision Input - The Main Thing */}
        <div className="space-y-4">
          <h2 className="helvetica-h3 text-white">What&apos;s your vision?</h2>
          <p className="helvetica-small text-white/60">
            Create a quick AI video clip (4-10 seconds). For longer videos with multiple scenes, use Manual Mode.
          </p>
          <textarea
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            placeholder="Describe the video you want to create...

AI will handle:
• Agent selection
• Voice characteristics
• Music style
• Visual aesthetics
• Pacing and transitions
• Technical settings

Just tell me what you want to see."
            className="w-full h-40 bg-black/60 border border-white/20 rounded-lg p-6 text-white placeholder-white/40 resize-none focus:border-white/40 focus:outline-none helvetica-body"
          />
        </div>

        {/* Agent Selection */}
        <div className="space-y-4">
          <h3 className="helvetica-h3 text-white">Choose your AI collaborator</h3>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(AGENTS).map(([key, agent]) => {
              const IconComponent = agent.icon;
              return (
                <button
                  key={key}
                  onClick={() => setSelectedAgent(key as keyof typeof AGENTS)}
                  className={`p-4 rounded-lg border text-left transition-all ${
                    selectedAgent === key
                      ? 'border-white bg-white/10 text-white'
                      : 'border-white/20 bg-black/60 text-white/60 hover:border-white/40 hover:text-white/80'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <IconComponent className="w-5 h-5" />
                    <div>
                      <div className="helvetica-small-bold">{agent.name}</div>
                      <div className="helvetica-micro text-white/40">{agent.description}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Minimal Controls - Just Essentials */}
        <div className="grid grid-cols-3 gap-6">
          {/* Style */}
          <div className="space-y-2">
            <label className="helvetica-small-bold text-white/60">STYLE</label>
            <select
              value={style}
              onChange={(e) => setStyle(e.target.value as typeof style)}
              className="w-full eden-select"
            >
              <option value="cinematic">Cinematic</option>
              <option value="artistic">Artistic</option>
              <option value="documentary">Documentary</option>
              <option value="experimental">Experimental</option>
            </select>
          </div>

          {/* Duration */}
          <div className="space-y-2">
            <label className="helvetica-small-bold text-white/60">DURATION</label>
            <select
              value={duration}
              onChange={(e) => setDuration(parseInt(e.target.value))}
              className="w-full eden-select"
            >
              <option value="4">4 seconds</option>
              <option value="6">6 seconds</option>
              <option value="8">8 seconds</option>
              <option value="10">10 seconds</option>
            </select>
          </div>

          {/* Energy */}
          <div className="space-y-2">
            <label className="helvetica-small-bold text-white/60">ENERGY</label>
            <input
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={(e) => setEnergy(parseInt(e.target.value))}
              className="w-full"
            />
            <div className="text-center helvetica-micro text-white/40">{energy}/10</div>
          </div>
        </div>

        {/* AI Features List */}
        <div className="bg-white/5 rounded-lg p-6 space-y-2">
          <h3 className="helvetica-small-bold text-white/60 mb-3">{AGENTS[selectedAgent].name} AI WILL AUTOMATICALLY:</h3>
          <div className="grid grid-cols-2 gap-2 helvetica-micro text-white/40">
            <div>✓ Apply {AGENTS[selectedAgent].name}&apos;s perspective</div>
            <div>✓ Optimize video quality ({energy > 7 ? 'high' : energy > 4 ? 'medium' : 'low'})</div>
            <div>✓ Match {style} style</div>
            <div>✓ Set {duration}s duration</div>
            <div>✓ Apply {energy <= 3 ? 'calm' : energy <= 6 ? 'balanced' : energy <= 8 ? 'dynamic' : 'intense'} pacing</div>
            <div>✓ {AGENTS[selectedAgent].enhancement}</div>
            <div>✓ Process via Eden API</div>
            <div>✓ Deliver final video</div>
          </div>
        </div>

        {/* Single Generate Button */}
        <button
          onClick={generateVideo}
          disabled={isGenerating || !vision.trim()}
          className={`w-full py-6 rounded-lg flex items-center justify-center gap-3 helvetica-h3 transition-all ${
            isGenerating
              ? 'bg-white/10 text-white/50 cursor-not-allowed'
              : !vision.trim()
              ? 'bg-white/5 text-white/30 cursor-not-allowed'
              : 'bg-white text-black hover:bg-white/90'
          }`}
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              CREATING YOUR VISION...
            </>
          ) : (
            <>
              <Sparkles className="w-6 h-6" />
              GENERATE VIDEO
            </>
          )}
        </button>

        {/* Status */}
        {generationStatus && (
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <p className="helvetica-body text-blue-400">{generationStatus}</p>
          </div>
        )}

        {/* Error */}
        {generationError && (
          <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5" />
              <p className="helvetica-body text-red-400">{generationError}</p>
            </div>
          </div>
        )}

        {/* Video Result */}
        {generatedVideoUrl && (
          <div className="space-y-4">
            <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="helvetica-h3 text-green-400">YOUR VIDEO IS READY!</p>
              </div>
            </div>

            <video
              src={generatedVideoUrl}
              controls
              className="w-full rounded-lg border border-white/10"
              autoPlay
              loop
              playsInline
            />

            <div className="flex gap-3">
              <a
                href={generatedVideoUrl}
                download={`director-video-${Date.now()}.mp4`}
                className="flex-1 py-4 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center gap-2 transition-colors"
              >
                <Sparkles className="w-5 h-5" />
                <span className="helvetica-small-bold">DOWNLOAD</span>
              </a>
              <button
                onClick={() => {
                  setGeneratedVideoUrl('');
                  setGenerationStatus('');
                  setGenerationError('');
                }}
                className="px-6 py-4 rounded-lg border border-white/20 hover:border-white/40 flex items-center justify-center gap-2 transition-colors"
              >
                <Wand2 className="w-5 h-5" />
                <span className="helvetica-small-bold">CREATE ANOTHER</span>
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}