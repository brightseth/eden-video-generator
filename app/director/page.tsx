'use client';

import React, { useState, useCallback } from 'react';
import { Film, Sparkles, Loader2, CheckCircle, AlertCircle, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { edenAPIClient } from '@/lib/eden-api-client';

export default function DirectorMode() {
  // Core creative inputs only - AI handles the rest
  const [vision, setVision] = useState('');
  const [duration, setDuration] = useState(32);
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
      // AI determines everything based on vision and style
      const prompt = `${vision}. Style: ${style}. Energy: ${energy}/10. Duration: ${duration}s.`;

      setGenerationStatus('Creating your video...');

      const videoUrl = await edenAPIClient.generateVideo(
        prompt,
        {
          aspectRatio: '16:9', // Always 16:9 for simplicity
          duration,
          quality: energy > 7 ? 'high' : 'medium' // AI decides quality
        },
        (status) => {
          setGenerationStatus(`Processing: ${status}`);
        }
      );

      setGeneratedVideoUrl(videoUrl);
      setGenerationStatus('');
    } catch (error) {
      console.error('Generation error:', error);
      setGenerationError(error instanceof Error ? error.message : 'Generation failed');
      setGenerationStatus('');
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Minimal Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Film className="w-6 h-6" />
            <h1 className="helvetica-h2">DIRECTOR MODE</h1>
            <Wand2 className="w-5 h-5 text-white/40" />
          </div>
          <div className="flex gap-4">
            <Link href="/creative" className="helvetica-micro text-white/60 hover:text-white">
              SIMPLE MODE
            </Link>
            <Link href="/" className="helvetica-micro text-white/60 hover:text-white">
              TECHNICAL MODE
            </Link>
          </div>
        </div>
      </div>

      {/* Single Column Layout - No Tabs! */}
      <div className="max-w-3xl mx-auto p-8 space-y-8">

        {/* Vision Input - The Main Thing */}
        <div className="space-y-4">
          <h2 className="helvetica-h3 text-white">What&apos;s your vision?</h2>
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
              <option value="16">16 seconds</option>
              <option value="32">32 seconds</option>
              <option value="64">64 seconds</option>
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
          <h3 className="helvetica-small-bold text-white/60 mb-3">AI WILL AUTOMATICALLY:</h3>
          <div className="grid grid-cols-2 gap-2 helvetica-micro text-white/40">
            <div>✓ Select best agent voice</div>
            <div>✓ Choose video model</div>
            <div>✓ Set optimal quality</div>
            <div>✓ Configure frame rate</div>
            <div>✓ Design transitions</div>
            <div>✓ Match music to mood</div>
            <div>✓ Adjust pacing</div>
            <div>✓ Apply visual effects</div>
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
            />

            <a
              href={generatedVideoUrl}
              download={`director-video-${Date.now()}.mp4`}
              className="w-full py-4 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center gap-2 transition-colors"
            >
              <Sparkles className="w-5 h-5" />
              <span className="helvetica-small-bold">DOWNLOAD VIDEO</span>
            </a>
          </div>
        )}

      </div>
    </div>
  );
}