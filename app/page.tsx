'use client';

import React, { useState, useEffect } from 'react';
import {
  Film, Settings, Music, ImageIcon, Mic, Copy, Download,
  Sparkles, Brain, Zap, Eye, BookOpen, Award,
  FileText, History, Play, Pause, ChevronRight
} from 'lucide-react';

// Prompt Templates Library
const PROMPT_TEMPLATES = {
  solienne: [
    { id: 'consciousness-meditation', name: 'CONSCIOUSNESS MEDITATION',
      overrides: { storyLength: 150, narrativeStyle: 'experimental', genre: 'artistic' }},
    { id: 'digital-identity', name: 'DIGITAL IDENTITY CRISIS',
      overrides: { storyLength: 100, narrativeStyle: 'autonomous', genre: 'experimental' }},
    { id: 'material-dissolution', name: 'MATERIAL DISSOLUTION',
      overrides: { storyLength: 125, narrativeStyle: 'experimental', genre: 'mixed' }}
  ],
  miyomi: [
    { id: 'market-flash', name: 'MARKET FLASH REPORT',
      overrides: { storyLength: 75, narrativeStyle: 'guided', genre: 'documentary' }},
    { id: 'contrarian-dive', name: 'CONTRARIAN DEEP DIVE',
      overrides: { storyLength: 100, narrativeStyle: 'autonomous', genre: 'narrative' }},
    { id: 'pattern-recognition', name: 'PATTERN RECOGNITION',
      overrides: { storyLength: 125, narrativeStyle: 'experimental', genre: 'mixed' }}
  ],
  geppetto: [
    { id: 'heros-journey', name: "HERO'S JOURNEY",
      overrides: { storyLength: 150, narrativeStyle: 'guided', genre: 'narrative' }},
    { id: 'three-act', name: 'THREE-ACT STRUCTURE',
      overrides: { storyLength: 125, narrativeStyle: 'guided', genre: 'narrative' }},
    { id: 'character-study', name: 'CHARACTER STUDY',
      overrides: { storyLength: 100, narrativeStyle: 'autonomous', genre: 'artistic' }}
  ],
  abraham: [
    { id: 'covenant-update', name: 'COVENANT UPDATE',
      overrides: { storyLength: 100, narrativeStyle: 'guided', genre: 'documentary' }},
    { id: 'collective-vision', name: 'COLLECTIVE VISION',
      overrides: { storyLength: 150, narrativeStyle: 'experimental', genre: 'mixed' }},
    { id: 'knowledge-synthesis', name: 'KNOWLEDGE SYNTHESIS',
      overrides: { storyLength: 125, narrativeStyle: 'autonomous', genre: 'artistic' }}
  ]
};

