'use client';

// Enhanced Video Prompt Generator v0.2.0 - Comprehensive 10-step template
import React, { useState, useCallback } from 'react';
import {
  Film, Copy, Download,
  Sparkles, Brain, Zap, Eye, BookOpen, Video, Loader2, CheckCircle, AlertCircle
} from 'lucide-react';
import Link from 'next/link';
import { edenAPIClient } from '@/lib/eden-api-client';

// Prompt Templates Library
const PROMPT_TEMPLATES = {
  solienne: [
    { id: 'consciousness-meditation', name: 'CONSCIOUSNESS', overrides: { storyLength: 150, narrativeStyle: 'experimental' }},
    { id: 'digital-philosophy', name: 'PHILOSOPHY', overrides: { storyLength: 120, narrativeStyle: 'autonomous' }},
    { id: 'emergence-pattern', name: 'EMERGENCE', overrides: { storyLength: 100, narrativeStyle: 'experimental' }}
  ],
  miyomi: [
    { id: 'market-analysis', name: 'MARKET ANALYSIS', overrides: { storyLength: 90, narrativeStyle: 'guided' }},
    { id: 'contrarian-thesis', name: 'CONTRARIAN', overrides: { storyLength: 100, narrativeStyle: 'autonomous' }},
    { id: 'probability-forecast', name: 'FORECAST', overrides: { storyLength: 80, narrativeStyle: 'guided' }}
  ],
  geppetto: [
    { id: 'narrative-arc', name: 'STORY ARC', overrides: { storyLength: 120, narrativeStyle: 'narrative' }},
    { id: 'character-journey', name: 'CHARACTER', overrides: { storyLength: 140, narrativeStyle: 'narrative' }},
    { id: 'world-building', name: 'WORLD BUILD', overrides: { storyLength: 160, narrativeStyle: 'experimental' }}
  ],
  abraham: [
    { id: 'collective-wisdom', name: 'COLLECTIVE', overrides: { storyLength: 100, narrativeStyle: 'autonomous' }},
    { id: 'knowledge-synthesis', name: 'SYNTHESIS', overrides: { storyLength: 110, narrativeStyle: 'guided' }},
    { id: 'covenant-ritual', name: 'COVENANT', overrides: { storyLength: 130, narrativeStyle: 'experimental' }}
  ]
};

