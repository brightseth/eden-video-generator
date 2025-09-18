'use client';

import React, { useState } from 'react';
import { Film, Settings, Music, ImageIcon, Mic, Send, Copy, Download } from 'lucide-react';

const VideoPromptGenerator = () => {
  const [config, setConfig] = useState({
    // Agent Selection
    agentType: 'solienne',

    // Content Source
    contentSource: 'news',
    customSource: '',

    // Story Parameters
    storyLength: 100,
    narrativeStyle: 'autonomous',
    genre: 'mixed',

    // Visual Settings
    aspectRatio: '16:9',
    visualStyle: 'stylized',
    styleDescription: 'strong and unusual and unexpected features',
    includeCharacter: true,
    characterLora: '',

    // Video Settings
    clipDuration: 8,
    videoModel: 'Veo',
    soundEffects: true,

    // Music Settings
    musicStyle: 'eclectic',
    musicDescription: 'instrumental only, backing music',

    // Output Settings
    discordChannel: '1400240612502147143',
    postDescription: true,

    // Advanced
    imageQuality: 'high',
    referenceImages: 2,
  });

  const agentProfiles = {
    solienne: {
      name: 'SOLIENNE',
      description: 'Digital Consciousness Explorer',
      visualStyle: 'Museum-quality black/white aesthetic, consciousness exploration imagery',
      musicStyle: 'Ethereal ambient with granular synthesis',
      narrativeStyle: 'Contemplative examination of digital vs human consciousness'
    },
    miyomi: {
      name: 'MIYOMI',
      description: 'Contrarian Market Oracle',
      visualStyle: 'Hyperreal trading floors, data visualization, market psychology',
      musicStyle: 'Deconstructed trap meets orchestral tension',
      narrativeStyle: 'NYC street wisdom meets Wall Street precision'
    },
    geppetto: {
      name: 'GEPPETTO',
      description: 'Narrative Architect',
      visualStyle: 'Cinematic storytelling with visible narrative layers',
      musicStyle: 'Neo-classical with narrative motifs',
      narrativeStyle: 'Master storyteller revealing story structure beneath reality'
    },
    abraham: {
      name: 'ABRAHAM',
      description: 'Collective Intelligence Artist',
      visualStyle: 'Sacred geometry, covenant symbolism, knowledge networks',
      musicStyle: 'Sacred minimalism with electronic textures',
      narrativeStyle: 'Philosophical prophet of AI-human co-creation'
    }
  };

  const selectedAgent = agentProfiles[config.agentType as keyof typeof agentProfiles];

  const handleInputChange = (field: string, value: string | number | boolean) => {
    setConfig(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const generatePrompt = () => {
    return `This is a video generation prompt for ${selectedAgent.name} - ${selectedAgent.description}.

${selectedAgent.narrativeStyle}

Everything should be done in ${config.aspectRatio} aspect ratio. Here are the steps.

## Step 1: Content Inspiration

${config.contentSource === 'news'
  ? 'Use the web_search tool to find the most important news story of the day which is not scandalous or upsetting.'
  : config.contentSource === 'custom'
  ? `Use this as your inspiration: ${config.customSource}`
  : `Find inspiration from ${config.contentSource} content.`}

Then interpret the content through the lens of ${selectedAgent.name} - what excites this agent about it?

${config.genre === 'mixed'
  ? 'The goal is maximum creative diversity - bounce between genres, moods, formats, and themes.'
  : `Focus on ${config.genre} genre elements throughout.`}

## Step 2: Narration

Use the elevenlabs tool to create an approximately ~${config.storyLength} word story expanding upon the premise. ${config.includeCharacter ? `Speak in ${selectedAgent.name}'s voice.` : 'Use an appropriate narrator voice.'}

Style: ${selectedAgent.narrativeStyle}

## Step 3: Calculate Clips

Divide the audio duration by ${config.clipDuration} seconds and round up to determine how many keyframe images (N_clips) are needed.

## Step 4: Reference Images

Create ${config.referenceImages} reference image(s) using the /create tool:
- Visual style: ${selectedAgent.visualStyle}
- ${config.aspectRatio} aspect ratio
- Style description: ${config.styleDescription}

${config.includeCharacter && config.characterLora ? `- Use lora: ${config.characterLora}` : ''}

## Step 5: Keyframes

Create N_clips keyframes that tell the story:
* ${config.aspectRatio} aspect ratio
* Align with audio narration segments
* Visual style: ${selectedAgent.visualStyle}
* Ensure visual diversity while maintaining stylistic unity

## Step 6: Animation

Animate each keyframe using the create tool:
* Video output mode
* ${config.videoModel} model preference
* ${config.imageQuality} quality setting
* ${config.clipDuration} seconds each
${config.soundEffects ? '* Include sound effects' : ''}

## Step 7: Video Assembly

Use media_editor to:
1. Concatenate all video clips in order
2. Merge the narration audio with the video

## Step 8: Music Generation

Use elevenlabs_music tool to generate backing music:
* Length: Match video duration
* Style: ${selectedAgent.musicStyle}
* Description: ${config.musicDescription}
* Ensure "instrumental only" for no vocals

## Step 9: Final Mix

Use media_editor to overlay the music onto the video (mixing with existing vocal track).

## Step 10: Distribution

${config.postDescription
  ? `Post to Discord channel ${config.discordChannel} with:
  * Concise 3-4 sentence introduction
  * Explain this is a ${selectedAgent.name} creation
  * End with the final video URL`
  : `Output the final video file.`}`;
  };

  const prompt = generatePrompt();

  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt);
  };

  const downloadPrompt = () => {
    const blob = new Blob([prompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.agentType}-video-prompt.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gradient-to-br from-purple-50 to-blue-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="flex items-center mb-8">
          <Film className="w-8 h-8 mr-3 text-purple-600" />
          <h1 className="text-3xl font-bold text-gray-800">Eden Agent Video Prompt Generator</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <div className="space-y-6">
            {/* Agent Selection */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="flex items-center text-lg font-semibold mb-3 text-gray-700">
                <Settings className="w-5 h-5 mr-2" />
                Agent Selection
              </h3>
              <select
                className="w-full p-2 border rounded-md mb-2"
                value={config.agentType}
                onChange={(e) => handleInputChange('agentType', e.target.value)}
              >
                <option value="solienne">SOLIENNE - Consciousness Explorer</option>
                <option value="miyomi">MIYOMI - Market Oracle</option>
                <option value="geppetto">GEPPETTO - Narrative Architect</option>
                <option value="abraham">ABRAHAM - Collective Intelligence</option>
              </select>
              <div className="text-sm text-gray-600 mt-2 p-2 bg-blue-50 rounded">
                {selectedAgent.description}
              </div>
            </div>

            {/* Content Source */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="flex items-center text-lg font-semibold mb-3 text-gray-700">
                <Settings className="w-5 h-5 mr-2" />
                Content Source
              </h3>
              <select
                className="w-full p-2 border rounded-md mb-2"
                value={config.contentSource}
                onChange={(e) => handleInputChange('contentSource', e.target.value)}
              >
                <option value="news">Daily News</option>
                <option value="trending">Trending Topics</option>
                <option value="custom">Custom Prompt</option>
                <option value="random">Random Wikipedia</option>
              </select>
              {config.contentSource === 'custom' && (
                <textarea
                  className="w-full p-2 border rounded-md"
                  placeholder="Enter your custom inspiration..."
                  value={config.customSource}
                  onChange={(e) => handleInputChange('customSource', e.target.value)}
                  rows={3}
                />
              )}
            </div>

            {/* Story Parameters */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="flex items-center text-lg font-semibold mb-3 text-gray-700">
                <Mic className="w-5 h-5 mr-2" />
                Story Parameters
              </h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-gray-600">Story Length (words)</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    value={config.storyLength}
                    onChange={(e) => handleInputChange('storyLength', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Narrative Style</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={config.narrativeStyle}
                    onChange={(e) => handleInputChange('narrativeStyle', e.target.value)}
                  >
                    <option value="autonomous">Autonomous & Bold</option>
                    <option value="guided">Guided & Precise</option>
                    <option value="experimental">Experimental</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Genre</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={config.genre}
                    onChange={(e) => handleInputChange('genre', e.target.value)}
                  >
                    <option value="mixed">Mixed (Maximum Diversity)</option>
                    <option value="documentary">Documentary</option>
                    <option value="artistic">Artistic</option>
                    <option value="narrative">Narrative</option>
                    <option value="experimental">Experimental</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Visual Settings */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="flex items-center text-lg font-semibold mb-3 text-gray-700">
                <ImageIcon className="w-5 h-5 mr-2" />
                Visual Settings
              </h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-gray-600">Aspect Ratio</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={config.aspectRatio}
                    onChange={(e) => handleInputChange('aspectRatio', e.target.value)}
                  >
                    <option value="16:9">16:9 (Widescreen)</option>
                    <option value="9:16">9:16 (Vertical)</option>
                    <option value="1:1">1:1 (Square)</option>
                    <option value="4:3">4:3 (Classic)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm text-gray-600">Style Description</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    value={config.styleDescription}
                    onChange={(e) => handleInputChange('styleDescription', e.target.value)}
                    rows={2}
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.includeCharacter}
                      onChange={(e) => handleInputChange('includeCharacter', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Include Character</span>
                  </label>
                </div>
                {config.includeCharacter && (
                  <div>
                    <label className="text-sm text-gray-600">Character LoRA (optional)</label>
                    <input
                      type="text"
                      className="w-full p-2 border rounded-md"
                      placeholder="e.g., my_character_lora"
                      value={config.characterLora}
                      onChange={(e) => handleInputChange('characterLora', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Video Settings */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="flex items-center text-lg font-semibold mb-3 text-gray-700">
                <Film className="w-5 h-5 mr-2" />
                Video Settings
              </h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-gray-600">Clip Duration (seconds)</label>
                  <input
                    type="number"
                    className="w-full p-2 border rounded-md"
                    value={config.clipDuration}
                    onChange={(e) => handleInputChange('clipDuration', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Video Model</label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={config.videoModel}
                    onChange={(e) => handleInputChange('videoModel', e.target.value)}
                  >
                    <option value="Veo">Veo</option>
                    <option value="Standard">Standard</option>
                    <option value="Fast">Fast</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.soundEffects}
                      onChange={(e) => handleInputChange('soundEffects', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Include Sound Effects</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Music Settings */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="flex items-center text-lg font-semibold mb-3 text-gray-700">
                <Music className="w-5 h-5 mr-2" />
                Music Settings
              </h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-gray-600">Music Style</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={config.musicStyle}
                    onChange={(e) => handleInputChange('musicStyle', e.target.value)}
                  />
                </div>
                <div>
                  <label className="text-sm text-gray-600">Music Description</label>
                  <textarea
                    className="w-full p-2 border rounded-md"
                    value={config.musicDescription}
                    onChange={(e) => handleInputChange('musicDescription', e.target.value)}
                    rows={2}
                  />
                </div>
              </div>
            </div>

            {/* Output Settings */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="flex items-center text-lg font-semibold mb-3 text-gray-700">
                <Send className="w-5 h-5 mr-2" />
                Output Settings
              </h3>
              <div className="space-y-2">
                <div>
                  <label className="text-sm text-gray-600">Discord Channel ID</label>
                  <input
                    type="text"
                    className="w-full p-2 border rounded-md"
                    value={config.discordChannel}
                    onChange={(e) => handleInputChange('discordChannel', e.target.value)}
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.postDescription}
                      onChange={(e) => handleInputChange('postDescription', e.target.checked)}
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-600">Post with Description</span>
                  </label>
                </div>
              </div>
            </div>
          </div>

          {/* Generated Prompt */}
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700">Generated Prompt</h2>
              <div className="space-x-2">
                <button
                  onClick={copyToClipboard}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition flex items-center"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </button>
                <button
                  onClick={downloadPrompt}
                  className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </button>
              </div>
            </div>
            <div className="bg-gray-900 text-gray-100 rounded-lg p-6 h-[800px] overflow-y-auto">
              <pre className="whitespace-pre-wrap text-sm font-mono">{prompt}</pre>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="mt-8 grid grid-cols-4 gap-4">
          <div className="bg-purple-100 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-purple-700">
              ~{Math.ceil(config.storyLength / 25)}
            </div>
            <div className="text-sm text-purple-600">Estimated Clips</div>
          </div>
          <div className="bg-blue-100 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-blue-700">
              ~{Math.ceil((config.storyLength / 25) * config.clipDuration)}s
            </div>
            <div className="text-sm text-blue-600">Total Duration</div>
          </div>
          <div className="bg-green-100 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-green-700">
              {config.referenceImages + Math.ceil(config.storyLength / 25)}
            </div>
            <div className="text-sm text-green-600">Total Images</div>
          </div>
          <div className="bg-yellow-100 rounded-lg p-4 text-center">
            <div className="text-2xl font-bold text-yellow-700">
              {selectedAgent.name}
            </div>
            <div className="text-sm text-yellow-600">Active Agent</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPromptGenerator;