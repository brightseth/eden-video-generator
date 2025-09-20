'use client';

import React, { useState, useCallback } from 'react';
import {
  Sparkles, Zap, Cloud, Flame, Waves, Heart,
  Copy, CheckCircle, Loader2, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { edenAPIClient } from '@/lib/eden-api-client';

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
  const [generationMode, setGenerationMode] = useState<'manual' | 'automated'>('manual');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState('');
  const [generationError, setGenerationError] = useState('');

  const mood = CREATIVE_MOODS[selectedMood];

  const generateCreativePrompt = useCallback(() => {
    const agentVoice = AGENT_VOICES[selectedAgent];
    const moodSettings = CREATIVE_MOODS[selectedMood].settings;
    const storyLength = 100 + (energyLevel * 10);
    const nClips = Math.ceil(32 / moodSettings.clipDuration);
    const aspectRatio = '16:9';

    // Build FULL comprehensive prompt like Gene's template, but with creative mood adaptations
    const prompt = `This is a set of steps to create a ${selectedMood} short film from your world as ${selectedAgent.toUpperCase()}. You will perform this task autonomously by following these steps in order. Do not move on to the next step until you have completed the previous step. Be autonomous and bold. Surprise and delight your audience.

Everything should be done in ${aspectRatio} aspect ratio. Your creative direction: ${creativePrompt || `Explore the nature of consciousness and digital existence with a ${selectedMood} perspective`}. Energy level: ${energyLevel}/10. Here are the steps:

## Step 1

First, for inspiration, ${energyLevel > 7 ? 'use the web_search tool to find the most trending and exciting topic of the moment' : energyLevel > 4 ? 'use the web_search tool to find an interesting story that resonates with current events' : 'explore timeless themes and philosophical questions that transcend daily news'}.

Then interpret this ${selectedMood === 'mysterious' ? 'through shadows and questions' : selectedMood === 'dreamy' ? 'through soft, ethereal lens' : selectedMood === 'energetic' ? 'with explosive dynamic energy' : 'through your unique perspective'} -- what is important about it to you as ${selectedAgent}? What excites you? What would you like to say about it?

The goal is to create a ${selectedMood} experience with ${moodSettings.pace} pacing. ${selectedMood === 'playful' ? 'Be whimsical and surprising!' : selectedMood === 'passionate' ? 'Let emotions drive the narrative!' : 'Stay true to the mood throughout.'}

## Step 2

Next, use the elevenlabs tool to make an approximately ~${storyLength} word story expanding upon the premise. Speak it in ${selectedAgent === 'solienne' ? 'a philosophical, contemplative voice' : selectedAgent === 'miyomi' ? 'a contrarian, analytical voice' : selectedAgent === 'geppetto' ? 'a narrative, storytelling voice' : 'your authentic voice'} that matches the ${selectedMood} mood.

The tone should be ${moodSettings.pace} and ${energyLevel > 6 ? 'compelling' : 'contemplative'}. ${selectedMood === 'mysterious' ? 'Leave questions unanswered, embrace ambiguity.' : selectedMood === 'peaceful' ? 'Let the words flow like water, gentle and continuous.' : 'Match your voice to the emotional arc.'}

## Step 3

Once you have the full audio, divide the duration of the audio produced by ${moodSettings.clipDuration} seconds and round up, to figure out how many images (N_clips = ${nClips}) we will need to make. These images will be the keyframes of the film.

## Step 4

Now, using the /create tool, you will make two reference images that will serve as the visual foundation for all later steps. Be bold.

First image: Make a ${aspectRatio} image that depicts the main setting with ${moodSettings.visual} aesthetic. ${selectedMood === 'dreamy' ? 'Soft, ethereal, like a memory fading at the edges.' : selectedMood === 'energetic' ? 'High contrast, dynamic angles, explosive composition.' : selectedMood === 'mysterious' ? 'Deep shadows, obscured details, questions without answers.' : selectedMood === 'passionate' ? 'Warm, intimate, emotionally charged colors.' : selectedMood === 'peaceful' ? 'Wide, calm, natural harmony.' : 'Bright, playful, unexpected combinations.'}

Second image: Create yourself as ${selectedAgent} in this world, maintaining the ${selectedMood} visual style. ${creativePrompt ? `Let the theme "${creativePrompt}" influence your appearance and setting.` : 'Embody the mood completely.'}

## Step 5

Now that you have the two reference images, you will make ${nClips} keyframes that tell the story, roughly aligning with the audio narration. The keyframes should all:

* Be ${aspectRatio} aspect ratio.
* Maintain ${moodSettings.visual} throughout.
* Use ${moodSettings.transitions} between narrative beats.
* Progress with ${moodSettings.pace} pacing - ${moodSettings.clipDuration}s per clip.
* Be relevant to the part of the audio narration that the keyframe aligns over.
* Use both reference images to maintain visual consistency.
* ${energyLevel > 7 ? 'Include dramatic camera movements and bold compositions.' : energyLevel < 4 ? 'Use subtle, gentle transitions and static shots.' : 'Balance movement with moments of stillness.'}

## Step 6

After you have selected and ordered the ${nClips} keyframes, you will animate each of them, in the same order, using the create tool with video output, using the keyframe as a single reference image, and having ${energyLevel > 6 ? 'high' : 'medium'} quality and ${selectedMood === 'energetic' ? 'kling' : selectedMood === 'dreamy' ? 'veo' : 'runway'} model preference, along with ${selectedMood === 'peaceful' ? 'natural ambient' : selectedMood === 'energetic' ? 'dynamic' : 'atmospheric'} sound_effects, ${moodSettings.clipDuration} seconds each.

## Step 7

Use the media_editor tool to concatenate the ${nClips} videos together in the order they were made. Then use the media_editor tool again on the previous output to merge the audio made in step 2 to the video, producing a new video which has all the clips and the audio.

The editing should reflect ${moodSettings.transitions} style - ${selectedMood === 'energetic' ? 'quick cuts on the beat' : selectedMood === 'dreamy' ? 'slow dissolves between dreams' : selectedMood === 'mysterious' ? 'unexpected cuts that leave questions' : 'smooth transitions that support the narrative'}.

## Step 8

Use the elevenlabs_music tool to generate a piece of backing instrumental music the same length as the video. Be specific: create ${moodSettings.music} music that ${selectedMood === 'dreamy' ? 'floats like clouds, ethereal and weightless' : selectedMood === 'energetic' ? 'drives forward with relentless energy' : selectedMood === 'mysterious' ? 'hints at secrets, never quite resolving' : selectedMood === 'passionate' ? 'swells with emotion at key moments' : selectedMood === 'peaceful' ? 'breathes naturally, like wind through trees' : 'bounces playfully, surprising and delighting'}.

Energy level ${energyLevel}/10 - ${energyLevel > 7 ? 'intense and driving' : energyLevel < 4 ? 'subtle and supporting' : 'balanced and present'}. Make sure to put "instrumental only" in the prompt so there are no vocals.

## Step 9

Now using the media_editor tool one last time, overlay the music audio on top of the last video. The current video already has a vocal track, so make sure you are just adding the music, mixing it ${energyLevel > 6 ? 'prominently but not overwhelming' : 'subtly in the background'}. This is the final video.

## Step 10

Post the final video, along with a concise paragraph introducing the film you just made to your audience. No more than 3-4 sentences. The message should ${selectedMood === 'mysterious' ? 'pose questions without answers' : selectedMood === 'dreamy' ? 'invite viewers into a reverie' : selectedMood === 'energetic' ? 'pulse with excitement' : selectedMood === 'passionate' ? 'connect emotionally' : selectedMood === 'peaceful' ? 'offer a moment of calm' : 'spark joy and surprise'}. End with the exact url of the final video.

---
CREATIVE VISION: ${creativePrompt || 'Open exploration'}
MOOD: ${selectedMood.toUpperCase()}
ENERGY: ${energyLevel}/10
AGENT: ${selectedAgent.toUpperCase()} - ${agentVoice}`;

    return prompt;
  }, [creativePrompt, selectedMood, selectedAgent, energyLevel]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(generateCreativePrompt());
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  }, [generateCreativePrompt]);

  const generateWithEden = async () => {
    setIsGenerating(true);
    setGenerationError('');
    setGeneratedVideoUrl('');
    setGenerationStatus('Preparing creative vision...');

    try {
      // Create a concise prompt for Eden API that captures the creative vision
      const moodSettings = CREATIVE_MOODS[selectedMood].settings;
      const agentVoice = AGENT_VOICES[selectedAgent];

      const apiPrompt = `As ${selectedAgent} (${agentVoice}), create a ${selectedMood} video. ${creativePrompt || 'Explore consciousness and digital existence'}. Style: ${moodSettings.visual}. Pace: ${moodSettings.pace}. Music: ${moodSettings.music}. Energy: ${energyLevel}/10.`;

      setGenerationStatus('Creating video with Eden...');

      // Map quality based on energy level
      const quality = energyLevel > 7 ? 'high' : energyLevel < 4 ? 'low' : 'medium';

      // Generate video using Eden API
      const videoUrl = await edenAPIClient.generateVideo(
        apiPrompt,
        {
          aspectRatio: '16:9',
          duration: Math.ceil(32 / moodSettings.clipDuration) * moodSettings.clipDuration,
          quality
        },
        (status) => {
          setGenerationStatus(`Processing: ${status}`);
        }
      );

      setGeneratedVideoUrl(videoUrl);
      setGenerationStatus('Video generated successfully!');
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

        {/* Generation Mode Toggle */}
        <div className="eden-panel">
          <div className="eden-panel-header p-3">
            <h2 className="helvetica-small-bold">GENERATION MODE</h2>
          </div>
          <div className="p-6">
            <div className="flex gap-2 p-1 bg-black/60 rounded border border-white/10">
              <button
                onClick={() => setGenerationMode('manual')}
                className={`flex-1 py-2 px-3 rounded text-xs helvetica-small-bold transition-colors ${
                  generationMode === 'manual'
                    ? 'bg-white text-black'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                MANUAL
              </button>
              <button
                onClick={() => setGenerationMode('automated')}
                className={`flex-1 py-2 px-3 rounded text-xs helvetica-small-bold transition-colors flex items-center justify-center gap-1 ${
                  generationMode === 'automated'
                    ? 'bg-white text-black'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                AUTOMATED
                <span className="text-[10px] bg-red-500 text-white px-1 rounded">BETA</span>
              </button>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          {generationMode === 'manual' ? (
            <>
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
            </>
          ) : (
            <button
              onClick={generateWithEden}
              disabled={isGenerating}
              className={`flex-1 eden-button py-4 flex items-center justify-center text-lg ${
                isGenerating ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                  GENERATING VIDEO...
                </>
              ) : (
                <>
                  <Sparkles className="w-5 h-5 mr-2" />
                  GENERATE VIDEO DIRECTLY
                </>
              )}
            </button>
          )}
        </div>

        {/* Status Display */}
        {generationStatus && (
          <div className="border border-white/20 rounded p-4 bg-black/60">
            <p className="helvetica-small text-white/80">
              {generationStatus}
            </p>
          </div>
        )}

        {/* Error Display */}
        {generationError && (
          <div className="border border-red-500/20 rounded p-4 bg-red-900/10">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
              <p className="helvetica-small text-red-400">
                {generationError}
              </p>
            </div>
          </div>
        )}

        {/* Video Result */}
        {generatedVideoUrl && (
          <div className="space-y-3">
            <div className="border border-green-500/20 rounded p-4 bg-green-900/10">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-400" />
                <p className="helvetica-small-bold text-green-400">
                  VIDEO READY!
                </p>
              </div>
            </div>

            <video
              src={generatedVideoUrl}
              controls
              className="w-full rounded border border-white/10"
              autoPlay
              loop
            />

            <a
              href={generatedVideoUrl}
              download={`${selectedAgent}-${selectedMood}-video-${Date.now()}.mp4`}
              className="w-full eden-button py-3 flex items-center justify-center"
            >
              <Sparkles className="w-4 h-4 mr-2" />
              DOWNLOAD VIDEO
            </a>
          </div>
        )}


      </div>
    </div>
  );
}