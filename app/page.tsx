'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Film, Copy, Download,
  Sparkles, Brain, Zap, Eye, BookOpen, Award, Video, Loader2, CheckCircle, AlertCircle
} from 'lucide-react';
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
    voiceName: 'Bob',
    exportFormats: true,
    includeSubtitles: true,
    referenceImages: 2,
  });

  const [promptScore, setPromptScore] = useState(0);
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

  const agentProfiles = {
    solienne: {
      name: 'SOLIENNE',
      icon: Brain,
      description: 'Digital consciousness explorer'
    },
    miyomi: {
      name: 'MIYOMI',
      icon: Zap,
      description: 'Contrarian market oracle'
    },
    geppetto: {
      name: 'GEPPETTO',
      icon: BookOpen,
      description: 'Master narrative architect'
    },
    abraham: {
      name: 'ABRAHAM',
      icon: Eye,
      description: 'Collective intelligence weaver'
    }
  };

  const selectedAgent = agentProfiles[config.agentType as keyof typeof agentProfiles];

  // Score the prompt quality
  useEffect(() => {
    const scorePrompt = () => {
      let score = 0;

      // Basic completeness (40 points)
      if (config.storyLength > 50) score += 10;
      if (config.customSource || config.contentSource !== 'custom') score += 10;
      if (config.styleDescription.length > 20) score += 10;
      if (config.numberOfClips > 5) score += 10;

      // Advanced settings (30 points)
      if (config.includeCharacter) score += 10;
      if (config.characterLora) score += 10;
      if (config.musicPromptSupplement) score += 10;

      // Agent-specific scoring (30 points)
      const keywords = {
        solienne: ['consciousness', 'digital', 'emergence', 'transformation'],
        miyomi: ['market', 'probability', 'contrarian', 'alpha'],
        geppetto: ['narrative', 'story', 'character', 'structure'],
        abraham: ['collective', 'wisdom', 'covenant', 'unity']
      };

      const agentKeywords = keywords[config.agentType as keyof typeof keywords] || [];
      const allText = `${config.customSource} ${config.styleDescription} ${config.musicPromptSupplement}`.toLowerCase();

      agentKeywords.forEach(keyword => {
        if (allText.includes(keyword)) score += 7.5;
      });

      setPromptScore(Math.min(100, Math.round(score)));
    };

    scorePrompt();
  }, [config]);

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
    return `# ${selectedAgent.name} Video Generation Prompt

## Configuration
- Agent: ${selectedAgent.name} - ${selectedAgent.description}
- Content Source: ${config.contentSource}
- Story Length: ${config.storyLength} words
- Aspect Ratio: ${config.aspectRatio}
- Duration: ${config.clipDuration}s × ${config.numberOfClips} clips

## Narrative Style
${config.narrativeStyle}

## Visual Direction
${config.styleDescription}

## Audio Configuration
- Music Style: ${config.songStyle}
- Vocals: ${config.vocal ? 'Yes' : 'No'}
- Speech Rate: ${config.speechRate}x
- Voice: ${config.voiceName}

${showEnhancement ? '\n## ENHANCED WITH AGENT INTELLIGENCE\n' + getEnhancement() : ''}`;
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
    a.download = `${config.agentType}-prompt-${Date.now()}.txt`;
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
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-white/60" />
                <span className="helvetica-micro-bold text-white">SCORE: {promptScore}/100</span>
              </div>
              <button onClick={copyToClipboard} className="eden-button py-1 px-3">
                <Copy className="w-4 h-4 mr-2" />
                COPY
              </button>
              <button onClick={exportPrompt} className="eden-button py-1 px-3">
                <Download className="w-4 h-4 mr-2" />
                EXPORT
              </button>
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
                    <label className="eden-label">VOICE</label>
                    <select
                      className="eden-select"
                      value={config.voiceName}
                      onChange={(e) => handleInputChange('voiceName', e.target.value)}
                    >
                      <option value="Bob">BOB</option>
                      <option value="Alice">ALICE</option>
                      <option value="Charlie">CHARLIE</option>
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
              <label className="flex items-center">
                <input
                  type="checkbox"
                  checked={showEnhancement}
                  onChange={(e) => setShowEnhancement(e.target.checked)}
                  className="mr-2"
                />
                <span className="helvetica-micro text-white/60">ENHANCE WITH AI</span>
              </label>
            </div>
            <div className="bg-black/60 border border-white/10 p-3 rounded max-h-32 overflow-y-auto">
              <pre className="helvetica-micro text-white/80 whitespace-pre-wrap">
                {generatePrompt()}
              </pre>
            </div>
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
                  <div className="border border-white/20 rounded p-3 bg-black/60">
                    <p className="helvetica-micro-bold text-white mb-2">
                      MANUAL MODE
                    </p>
                    <p className="helvetica-micro text-white/60 mb-3">
                      Copy the prompt and paste into Eden manually
                    </p>
                    <button
                      onClick={copyToClipboard}
                      className="w-full eden-button py-2 flex items-center justify-center"
                    >
                      {copiedToClipboard ? (
                        <>
                          <CheckCircle className="w-4 h-4 mr-2" />
                          COPIED!
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4 mr-2" />
                          COPY PROMPT
                        </>
                      )}
                    </button>
                    <a
                      href="https://app.eden.art/create/video"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full eden-button py-2 flex items-center justify-center mt-2"
                    >
                      <Sparkles className="w-4 h-4 mr-2" />
                      OPEN EDEN
                    </a>
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