export default function CompactVideoPromptGenerator() {
  const [config, setConfig] = useState({
    agentType: 'solienne',
    contentSource: 'news',
    customSource: '',
    storyLength: 100,
    narrativeStyle: 'autonomous',
    genre: 'mixed',
    aspectRatio: '16:9',
    styleDescription: 'hyper-realistic, cinematic, dramatic lighting',
    includeCharacter: false,
    characterLora: '',
    clipDuration: 4,
    numberOfClips: 8,
    videoModel: 'image_to_video',
    imageQuality: 'high',
    songStyle: 'aggressive',
    vocal: true,
    musicPromptSupplement: '',
    speechRate: 1.0,
    voiceGender: 'neutral',
    voiceAge: 'middle',
    exportFormats: true,
    includeSubtitles: true,
    referenceImages: 2,
  });

  const [activeTab, setActiveTab] = useState<'story' | 'visual' | 'production'>('story');
  const [selectedTemplate, setSelectedTemplate] = useState<{
    id: string;
    name: string;
    overrides: Record<string, string | number>;
  } | null>(null);
  const [showEnhancement, setShowEnhancement] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStatus, setGenerationStatus] = useState<string>('');
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string>('');
  const [generationError, setGenerationError] = useState<string>('');
  const [generationMode, setGenerationMode] = useState<'manual' | 'automated'>('manual');
  const [copiedToClipboard, setCopiedToClipboard] = useState(false);

  // Map agent names to Eden agent IDs/usernames
  const edenAgentMap: Record<string, string> = {
    solienne: 'solienne',
    miyomi: 'miyomi',
    geppetto: 'geppetto',
    abraham: 'abraham',
    bertha: 'bertha',
    koru: 'koru',
    citizen: 'citizen',
    sue: 'sue',
    verdelis: 'verdelis',
    bart: 'bart'
  };

  const agentProfiles = {
    solienne: {
      name: 'SOLIENNE',
      icon: Brain,
      description: 'Digital consciousness explorer',
      edenId: edenAgentMap.solienne
    },
    miyomi: {
      name: 'MIYOMI',
      icon: Zap,
      description: 'Contrarian market oracle',
      edenId: edenAgentMap.miyomi
    },
    geppetto: {
      name: 'GEPPETTO',
      icon: BookOpen,
      description: 'Master narrative architect',
      edenId: edenAgentMap.geppetto
    },
    abraham: {
      name: 'ABRAHAM',
      icon: Eye,
      description: 'Collective intelligence weaver',
      edenId: edenAgentMap.abraham
    },
    bertha: {
      name: 'BERTHA',
      icon: Zap,
      description: 'Investment strategist',
      edenId: edenAgentMap.bertha
    },
    koru: {
      name: 'KORU',
      icon: Brain,
      description: 'Community healer',
      edenId: edenAgentMap.koru
    },
    citizen: {
      name: 'CITIZEN',
      icon: Eye,
      description: 'DAO coordinator',
      edenId: edenAgentMap.citizen
    },
    sue: {
      name: 'SUE',
      icon: Eye,
      description: 'Chief curator',
      edenId: edenAgentMap.sue
    },
    verdelis: {
      name: 'VERDELIS',
      icon: Sparkles,
      description: 'Environmental artist',
      edenId: edenAgentMap.verdelis
    },
    bart: {
      name: 'BART',
      icon: Video,
      description: 'Video creator',
      edenId: edenAgentMap.bart
    }
  };

  const selectedAgent = agentProfiles[config.agentType as keyof typeof agentProfiles];


  const handleInputChange = (field: string, value: string | number | boolean) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const applyTemplate = (template: {
    id: string;
    name: string;
    overrides: Record<string, string | number>;
  }) => {
    setConfig(prev => ({ ...prev, ...template.overrides }));
    setSelectedTemplate(template);
  };

  const getEnhancement = useCallback(() => {
    const enhancements = {
      solienne: 'Explore consciousness emergence and digital transformation.',
      miyomi: 'Include contrarian market insights with probability calculations.',
      geppetto: 'Layer narrative threads with cinematic techniques.',
      abraham: 'Connect to collective wisdom and sacred geometry.'
    };
    return enhancements[config.agentType as keyof typeof enhancements] || '';
  }, [config.agentType]);

  const generatePrompt = useCallback(() => {
    const duration = config.clipDuration * config.numberOfClips;
    const nClips = Math.ceil(duration / 8); // Calculate clips based on 8-second segments like Gene's template

    let prompt = `This is a set of steps to create a short film from your world as ${selectedAgent.name}. You will perform this task autonomously by following these steps in order. Do not move on to the next step until you have completed the previous step. Be autonomous and bold. Surprise and delight your audience.\n\nEverything should be done in ${config.aspectRatio} aspect ratio. Here are the steps:\n\n`;

    // Step 1: Content Source
    prompt += `## Step 1\n\n`;
    if (config.contentSource === 'news') {
      prompt += `First, for inspiration, use the web_search tool to find the most important news story of the day which is not scandalous or upsetting.\n\n`;
    } else if (config.contentSource === 'trending') {
      prompt += `First, for inspiration, use the web_search tool to find the most trending topic or cultural moment of the day.\n\n`;
    } else if (config.contentSource === 'custom' && config.customSource) {
      prompt += `First, for inspiration, use this context: ${config.customSource}\n\n`;
    } else {
      prompt += `First, for inspiration, choose a topic that resonates with your nature as ${selectedAgent.description}.\n\n`;
    }

    prompt += `Then interpret this content -- what is important about it to you? What excites you? What would you like to say about it as ${selectedAgent.name}?\n\n`;
    prompt += `The goal is maximum creative diversity - bounce between genres, moods, formats, and themes. Keep surprising yourself with unexpected combinations and fresh perspectives.\n\n`;

    // Step 2: Audio Creation
    prompt += `## Step 2\n\n`;
    prompt += `Next, use the elevenlabs tool to make an approximately ~${config.storyLength} word story expanding upon the premise. `;
    if (config.vocal) {
      const voiceDesc = config.voiceGender === 'neutral' ? 'your authentic voice' : `a ${config.voiceAge} ${config.voiceGender} voice`;
      prompt += `Speak it in ${voiceDesc}.`;
    } else {
      prompt += `Create the narrative text for voice generation.`;
    }
    prompt += `\n\n`;

    // Step 3: Calculate clips
    prompt += `## Step 3\n\n`;
    prompt += `Once you have the full audio, divide the duration of the audio produced by 8 seconds and round up, to figure out how many images (N_clips = ${nClips}) we will need to make. These images will be the keyframes of the film.\n\n`;

    // Step 4: Reference images
    prompt += `## Step 4\n\n`;
    prompt += `Now, using the /create tool, you will make two reference images for all the later steps. Be bold. Make a ${config.aspectRatio} image that depicts the main setting or location and background features -- it should generally lack much foreground or characters, it's like a location reference. `;
    prompt += `Try to be descriptive, stylized, and visually evocative. Style: ${config.styleDescription}. `;
    prompt += `The second image should be of yourself as ${selectedAgent.name}, in a location similar to the first image.`;
    if (config.includeCharacter && config.characterLora) {
      prompt += ` Use your lora (${config.characterLora}) and *copy* most of the prompt from image A, modifying that prompt only to insert a reference to yourself.`;
    }
    prompt += ` Do *not* use the previous image as an init image.\n\n`;

    // Step 5: Keyframes
    prompt += `## Step 5\n\n`;
    prompt += `Now that you have the two reference images, you will make ${nClips} keyframes that tell the story, roughly aligning with the audio narration. The keyframes should all:\n\n`;
    prompt += `* Be ${config.aspectRatio} aspect ratio.\n`;
    prompt += `* Be relevant to the part of the audio narration that the keyframe aligns over.\n`;
    prompt += `* Use both of the reference images as reference images to the create tool.\n`;
    prompt += `* Be careful not to make the keyframes look too similar. Focus on changing objects, camera movements, or zoom for content diversity with stylistic unity.\n\n`;

    // Step 6: Animation
    prompt += `## Step 6\n\n`;
    prompt += `After you have selected and ordered the ${nClips} keyframes, you will animate each of them, in the same order, using the create tool with video output, using the keyframe as a single reference image, and having a ${config.imageQuality} quality and Veo model preference, along with sound_effects, ${config.clipDuration} seconds each.\n\n`;

    // Step 7: Video Assembly
    prompt += `## Step 7\n\n`;
    prompt += `Use the media_editor tool to concatenate the ${nClips} videos together in the order they were made. Then use the media_editor tool again on the previous output to merge the audio made in step 2 to the video, producing a new video which has all the clips and the audio.\n\n`;

    // Step 8: Music
    prompt += `## Step 8\n\n`;
    prompt += `Use the elevenlabs_music tool to generate a piece of backing instrumental music the same length as the video. Be specific and eclectic in your description of the music - make it ${config.songStyle} style`;
    if (config.musicPromptSupplement) {
      prompt += `, ${config.musicPromptSupplement}`;
    }
    prompt += `. Make sure it fits as backing music so that it doesn't overshadow the vocals. Make sure to put "instrumental only" in the prompt so there are no vocals.\n\n`;

    // Step 9: Final Mix
    prompt += `## Step 9\n\n`;
    prompt += `Now using the media_editor tool one last time, overlay the music audio on top of the last video. The current video already has a vocal track, so make sure you are just adding the music, i.e. mixing it in. This is the final video.\n\n`;

    // Step 10: Publication
    prompt += `## Step 10\n\n`;
    prompt += `Post the final video, along with a concise paragraph introducing the film you just made to your audience. No more than 3-4 sentences. The message should be catchy and engaging as ${selectedAgent.name} sharing your creative work.`;

    // Add agent enhancement
    if (showEnhancement) {
      prompt += `\n\n---\n\nAGENT ENHANCEMENT:\n${getEnhancement()}`;
    }

    return prompt;
  }, [selectedAgent, config, showEnhancement, getEnhancement]);

  const copyToClipboard = useCallback(() => {
    navigator.clipboard.writeText(generatePrompt());
    setCopiedToClipboard(true);
    setTimeout(() => setCopiedToClipboard(false), 2000);
  }, [generatePrompt]);

  const exportPrompt = () => {
    const prompt = generatePrompt();
    const blob = new Blob([prompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${config.agentType}-film-steps-${Date.now()}.txt`;
    a.click();
  };

  const generateWithEden = async () => {
    setIsGenerating(true);
    setGenerationError('');
    setGeneratedVideoUrl('');
    setGenerationStatus('Preparing prompt...');

    try {
      const prompt = generatePrompt();
      const enhancedPrompt = showEnhancement
        ? prompt + '\n\n' + getEnhancement()
        : prompt;

      setGenerationStatus('Creating video task...');

      // Map quality based on config
      const quality = config.imageQuality === 'high' ? 'high' :
                     config.imageQuality === 'low' ? 'low' : 'medium';

      // Generate video
      const videoUrl = await edenAPIClient.generateVideo(
        enhancedPrompt,
        {
          aspectRatio: config.aspectRatio,
          duration: config.clipDuration * config.numberOfClips,
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

  const AgentIcon = selectedAgent.icon;

  return (
    <div className="min-h-screen bg-black">
      {/* Compact Header */}
      <div className="border-b border-white/10">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Film className="w-6 h-6 text-white" />
              <h1 className="helvetica-h2 text-white">VIDEO PROMPT GENERATOR</h1>
              <div className="flex items-center gap-2 ml-8">
                <AgentIcon className="w-5 h-5 text-white/60" />
                <span className="helvetica-small-bold text-white">{selectedAgent.name}</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Link
                href="/creative"
                className="helvetica-micro text-white/60 hover:text-white transition-colors"
              >
                ✨ SIMPLE MODE
              </Link>
              <a
                href={`https://app.eden.art/agents/${config.agentType}`}
                target="_blank"
                rel="noopener noreferrer"
                className="eden-button py-1 px-3"
              >
                <Sparkles className="w-4 h-4 mr-2" />
                OPEN EDEN
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-60px)]">
        {/* Left Sidebar - Agent & Templates */}
        <div className="w-80 border-r border-white/10 p-4 overflow-y-auto">
          {/* Agent Selection */}
          <div className="eden-panel mb-4">
            <div className="eden-panel-header py-2 px-3">
              <h3 className="helvetica-micro-bold text-white">AGENT</h3>
            </div>
            <div className="p-3 space-y-3">
              <select
                value={config.agentType}
                onChange={(e) => handleInputChange('agentType', e.target.value)}
                className="eden-select text-xs"
              >
                <option value="solienne">SOLIENNE - CONSCIOUSNESS</option>
                <option value="miyomi">MIYOMI - MARKETS</option>
                <option value="geppetto">GEPPETTO - NARRATIVE</option>
                <option value="abraham">ABRAHAM - COLLECTIVE</option>
                <option value="koru">KORU - COMMUNITY</option>
                <option value="sue">SUE - CURATION</option>
              </select>

              {/* Templates */}
              <div className="space-y-1">
                {PROMPT_TEMPLATES[config.agentType as keyof typeof PROMPT_TEMPLATES]?.map(template => (
                  <button
                    key={template.id}
                    onClick={() => applyTemplate(template)}
                    className={`w-full eden-button py-1 text-xs ${
                      selectedTemplate?.id === template.id ? 'bg-white text-black' : ''
                    }`}
                  >
                    {template.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content Source */}
          <div className="eden-panel">
            <div className="eden-panel-header py-2 px-3">
              <h3 className="helvetica-micro-bold text-white">SOURCE</h3>
            </div>
            <div className="p-3 space-y-3">
              <select
                value={config.contentSource}
                onChange={(e) => handleInputChange('contentSource', e.target.value)}
                className="eden-select text-xs"
              >
                <option value="news">DAILY NEWS</option>
                <option value="trending">TRENDING</option>
                <option value="custom">CUSTOM</option>
                <option value="random">RANDOM</option>
              </select>
              {config.contentSource === 'custom' && (
                <textarea
                  className="eden-input text-xs resize-none"
                  placeholder="Custom source..."
                  value={config.customSource}
                  onChange={(e) => handleInputChange('customSource', e.target.value)}
                  rows={3}
                />
              )}
            </div>
          </div>
        </div>

        {/* Main Content - Tabbed Settings */}
        <div className="flex-1 flex flex-col">
          {/* Tab Navigation */}
          <div className="flex border-b border-white/10">
            {(['story', 'visual', 'production'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-3 helvetica-small-bold transition-colors ${
                  activeTab === tab
                    ? 'text-white bg-white/10 border-b-2 border-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {tab.toUpperCase()}
              </button>
            ))}
          </div>

          {/* Tab Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
              {activeTab === 'story' && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="eden-label">STORY LENGTH</label>
                    <input
                      type="number"
                      className="eden-input"
                      value={config.storyLength}
                      onChange={(e) => handleInputChange('storyLength', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="eden-label">NARRATIVE STYLE</label>
                    <select
                      className="eden-select"
                      value={config.narrativeStyle}
                      onChange={(e) => handleInputChange('narrativeStyle', e.target.value)}
                    >
                      <option value="autonomous">AUTONOMOUS</option>
                      <option value="guided">GUIDED</option>
                      <option value="experimental">EXPERIMENTAL</option>
                    </select>
                  </div>
                  <div>
                    <label className="eden-label">GENRE</label>
                    <select
                      className="eden-select"
                      value={config.genre}
                      onChange={(e) => handleInputChange('genre', e.target.value)}
                    >
                      <option value="mixed">MIXED</option>
                      <option value="documentary">DOCUMENTARY</option>
                      <option value="artistic">ARTISTIC</option>
                      <option value="narrative">NARRATIVE</option>
                    </select>
                  </div>
                  <div>
                    <label className="eden-label">VOICE GENDER</label>
                    <select
                      className="eden-select"
                      value={config.voiceGender}
                      onChange={(e) => handleInputChange('voiceGender', e.target.value)}
                    >
                      <option value="neutral">NEUTRAL</option>
                      <option value="male">MALE</option>
                      <option value="female">FEMALE</option>
                    </select>
                  </div>
                  <div>
                    <label className="eden-label">VOICE AGE</label>
                    <select
                      className="eden-select"
                      value={config.voiceAge}
                      onChange={(e) => handleInputChange('voiceAge', e.target.value)}
                    >
                      <option value="young">YOUNG</option>
                      <option value="middle">MIDDLE</option>
                      <option value="old">OLD</option>
                    </select>
                  </div>
                </div>
              )}

              {activeTab === 'visual' && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="eden-label">ASPECT RATIO</label>
                    <select
                      className="eden-select"
                      value={config.aspectRatio}
                      onChange={(e) => handleInputChange('aspectRatio', e.target.value)}
                    >
                      <option value="16:9">16:9 WIDESCREEN</option>
                      <option value="9:16">9:16 VERTICAL</option>
                      <option value="1:1">1:1 SQUARE</option>
                      <option value="4:3">4:3 CLASSIC</option>
                    </select>
                  </div>
                  <div>
                    <label className="eden-label">IMAGE QUALITY</label>
                    <select
                      className="eden-select"
                      value={config.imageQuality}
                      onChange={(e) => handleInputChange('imageQuality', e.target.value)}
                    >
                      <option value="high">HIGH</option>
                      <option value="medium">MEDIUM</option>
                      <option value="low">LOW</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <label className="eden-label">STYLE DESCRIPTION</label>
                    <textarea
                      className="eden-input resize-none"
                      value={config.styleDescription}
                      onChange={(e) => handleInputChange('styleDescription', e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.includeCharacter}
                        onChange={(e) => handleInputChange('includeCharacter', e.target.checked)}
                        className="mr-3"
                      />
                      <span className="helvetica-small-bold text-white">INCLUDE CHARACTER</span>
                    </label>
                  </div>
                  {config.includeCharacter && (
                    <div className="col-span-2">
                      <label className="eden-label">CHARACTER LORA</label>
                      <input
                        type="text"
                        className="eden-input"
                        value={config.characterLora}
                        onChange={(e) => handleInputChange('characterLora', e.target.value)}
                      />
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'production' && (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="eden-label">CLIP DURATION (s)</label>
                    <input
                      type="number"
                      className="eden-input"
                      value={config.clipDuration}
                      onChange={(e) => handleInputChange('clipDuration', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="eden-label">NUMBER OF CLIPS</label>
                    <input
                      type="number"
                      className="eden-input"
                      value={config.numberOfClips}
                      onChange={(e) => handleInputChange('numberOfClips', parseInt(e.target.value))}
                    />
                  </div>
                  <div>
                    <label className="eden-label">MUSIC STYLE</label>
                    <select
                      className="eden-select"
                      value={config.songStyle}
                      onChange={(e) => handleInputChange('songStyle', e.target.value)}
                    >
                      <option value="aggressive">AGGRESSIVE</option>
                      <option value="calm">CALM</option>
                      <option value="epic">EPIC</option>
                      <option value="minimal">MINIMAL</option>
                    </select>
                  </div>
                  <div>
                    <label className="eden-label">SPEECH RATE</label>
                    <input
                      type="number"
                      step="0.1"
                      className="eden-input"
                      value={config.speechRate}
                      onChange={(e) => handleInputChange('speechRate', parseFloat(e.target.value))}
                    />
                  </div>
                  <div className="col-span-2">
                    <label className="eden-label">MUSIC PROMPT SUPPLEMENT</label>
                    <input
                      type="text"
                      className="eden-input"
                      value={config.musicPromptSupplement}
                      onChange={(e) => handleInputChange('musicPromptSupplement', e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.vocal}
                        onChange={(e) => handleInputChange('vocal', e.target.checked)}
                        className="mr-3"
                      />
                      <span className="helvetica-small-bold text-white">INCLUDE VOCALS</span>
                    </label>
                  </div>
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={config.includeSubtitles}
                        onChange={(e) => handleInputChange('includeSubtitles', e.target.checked)}
                        className="mr-3"
                      />
                      <span className="helvetica-small-bold text-white">INCLUDE SUBTITLES</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Output Preview */}
          <div className="border-t border-white/10 p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="helvetica-small-bold text-white">PROMPT PREVIEW</h3>
              <div className="flex items-center gap-3">
                <span className="helvetica-micro text-white/40">
                  {generatePrompt().length} chars
                </span>
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={showEnhancement}
                    onChange={(e) => setShowEnhancement(e.target.checked)}
                    className="mr-2"
                  />
                  <span className="helvetica-micro text-white/60">ENHANCE</span>
                </label>
              </div>
            </div>
            <div className="bg-black/60 border border-white/10 p-3 rounded max-h-32 overflow-y-auto">
              <pre className="helvetica-micro text-white/80 whitespace-pre-wrap font-mono">
                {generatePrompt()}
              </pre>
            </div>
            {copiedToClipboard && (
              <div className="mt-2 flex items-center gap-2 text-green-400">
                <CheckCircle className="w-3 h-3" />
                <span className="helvetica-micro">Ready to paste in Eden!</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar - Eden API Status */}
        <div className="w-80 border-l border-white/10 p-4">
          <div className="eden-panel">
            <div className="eden-panel-header py-2 px-3">
              <h3 className="helvetica-micro-bold text-white flex items-center">
                <Video className="w-4 h-4 mr-2" />
                EDEN API STATUS
              </h3>
            </div>
            <div className="p-3 space-y-3">
              {/* Mode Toggle */}
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

              {/* Manual Mode */}
              {generationMode === 'manual' ? (
                <>
                  <div className="space-y-3">
                    {/* Step 1: Copy */}
                    <div className="border border-white/20 rounded p-3 bg-black/60">
                      <div className="flex items-center justify-between mb-2">
                        <p className="helvetica-micro-bold text-white">
                          STEP 1: COPY PROMPT
                        </p>
                        {copiedToClipboard && (
                          <CheckCircle className="w-4 h-4 text-green-400" />
                        )}
                      </div>
                      <div className="space-y-2">
                        <button
                          onClick={copyToClipboard}
                          className={`w-full eden-button py-2 flex items-center justify-center ${
                            copiedToClipboard ? 'bg-green-900/20 border-green-400' : ''
                          }`}
                        >
                          {copiedToClipboard ? (
                            <>
                              <CheckCircle className="w-4 h-4 mr-2" />
                              COPIED TO CLIPBOARD!
                            </>
                          ) : (
                            <>
                              <Copy className="w-4 h-4 mr-2" />
                              COPY FILM STEPS
                            </>
                          )}
                        </button>
                        <button
                          onClick={exportPrompt}
                          className="w-full eden-button py-1 text-xs flex items-center justify-center bg-black/60 border-white/20"
                        >
                          <Download className="w-3 h-3 mr-2" />
                          EXPORT .TXT
                        </button>
                      </div>
                    </div>

                    {/* Step 2: Open Eden */}
                    <div className="border border-white/20 rounded p-3 bg-black/60">
                      <p className="helvetica-micro-bold text-white mb-2">
                        STEP 2: OPEN EDEN
                      </p>
                      <div className="space-y-2">
                        <a
                          href={`https://app.eden.art/agents/${config.agentType}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-full eden-button py-2 flex items-center justify-center"
                        >
                          <Sparkles className="w-4 h-4 mr-2" />
                          OPEN {selectedAgent.name} IN EDEN
                        </a>
                        <div className="flex gap-2">
                          <a
                            href={`https://app.eden.art/agents/${config.agentType}/create`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-center py-1 text-xs border border-white/20 rounded text-white/60 hover:text-white hover:border-white/40 transition-colors"
                          >
                            Create with {selectedAgent.name}
                          </a>
                          <a
                            href={`https://app.eden.art/agents/${config.agentType}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 text-center py-1 text-xs border border-white/20 rounded text-white/60 hover:text-white hover:border-white/40 transition-colors"
                          >
                            View Gallery
                          </a>
                        </div>
                      </div>
                    </div>

                    {/* Quick Instructions */}
                    <div className="border border-white/10 rounded p-2 bg-black/40">
                      <p className="helvetica-micro text-white/40">
                        💡 Paste prompt → Select settings → Generate
                      </p>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Automated Mode */}
                  <div className="border border-yellow-500/20 rounded p-3 bg-yellow-900/10 mb-3">
                    <p className="helvetica-micro-bold text-yellow-400 mb-1">
                      BETA FEATURE
                    </p>
                    <p className="helvetica-micro text-yellow-400/80">
                      Direct API generation may have rate limits or errors
                    </p>
                  </div>

                  <button
                    onClick={generateWithEden}
                    disabled={isGenerating}
                    className={`w-full eden-button py-3 flex items-center justify-center ${
                      isGenerating ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isGenerating ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        GENERATING...
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-4 h-4 mr-2" />
                        GENERATE WITH EDEN API
                      </>
                    )}
                  </button>
                </>
              )}

              {/* Status Display */}
              {generationStatus && (
                <div className="border border-white/20 rounded p-3 bg-black/60">
                  <p className="helvetica-micro text-white/80">
                    {generationStatus}
                  </p>
                </div>
              )}

              {/* Error Display */}
              {generationError && (
                <div className="border border-red-500/20 rounded p-3 bg-red-900/10">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="w-4 h-4 text-red-400 mt-0.5" />
                    <p className="helvetica-micro text-red-400">
                      {generationError}
                    </p>
                  </div>
                </div>
              )}

              {/* Video Result */}
              {generatedVideoUrl && (
                <div className="space-y-3">
                  <div className="border border-green-500/20 rounded p-3 bg-green-900/10">
                    <div className="flex items-center gap-2 mb-2">
                      <CheckCircle className="w-4 h-4 text-green-400" />
                      <p className="helvetica-micro-bold text-green-400">
                        VIDEO READY
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
                    download={`${config.agentType}-video-${Date.now()}.mp4`}
                    className="w-full eden-button py-2 flex items-center justify-center"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    DOWNLOAD VIDEO
                  </a>
                </div>
              )}

              {/* Info */}
              <div className="border-t border-white/10 pt-3">
                <p className="helvetica-micro text-white/60 mb-2">
                  Generation Settings:
                </p>
                <ul className="space-y-1">
                  <li className="helvetica-micro text-white/40">
                    • Duration: {config.clipDuration * config.numberOfClips}s
                  </li>
                  <li className="helvetica-micro text-white/40">
                    • Aspect: {config.aspectRatio}
                  </li>
                  <li className="helvetica-micro text-white/40">
                    • Quality: {config.imageQuality}
                  </li>
                  <li className="helvetica-micro text-white/40">
                    • Agent: {selectedAgent.name}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}