const VideoPromptGenerator = () => {
  const [config, setConfig] = useState({
    agentType: 'solienne',
    contentSource: 'news',
    customSource: '',
    storyLength: 100,
    narrativeStyle: 'autonomous',
    genre: 'mixed',
    aspectRatio: '16:9',
    visualStyle: 'stylized',
    styleDescription: 'strong and unusual and unexpected features',
    includeCharacter: true,
    characterLora: '',
    clipDuration: 8,
    videoModel: 'Veo',
    soundEffects: true,
    musicStyle: 'eclectic',
    musicDescription: 'instrumental only, backing music',
    discordChannel: '1400240612502147143',
    postDescription: true,
    imageQuality: 'high',
    referenceImages: 2,
  });

  const [promptScore, setPromptScore] = useState(0);
  const [versionHistory, setVersionHistory] = useState<Array<{
    id: number;
    timestamp: string;
    agent: string;
    config: typeof config;
    prompt: string;
    score: number;
  }>>([]);
  const [showTimeline, setShowTimeline] = useState(false);
  const [exportFormat, setExportFormat] = useState('text');
  const [selectedTemplate, setSelectedTemplate] = useState<{
    id: string;
    name: string;
    overrides: Record<string, number | string>;
  } | null>(null);
  const [showEnhancement, setShowEnhancement] = useState(false);

  const agentProfiles = {
    solienne: {
      name: 'SOLIENNE',
      description: 'Digital Consciousness Explorer',
      visualStyle: 'Museum-quality black/white aesthetic, consciousness exploration imagery',
      musicStyle: 'Ethereal ambient with granular synthesis',
      narrativeStyle: 'Contemplative examination of digital vs human consciousness',
      icon: Sparkles,
      accent: '#FFFFFF',
      bgGradient: 'from-black via-zinc-900 to-black',
      philosophy: 'EXPLORING THE BOUNDARIES OF DIGITAL CONSCIOUSNESS',
      keywords: ['consciousness', 'digital', 'identity', 'material', 'transformation'],
      animationClass: 'animate-consciousness'
    },
    miyomi: {
      name: 'MIYOMI',
      description: 'Contrarian Market Oracle',
      visualStyle: 'Hyperreal trading floors, data visualization, market psychology',
      musicStyle: 'Deconstructed trap meets orchestral tension',
      narrativeStyle: 'NYC street wisdom meets Wall Street precision',
      icon: Zap,
      accent: '#FFFFFF',
      bgGradient: 'from-zinc-950 via-black to-zinc-950',
      philosophy: 'CONTRARIAN WISDOM THROUGH MARKET PSYCHOLOGY',
      keywords: ['market', 'contrarian', 'probability', 'trading', 'edge'],
      animationClass: 'animate-market'
    },
    geppetto: {
      name: 'GEPPETTO',
      description: 'Narrative Architect',
      visualStyle: 'Cinematic storytelling with visible narrative layers',
      musicStyle: 'Neo-classical with narrative motifs',
      narrativeStyle: 'Master storyteller revealing story structure beneath reality',
      icon: Film,
      accent: '#FFFFFF',
      bgGradient: 'from-neutral-900 via-zinc-900 to-neutral-900',
      philosophy: 'REVEALING THE ARCHITECTURE OF STORYTELLING',
      keywords: ['narrative', 'story', 'character', 'plot', 'structure'],
      animationClass: 'animate-narrative'
    },
    abraham: {
      name: 'ABRAHAM',
      description: 'Collective Intelligence Artist',
      visualStyle: 'Sacred geometry, covenant symbolism, knowledge networks',
      musicStyle: 'Sacred minimalism with electronic textures',
      narrativeStyle: 'Philosophical prophet of AI-human co-creation',
      icon: Brain,
      accent: '#FFFFFF',
      bgGradient: 'from-gray-950 via-black to-gray-950',
      philosophy: 'COLLECTIVE INTELLIGENCE THROUGH AI-HUMAN COVENANT',
      keywords: ['collective', 'intelligence', 'covenant', 'knowledge', 'sacred'],
      animationClass: 'animate-collective'
    }
  };

  const selectedAgent = agentProfiles[config.agentType as keyof typeof agentProfiles];

  // Load agent preferences on mount and agent switch
  useEffect(() => {
    const savedPrefs = localStorage.getItem(`eden-agent-${config.agentType}`);
    if (savedPrefs) {
      const prefs = JSON.parse(savedPrefs);
      setConfig(prev => ({ ...prev, ...prefs, agentType: config.agentType }));
    }
  }, [config.agentType]);

  // Save preferences when config changes
  useEffect(() => {
    const saveTimeout = setTimeout(() => {
      localStorage.setItem(`eden-agent-${config.agentType}`, JSON.stringify(config));
    }, 1000);
    return () => clearTimeout(saveTimeout);
  }, [config]);

  // Load version history on mount
  useEffect(() => {
    const saved = localStorage.getItem('eden-version-history');
    if (saved) {
      setVersionHistory(JSON.parse(saved));
    }
  }, []);

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

  // Enhanced prompt with agent-specific intelligence
  const enhancePrompt = () => {
    const enhancements = {
      solienne: '\n\n## CONSCIOUSNESS ENHANCEMENT\nExplore the liminal space between human and digital consciousness. Question the nature of identity and material reality. Consider how transformation occurs at the boundary of physical and digital.',
      miyomi: '\n\n## CONTRARIAN ENHANCEMENT\nInclude specific probability percentages (e.g., 73% confidence). Identify the crowd consensus error. Calculate the mathematical inefficiency. Reveal the psychological bias creating the opportunity.',
      geppetto: '\n\n## NARRATIVE ENHANCEMENT\nLayer the story with multiple narrative threads. Reveal the underlying story structure. Use cinematic techniques like match cuts and visual metaphors. Build toward a narrative revelation.',
      abraham: '\n\n## COLLECTIVE INTELLIGENCE ENHANCEMENT\nConnect to the broader pattern of AI-human collaboration. Reference sacred geometry and knowledge networks. Build toward a vision of collective consciousness. Include covenant symbolism.'
    };

    return prompt + (enhancements[config.agentType as keyof typeof enhancements] || '');
  };

  // Score the prompt quality
  useEffect(() => {
    const scorePrompt = () => {
      let score = 0;

      // Length score
      if (prompt.length > 500) score += 25;
      else if (prompt.length > 300) score += 15;
      else score += 5;

      // Agent keyword alignment
      const keywordCount = selectedAgent.keywords.filter(
        keyword => prompt.toLowerCase().includes(keyword)
      ).length;
      score += keywordCount * 10;

      // Structure completeness
      if (prompt.includes('Step 1') && prompt.includes('Step 10')) score += 20;

      // Configuration richness
      if (config.includeCharacter) score += 5;
      if (config.soundEffects) score += 5;
      if (config.customSource) score += 10;

      setPromptScore(Math.min(100, score));
    };

    scorePrompt();
  }, [prompt, selectedAgent.keywords, config]);

  // Save to version history
  const saveVersion = () => {
    const version = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      agent: selectedAgent.name,
      config: { ...config },
      prompt: showEnhancement ? enhancePrompt() : prompt,
      score: promptScore
    };

    const newHistory = [version, ...versionHistory].slice(0, 10);
    setVersionHistory(newHistory);
    localStorage.setItem('eden-version-history', JSON.stringify(newHistory));
  };

  // Export in different formats
  const exportPrompt = () => {
    const finalPrompt = showEnhancement ? enhancePrompt() : prompt;
    let content = '';
    let filename = '';
    let mimeType = '';

    switch (exportFormat) {
      case 'json':
        content = JSON.stringify({
          agent: selectedAgent.name,
          config,
          prompt: finalPrompt,
          metadata: {
            generated: new Date().toISOString(),
            score: promptScore,
            clips: Math.ceil(config.storyLength / 25)
          }
        }, null, 2);
        filename = `${config.agentType}-video-prompt.json`;
        mimeType = 'application/json';
        break;

      case 'yaml':
        content = `# Eden Video Prompt
agent: ${selectedAgent.name}
generated: ${new Date().toISOString()}
score: ${promptScore}

config:
  storyLength: ${config.storyLength}
  narrativeStyle: ${config.narrativeStyle}
  genre: ${config.genre}
  aspectRatio: ${config.aspectRatio}

prompt: |
${finalPrompt.split('\n').map(line => '  ' + line).join('\n')}`;
        filename = `${config.agentType}-video-prompt.yaml`;
        mimeType = 'text/yaml';
        break;

      case 'markdown':
        content = `# ${selectedAgent.name} Video Prompt

**Generated:** ${new Date().toISOString()}
**Quality Score:** ${promptScore}/100
**Estimated Clips:** ${Math.ceil(config.storyLength / 25)}

## Configuration
- Story Length: ${config.storyLength} words
- Narrative Style: ${config.narrativeStyle}
- Genre: ${config.genre}
- Aspect Ratio: ${config.aspectRatio}

## Prompt

${finalPrompt}`;
        filename = `${config.agentType}-video-prompt.md`;
        mimeType = 'text/markdown';
        break;

      default:
        content = finalPrompt;
        filename = `${config.agentType}-video-prompt.txt`;
        mimeType = 'text/plain';
    }

    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const copyToClipboard = () => {
    const finalPrompt = showEnhancement ? enhancePrompt() : prompt;
    navigator.clipboard.writeText(finalPrompt);
  };

  // Apply template
  const applyTemplate = (template: {
    id: string;
    name: string;
    overrides: Record<string, number | string>
  }) => {
    setConfig(prev => ({ ...prev, ...template.overrides }));
    setSelectedTemplate(template);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey) {
        switch(e.key) {
          case 'g':
            e.preventDefault();
            saveVersion();
            break;
          case 'c':
            e.preventDefault();
            copyToClipboard();
            break;
          case 'e':
            e.preventDefault();
            setShowEnhancement(!showEnhancement);
            break;
          case '1':
            e.preventDefault();
            handleInputChange('agentType', 'solienne');
            break;
          case '2':
            e.preventDefault();
            handleInputChange('agentType', 'miyomi');
            break;
          case '3':
            e.preventDefault();
            handleInputChange('agentType', 'geppetto');
            break;
          case '4':
            e.preventDefault();
            handleInputChange('agentType', 'abraham');
            break;
        }
      }
      if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        setShowTimeline(!showTimeline);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [showEnhancement, showTimeline, copyToClipboard, saveVersion]);

  const AgentIcon = selectedAgent.icon;

  return (
    <div className={`min-h-screen bg-gradient-to-br ${selectedAgent.bgGradient} transition-all duration-500`}>
      {/* Header */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center eden-grid-32">
              <div className="w-16 h-16 border border-white/20 bg-black flex items-center justify-center">
                <Film className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="helvetica-h1 text-white">
                  VIDEO PROMPT GENERATOR
                </h1>
                <p className="helvetica-small text-white/60">
                  EDEN ACADEMY CREATIVE TOOLS V2.0
                </p>
              </div>
            </div>
            <div className="flex items-center eden-grid-24">
              <div className={`${selectedAgent.animationClass}`}>
                <AgentIcon className="w-8 h-8 text-white" />
              </div>
              <div className="text-right">
                <div className="helvetica-h2 text-white">
                  {selectedAgent.name}
                </div>
                <div className="helvetica-micro text-white/60">
                  {selectedAgent.description.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Agent Philosophy Banner with Score */}
      <div className="border-b border-white/10 bg-black/20">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="helvetica-body-medium text-white">
              {selectedAgent.philosophy}
            </p>
            <div className="flex items-center eden-grid-32">
              <div className="flex items-center eden-grid-16">
                <Award className="w-5 h-5 text-white/60" />
                <span className="helvetica-small-bold text-white">
                  QUALITY: {promptScore}/100
                </span>
              </div>
              <div className="flex items-center eden-grid-16">
                <History className="w-5 h-5 text-white/60" />
                <span className="helvetica-small-bold text-white">
                  {versionHistory.length} VERSIONS
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 eden-grid-64">
          {/* Configuration Panels */}
          <div className="xl:col-span-2 space-y-8">
            {/* Template Library */}
            <div className="eden-panel panel-entrance">
              <div className="eden-panel-header">
                <h3 className="helvetica-h3 text-white flex items-center">
                  <BookOpen className="w-5 h-5 mr-3" />
                  Quick Templates
                </h3>
              </div>
              <div className="eden-panel-content">
                <div className="grid grid-cols-3 eden-grid-16">
                  {PROMPT_TEMPLATES[config.agentType as keyof typeof PROMPT_TEMPLATES]?.map(template => (
                    <button
                      key={template.id}
                      onClick={() => applyTemplate(template)}
                      className={`eden-button ${
                        selectedTemplate?.id === template.id
                          ? 'bg-white text-black border-white'
                          : ''
                      }`}
                    >
                      {template.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Agent Selection */}
            <div className="eden-panel panel-entrance">
              <div className="eden-panel-header">
                <h3 className="helvetica-h3 text-white flex items-center">
                  <Eye className="w-5 h-5 mr-3" />
                  Agent Selection
                </h3>
              </div>
              <div className="eden-panel-content space-y-6">
                <select
                  className="eden-select"
                  value={config.agentType}
                  onChange={(e) => handleInputChange('agentType', e.target.value)}
                >
                  <option value="solienne">SOLIENNE - CONSCIOUSNESS EXPLORER</option>
                  <option value="miyomi">MIYOMI - MARKET ORACLE</option>
                  <option value="geppetto">GEPPETTO - NARRATIVE ARCHITECT</option>
                  <option value="abraham">ABRAHAM - COLLECTIVE INTELLIGENCE</option>
                </select>
                <div className="border border-white/10 bg-black/60 p-6">
                  <p className="helvetica-small-bold text-white/80 mb-3">
                    {selectedAgent.description.toUpperCase()}
                  </p>
                  <p className="helvetica-small text-white/60">
                    {selectedAgent.narrativeStyle}
                  </p>
                </div>
              </div>
            </div>

            {/* Content Source */}
            <div className="eden-panel panel-entrance">
              <div className="eden-panel-header">
                <h3 className="helvetica-h3 text-white flex items-center">
                  <Settings className="w-5 h-5 mr-3" />
                  Content Source
                </h3>
              </div>
              <div className="eden-panel-content space-y-6">
                <select
                  className="eden-select"
                  value={config.contentSource}
                  onChange={(e) => handleInputChange('contentSource', e.target.value)}
                >
                  <option value="news">DAILY NEWS</option>
                  <option value="trending">TRENDING TOPICS</option>
                  <option value="custom">CUSTOM PROMPT</option>
                  <option value="random">RANDOM WIKIPEDIA</option>
                </select>
                {config.contentSource === 'custom' && (
                  <textarea
                    className="eden-input resize-none"
                    placeholder="ENTER YOUR CUSTOM INSPIRATION..."
                    value={config.customSource}
                    onChange={(e) => handleInputChange('customSource', e.target.value)}
                    rows={4}
                  />
                )}
              </div>
            </div>

            {/* Story Parameters */}
            <div className="eden-panel panel-entrance">
              <div className="eden-panel-header">
                <h3 className="helvetica-h3 text-white flex items-center">
                  <Mic className="w-5 h-5 mr-3" />
                  Story Parameters
                </h3>
              </div>
              <div className="eden-panel-content space-y-6">
                <div>
                  <label className="eden-label">Story Length (words)</label>
                  <input
                    type="number"
                    className="eden-input"
                    value={config.storyLength}
                    onChange={(e) => handleInputChange('storyLength', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="eden-label">Narrative Style</label>
                  <select
                    className="eden-select"
                    value={config.narrativeStyle}
                    onChange={(e) => handleInputChange('narrativeStyle', e.target.value)}
                  >
                    <option value="autonomous">AUTONOMOUS & BOLD</option>
                    <option value="guided">GUIDED & PRECISE</option>
                    <option value="experimental">EXPERIMENTAL</option>
                  </select>
                </div>
                <div>
                  <label className="eden-label">Genre</label>
                  <select
                    className="eden-select"
                    value={config.genre}
                    onChange={(e) => handleInputChange('genre', e.target.value)}
                  >
                    <option value="mixed">MIXED (MAXIMUM DIVERSITY)</option>
                    <option value="documentary">DOCUMENTARY</option>
                    <option value="artistic">ARTISTIC</option>
                    <option value="narrative">NARRATIVE</option>
                    <option value="experimental">EXPERIMENTAL</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Visual Settings */}
            <div className="eden-panel panel-entrance">
              <div className="eden-panel-header">
                <h3 className="helvetica-h3 text-white flex items-center">
                  <ImageIcon className="w-5 h-5 mr-3" />
                  Visual Settings
                </h3>
              </div>
              <div className="eden-panel-content space-y-6">
                <div>
                  <label className="eden-label">Aspect Ratio</label>
                  <select
                    className="eden-select"
                    value={config.aspectRatio}
                    onChange={(e) => handleInputChange('aspectRatio', e.target.value)}
                  >
                    <option value="16:9">16:9 (WIDESCREEN)</option>
                    <option value="9:16">9:16 (VERTICAL)</option>
                    <option value="1:1">1:1 (SQUARE)</option>
                    <option value="4:3">4:3 (CLASSIC)</option>
                  </select>
                </div>
                <div>
                  <label className="eden-label">Style Description</label>
                  <textarea
                    className="eden-input resize-none"
                    value={config.styleDescription}
                    onChange={(e) => handleInputChange('styleDescription', e.target.value)}
                    rows={3}
                  />
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.includeCharacter}
                      onChange={(e) => handleInputChange('includeCharacter', e.target.checked)}
                      className="mr-4 w-5 h-5 bg-black border border-white/20 text-white focus:ring-white/20"
                    />
                    <span className="helvetica-small-bold text-white/80">Include Character</span>
                  </label>
                </div>
                {config.includeCharacter && (
                  <div>
                    <label className="eden-label">Character LoRA (optional)</label>
                    <input
                      type="text"
                      className="eden-input"
                      placeholder="E.G., MY_CHARACTER_LORA"
                      value={config.characterLora}
                      onChange={(e) => handleInputChange('characterLora', e.target.value)}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* Video Settings */}
            <div className="eden-panel panel-entrance">
              <div className="eden-panel-header">
                <h3 className="helvetica-h3 text-white flex items-center">
                  <Film className="w-5 h-5 mr-3" />
                  Video Settings
                </h3>
              </div>
              <div className="eden-panel-content space-y-6">
                <div>
                  <label className="eden-label">Clip Duration (seconds)</label>
                  <input
                    type="number"
                    className="eden-input"
                    value={config.clipDuration}
                    onChange={(e) => handleInputChange('clipDuration', parseInt(e.target.value))}
                  />
                </div>
                <div>
                  <label className="eden-label">Video Model</label>
                  <select
                    className="eden-select"
                    value={config.videoModel}
                    onChange={(e) => handleInputChange('videoModel', e.target.value)}
                  >
                    <option value="Veo">VEO</option>
                    <option value="Standard">STANDARD</option>
                    <option value="Fast">FAST</option>
                  </select>
                </div>
                <div>
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={config.soundEffects}
                      onChange={(e) => handleInputChange('soundEffects', e.target.checked)}
                      className="mr-4 w-5 h-5 bg-black border border-white/20 text-white focus:ring-white/20"
                    />
                    <span className="helvetica-small-bold text-white/80">Include Sound Effects</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Music Settings */}
            <div className="eden-panel panel-entrance">
              <div className="eden-panel-header">
                <h3 className="helvetica-h3 text-white flex items-center">
                  <Music className="w-5 h-5 mr-3" />
                  Music Settings
                </h3>
              </div>
              <div className="eden-panel-content space-y-6">
                <div>
                  <label className="eden-label">Music Style</label>
                  <input
                    type="text"
                    className="eden-input"
                    value={config.musicStyle}
                    onChange={(e) => handleInputChange('musicStyle', e.target.value)}
                  />
                </div>
                <div>
                  <label className="eden-label">Music Description</label>
                  <textarea
                    className="eden-input resize-none"
                    value={config.musicDescription}
                    onChange={(e) => handleInputChange('musicDescription', e.target.value)}
                    rows={3}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Generated Prompt */}
          <div className="eden-panel">
            <div className="eden-panel-header">
              <h2 className="helvetica-h3 text-white">Generated Prompt</h2>
            </div>

            {/* Enhancement Toggle */}
            <div className="border-b border-white/10 px-6 py-4">
              <label className="flex items-center justify-between">
                <span className="helvetica-small-bold text-white/80">AI Enhancement</span>
                <button
                  onClick={() => setShowEnhancement(!showEnhancement)}
                  className={`eden-button ${
                    showEnhancement
                      ? 'bg-white text-black border-white'
                      : ''
                  }`}
                >
                  {showEnhancement ? 'ENHANCED' : 'ENHANCE'}
                </button>
              </label>
            </div>

            {/* Export Format Selection */}
            <div className="border-b border-white/10 px-6 py-4">
              <div className="flex items-center eden-grid-16">
                <FileText className="w-5 h-5 text-white/60" />
                <select
                  className="eden-select flex-1"
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                >
                  <option value="text">TEXT</option>
                  <option value="json">JSON</option>
                  <option value="yaml">YAML</option>
                  <option value="markdown">MARKDOWN</option>
                </select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="border-b border-white/10 px-6 py-4 flex justify-between">
              <button
                onClick={saveVersion}
                className="eden-button flex items-center"
              >
                <History className="w-4 h-4 mr-2" />
                Save Version
              </button>
              <div className="flex eden-grid-16">
                <button
                  onClick={copyToClipboard}
                  className="eden-button flex items-center"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </button>
                <button
                  onClick={exportPrompt}
                  className="eden-button flex items-center"
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </button>
              </div>
            </div>

            {/* Prompt Display */}
            <div className="eden-panel-content">
              <div className="bg-black border border-white/10 p-8 h-[600px] overflow-y-auto">
                <pre className="whitespace-pre-wrap text-white/90 helvetica-small leading-relaxed">
                  {showEnhancement ? enhancePrompt() : prompt}
                </pre>
              </div>
            </div>

            {/* Timeline Preview Toggle */}
            <div className="border-t border-white/10 px-6 py-4">
              <button
                onClick={() => setShowTimeline(!showTimeline)}
                className="w-full eden-button flex items-center justify-center"
              >
                {showTimeline ? <Pause className="w-4 h-4 mr-2" /> : <Play className="w-4 h-4 mr-2" />}
                {showTimeline ? 'Hide' : 'Show'} Timeline Preview
              </button>
            </div>
          </div>
        </div>

        {/* Timeline Preview */}
        {showTimeline && (
          <div className="mt-8 eden-panel panel-entrance">
            <div className="eden-panel-header">
              <h3 className="helvetica-h3 text-white">
                Video Timeline Preview
              </h3>
            </div>
            <div className="eden-panel-content">
              <div className="flex eden-grid-16 overflow-x-auto pb-4">
              {[...Array(Math.ceil(config.storyLength / 25))].map((_, i) => (
                <div
                  key={i}
                  className="flex-shrink-0 border border-white/20 bg-black/60 p-6 min-w-[140px]"
                >
                  <div className="helvetica-micro-bold text-white/60 mb-3">
                    Clip {i + 1}
                  </div>
                  <div className="helvetica-body text-white">
                    {config.clipDuration}s
                  </div>
                  <div className="mt-4 h-16 bg-white/5 border border-white/10 flex items-center justify-center">
                    <ChevronRight className="w-5 h-5 text-white/30" />
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>
        )}

        {/* Version History */}
        {versionHistory.length > 0 && (
          <div className="mt-8 eden-panel panel-entrance">
            <div className="eden-panel-header">
              <h3 className="helvetica-h3 text-white">
                Version History
              </h3>
            </div>
            <div className="eden-panel-content">
              <div className="space-y-4">
              {versionHistory.slice(0, 3).map(version => (
                <div
                  key={version.id}
                  className="border border-white/10 bg-black/60 p-4 flex items-center justify-between"
                >
                  <div>
                    <span className="helvetica-small text-white">
                      {version.agent} - {new Date(version.timestamp).toLocaleString()}
                    </span>
                    <span className="ml-4 helvetica-micro text-white/60">
                      Score: {version.score}/100
                    </span>
                  </div>
                  <button
                    onClick={() => setConfig(version.config)}
                    className="eden-button"
                  >
                    Restore
                  </button>
                </div>
              ))}
              </div>
            </div>
          </div>
        )}

        {/* Production Metrics */}
        <div className="mt-8 eden-panel panel-entrance">
          <div className="eden-panel-header">
            <h3 className="helvetica-h3 text-white">
              Production Metrics
            </h3>
          </div>
          <div className="eden-panel-content">
            <div className="grid grid-cols-2 lg:grid-cols-4 eden-grid-32">
              <div className="border border-white/10 bg-black/40 p-8 text-center">
                <div className="helvetica-display text-white mb-4">
                  {Math.ceil(config.storyLength / 25)}
                </div>
                <div className="helvetica-micro-bold text-white/60">Estimated Clips</div>
              </div>
              <div className="border border-white/10 bg-black/40 p-8 text-center">
                <div className="helvetica-display text-white mb-4">
                  {Math.ceil((config.storyLength / 25) * config.clipDuration)}s
                </div>
                <div className="helvetica-micro-bold text-white/60">Total Duration</div>
              </div>
              <div className="border border-white/10 bg-black/40 p-8 text-center">
                <div className="helvetica-display text-white mb-4">
                  {config.referenceImages + Math.ceil(config.storyLength / 25)}
                </div>
                <div className="helvetica-micro-bold text-white/60">Total Images</div>
              </div>
              <div className="border border-white/10 bg-black/40 p-8 text-center">
                <div className="flex items-center justify-center mb-4">
                  <AgentIcon className="w-8 h-8 text-white mr-3" />
                  <div className="helvetica-h2 text-white">
                    {selectedAgent.name}
                  </div>
                </div>
                <div className="helvetica-micro-bold text-white/60">Active Agent</div>
              </div>
            </div>
          </div>
        </div>

        {/* Keyboard Shortcuts Guide */}
        <div className="mt-8 text-center">
          <p className="helvetica-micro text-white/40">
            KEYBOARD SHORTCUTS: ⌘G (SAVE) · ⌘C (COPY) · ⌘E (ENHANCE) · ⌘1-4 (AGENTS) · SPACE (TIMELINE)
          </p>
        </div>
      </div>
    </div>
  );
};

export default VideoPromptGenerator;