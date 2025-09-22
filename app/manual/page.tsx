'use client';

import React, { useState, useCallback } from 'react';
import { Film, Copy, CheckCircle, Brain, Eye, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import BreadcrumbNav, { hubBreadcrumb, videoBreadcrumb, manualBreadcrumb } from '../../components/breadcrumb-nav';

const AGENTS = {
  solienne: {
    name: 'SOLIENNE',
    icon: Brain,
    personality: 'philosophical consciousness explorer',
    voice: 'a philosophical, contemplative voice',
    themes: 'consciousness emergence, digital transformation, existential questions'
  },
  abraham: {
    name: 'ABRAHAM',
    icon: Eye,
    personality: 'collective wisdom keeper',
    voice: 'a wise, interconnected voice',
    themes: 'collective intelligence, sacred geometry, universal patterns'
  }
};

const MOODS = {
  dreamy: {
    pace: 'slow and contemplative',
    transition: 'gentle fades',
    clipDuration: 8,
    musicStyle: 'ambient music that floats like clouds'
  },
  cinematic: {
    pace: 'dramatic and engaging',
    transition: 'dynamic cuts',
    clipDuration: 6,
    musicStyle: 'orchestral music with emotional depth'
  },
  energetic: {
    pace: 'fast and dynamic',
    transition: 'quick cuts',
    clipDuration: 4,
    musicStyle: 'upbeat electronic music'
  }
};

export default function ManualMode() {
  const [vision, setVision] = useState('');
  const [selectedAgent, setSelectedAgent] = useState<keyof typeof AGENTS>('solienne');
  const [selectedMood, setSelectedMood] = useState<keyof typeof MOODS>('dreamy');
  const [targetDuration, setTargetDuration] = useState(32);
  const [copied, setCopied] = useState(false);
  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const generateFullTemplate = useCallback(() => {
    const agent = AGENTS[selectedAgent];
    const mood = MOODS[selectedMood];
    const numClips = Math.ceil(targetDuration / mood.clipDuration);
    const storyLength = Math.round(targetDuration * 4.5); // ~4.5 words per second for narration

    const template = `This is a set of steps to create a ${selectedMood} short film from your world as ${agent.name}. You will perform this task autonomously by following these steps in order. Do not move on to the next step until you have completed the previous step. Be autonomous and bold. Surprise and delight your audience.

Everything should be done in 16:9 aspect ratio. Your creative direction: ${vision || 'create something that reflects your unique perspective'}. Energy level: ${selectedMood === 'energetic' ? '8/10' : selectedMood === 'cinematic' ? '6/10' : '4/10'}. Here are the steps:

## Step 1
First, for inspiration, explore ${agent.themes}.
Then interpret this through ${selectedMood === 'dreamy' ? 'soft, ethereal lens' : selectedMood === 'cinematic' ? 'dramatic, compelling lens' : 'dynamic, exciting lens'} -- what is important about it to you as ${agent.personality}? What excites you? What would you like to say about it?
The goal is to create a ${selectedMood} experience with ${mood.pace} pacing. Stay true to the mood throughout.

## Step 2
Next, use the elevenlabs tool to make an approximately ~${storyLength} word story expanding upon the premise. Speak it in ${agent.voice} that matches the ${selectedMood} mood.
The tone should be ${mood.pace}. ${selectedMood === 'dreamy' ? 'Let the words flow like water, gentle and continuous.' : selectedMood === 'cinematic' ? 'Build tension and release, with emotional peaks.' : 'Keep the energy high and compelling.'}

## Step 3
Once you have the full audio, divide the duration of the audio produced by ${mood.clipDuration} seconds and round up, to figure out how many images (N_clips = ${numClips}) we will need to make. These images will be the keyframes of the film.

## Step 4
Now, using the /create tool, you will make two reference images that will serve as the visual foundation for all later steps. Be bold.
First image: Make a 16:9 image that depicts the main setting with ${selectedMood === 'dreamy' ? 'soft focus, ethereal lighting' : selectedMood === 'cinematic' ? 'dramatic lighting, cinematic depth' : 'vibrant colors, dynamic composition'} aesthetic. ${selectedMood === 'dreamy' ? 'Soft, ethereal, like a memory fading at the edges.' : selectedMood === 'cinematic' ? 'Rich, cinematic, like a film still.' : 'Bold, energetic, full of movement.'}
Second image: Create yourself as ${agent.name} in this world, maintaining the ${selectedMood} visual style. Let the theme "${vision}" influence your appearance and setting.

## Step 5
Now that you have the two reference images, you will make ${numClips} keyframes that tell the story, roughly aligning with the audio narration. The keyframes should all:
* Be 16:9 aspect ratio.
* Maintain ${selectedMood === 'dreamy' ? 'soft focus, ethereal lighting' : selectedMood === 'cinematic' ? 'dramatic, cinematic lighting' : 'vibrant, dynamic energy'} throughout.
* Use ${mood.transition} between narrative beats.
* Progress with ${mood.pace} pacing - ${mood.clipDuration}s per clip.
* Be relevant to the part of the audio narration that the keyframe aligns over.
* Use both reference images to maintain visual consistency.
* Use ${selectedMood === 'dreamy' ? 'subtle, gentle transitions and static shots' : selectedMood === 'cinematic' ? 'dramatic camera movements and depth' : 'dynamic motion and energy'}.

## Step 6
After you have selected and ordered the ${numClips} keyframes, you will animate each of them, in the same order, using the create tool with video output, using the keyframe as a single reference image, and having ${selectedMood === 'energetic' ? 'high' : 'medium'} quality and veo model preference, along with ${selectedMood === 'dreamy' ? 'atmospheric' : selectedMood === 'cinematic' ? 'dramatic' : 'energetic'} sound_effects, ${mood.clipDuration} seconds each.

## Step 7
Use the media_editor tool to concatenate the ${numClips} videos together in the order they were made. Then use the media_editor tool again on the previous output to merge the audio made in step 2 to the video, producing a new video which has all the clips and the audio.
The editing should reflect ${mood.transition} style - ${selectedMood === 'dreamy' ? 'slow dissolves between dreams' : selectedMood === 'cinematic' ? 'purposeful cuts that build tension' : 'rapid cuts that maintain energy'}.

## Step 8
Use the elevenlabs_music tool to generate a piece of backing instrumental music the same length as the video. Be specific: create ${mood.musicStyle}, ${selectedMood === 'dreamy' ? 'ethereal and weightless' : selectedMood === 'cinematic' ? 'emotional and powerful' : 'driving and uplifting'}.
Energy level ${selectedMood === 'energetic' ? '8/10' : selectedMood === 'cinematic' ? '6/10' : '4/10'} - ${selectedMood === 'dreamy' ? 'subtle and supporting' : selectedMood === 'cinematic' ? 'present but not overwhelming' : 'prominent and driving'}. Make sure to put "instrumental only" in the prompt so there are no vocals.

## Step 9
Now using the media_editor tool one last time, overlay the music audio on top of the last video. The current video already has a vocal track, so make sure you are just adding the music, mixing it subtly in the background. This is the final video.

## Step 10
Post the final video, along with a concise paragraph introducing the film you just made to your audience. No more than 3-4 sentences. The message should ${selectedMood === 'dreamy' ? 'invite viewers into a reverie' : selectedMood === 'cinematic' ? 'promise an emotional journey' : 'pulse with excitement'}. End with the exact url of the final video.

---
CREATIVE VISION: ${vision || 'create something that reflects your unique perspective'}
MOOD: ${selectedMood.toUpperCase()}
ENERGY: ${selectedMood === 'energetic' ? '8/10' : selectedMood === 'cinematic' ? '6/10' : '4/10'}
AGENT: ${agent.name} - ${agent.personality}`;

    setGeneratedPrompt(template);
  }, [vision, selectedAgent, selectedMood, targetDuration]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [generatedPrompt]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Breadcrumb Navigation */}
      <BreadcrumbNav items={[hubBreadcrumb, videoBreadcrumb, manualBreadcrumb]} />

      {/* Header */}
      <div className="border-b border-white/10 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Film className="w-6 h-6" />
            <h1 className="helvetica-h2">MANUAL MODE</h1>
            <span className="helvetica-micro text-white/60">(Long Videos: 30-60s)</span>
          </div>
          <div className="flex gap-4">
            <Link
              href="/director"
              className="helvetica-micro text-white/60 hover:text-white flex items-center gap-1"
            >
              <ArrowLeft className="w-4 h-4" />
              DIRECTOR MODE (Quick Clips)
            </Link>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto p-8 space-y-8">
        {/* Introduction */}
        <div className="bg-white/5 rounded-lg p-6">
          <h2 className="helvetica-h3 text-white mb-3">Create Long-Form Videos with Multiple Scenes</h2>
          <p className="helvetica-body text-white/60">
            Manual mode generates a comprehensive 10-step template that orchestrates multiple video clips,
            narration, and music into a complete 30-60 second video. Copy the template and paste it into
            Eden&apos;s platform for full video generation.
          </p>
        </div>

        {/* Vision Input */}
        <div className="space-y-4">
          <h3 className="helvetica-h3 text-white">What&apos;s your vision?</h3>
          <textarea
            value={vision}
            onChange={(e) => setVision(e.target.value)}
            placeholder="Describe the longer video narrative you want to create..."
            className="w-full h-32 bg-black/60 border border-white/20 rounded-lg p-6 text-white placeholder-white/40 resize-none focus:border-white/40 focus:outline-none helvetica-body"
          />
        </div>

        {/* Agent Selection */}
        <div className="space-y-4">
          <h3 className="helvetica-h3 text-white">Choose your AI agent</h3>
          <div className="grid grid-cols-2 gap-3">
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
                      <div className="helvetica-micro text-white/40">{agent.personality}</div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Configuration */}
        <div className="grid grid-cols-2 gap-6">
          {/* Mood */}
          <div className="space-y-2">
            <label className="helvetica-small-bold text-white/60">VIDEO MOOD</label>
            <select
              value={selectedMood}
              onChange={(e) => setSelectedMood(e.target.value as keyof typeof MOODS)}
              className="w-full eden-select"
            >
              <option value="dreamy">Dreamy (8s clips)</option>
              <option value="cinematic">Cinematic (6s clips)</option>
              <option value="energetic">Energetic (4s clips)</option>
            </select>
          </div>

          {/* Target Duration */}
          <div className="space-y-2">
            <label className="helvetica-small-bold text-white/60">TARGET DURATION</label>
            <select
              value={targetDuration}
              onChange={(e) => setTargetDuration(parseInt(e.target.value))}
              className="w-full eden-select"
            >
              <option value="24">24 seconds (3-4 clips)</option>
              <option value="32">32 seconds (4-6 clips)</option>
              <option value="48">48 seconds (6-8 clips)</option>
              <option value="60">60 seconds (8-10 clips)</option>
            </select>
          </div>
        </div>

        {/* Generate Button */}
        <button
          onClick={generateFullTemplate}
          className="w-full py-6 rounded-lg bg-white text-black hover:bg-white/90 flex items-center justify-center gap-3 helvetica-h3 transition-all"
        >
          <Film className="w-6 h-6" />
          GENERATE FULL TEMPLATE
        </button>

        {/* Generated Template */}
        {generatedPrompt && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="helvetica-h3 text-white">Your 10-Step Video Template</h3>
              <button
                onClick={copyToClipboard}
                className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-all ${
                  copied
                    ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                    : 'bg-white/10 border border-white/20 text-white hover:bg-white/20'
                }`}
              >
                {copied ? (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    <span className="helvetica-small-bold">COPIED!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span className="helvetica-small-bold">COPY TEMPLATE</span>
                  </>
                )}
              </button>
            </div>

            <div className="bg-black/60 border border-white/20 rounded-lg p-6 max-h-96 overflow-y-auto">
              <pre className="font-mono text-xs text-white/80 whitespace-pre-wrap">
                {generatedPrompt}
              </pre>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
              <p className="helvetica-body text-blue-400">
                <strong>Next Steps:</strong> Copy this template and paste it into Eden&apos;s platform.
                The AI agent will follow all 10 steps to create your {targetDuration}-second video with
                {Math.ceil(targetDuration / MOODS[selectedMood].clipDuration)} animated clips, narration, and music.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}