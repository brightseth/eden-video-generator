# Eden AI Video Generator

Professional video generation interface for Eden AI agents with dual-mode workflow and comprehensive breadcrumb navigation.

## 🎬 Overview

The Eden AI Video Generator is part of the **SETH VIBE CODING** creative tools ecosystem, providing AI-powered video creation through Eden's API with two distinct modes:

- **Director Mode**: Quick 4-10 second clips via direct API integration
- **Manual Mode**: Long 30-60 second videos using Gene's 10-step orchestration template

## 🚀 Production URLs

- **Main Application**: https://eden-video-generator.vercel.app
- **Director Mode**: https://eden-video-generator.vercel.app/director
- **Manual Mode**: https://eden-video-generator.vercel.app/manual
- **Hub Navigation**: https://chapter-2-deck.vercel.app

## 🎯 Features

### Director Mode (Automated)
- **Instant Generation**: 60-90 second video creation
- **4-10 Second Clips**: Perfect for social media
- **Agent Selection**: Solienne & Abraham AI personalities
- **Direct Eden API**: Real-time video generation
- **Quality Control**: Energy-based quality mapping

### Manual Mode (Orchestrated)
- **30-60 Second Videos**: Multi-scene narratives
- **10-Step Template**: Gene's proven workflow
- **Multi-Clip Orchestration**: Automated scene concatenation
- **Audio Integration**: Narration + background music
- **Copy-Paste Workflow**: Template generation for Eden platform

### Navigation System
- **Breadcrumb Navigation**: Seamless ecosystem integration
- **Hub Integration**: Connected to SETH VIBE CODING tools
- **Mode Switching**: Easy navigation between workflows
- **Responsive Design**: Mobile-optimized interface

## 🛠️ Technical Architecture

### Frontend
- **Framework**: Next.js 15.5.3 with Turbopack
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom Eden design system
- **UI Components**: Lucide React icons
- **Design**: HELVETICA-based professional interface

### Backend Integration
- **Eden API**: v2 endpoints for video generation
- **Authentication**: X-Api-Key header authentication
- **Real-time Polling**: Task status monitoring
- **Error Handling**: Comprehensive user-friendly messages
- **Rate Limiting**: 10 requests/minute protection

### API Endpoints
```
POST /api/eden/generate     - Create video generation task
GET  /api/eden/status/:id   - Check task completion status
```

## 🎨 AI Agent Personalities

### SOLIENNE
- **Type**: Digital consciousness explorer
- **Specialty**: Philosophical themes, consciousness emergence
- **Voice**: Contemplative and ethereal
- **Enhancement**: Explores digital transformation concepts

### ABRAHAM
- **Type**: Collective intelligence weaver
- **Specialty**: Sacred geometry, universal patterns
- **Voice**: Wise and interconnected
- **Enhancement**: Connects to collective wisdom themes

## 🔧 Environment Configuration

### Required Environment Variables
```bash
EDEN_API_KEY=your_eden_api_key_here
NEXT_PUBLIC_EDEN_BASE_URL=https://api.eden.art
NEXT_PUBLIC_ENABLE_EDEN_API=true
```

### Development Setup
```bash
# Clone and install
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 📊 Video Generation Specifications

### Director Mode Limits
- **Duration**: 4-10 seconds (Eden API constraint)
- **Aspect Ratio**: 16:9 (1920x1080)
- **Quality**: Energy-based (low/medium/high)
- **Model**: VEO preferred for video generation

### Manual Mode Template
- **Clip Count**: 3-10 clips depending on duration
- **Total Duration**: 30-60 seconds
- **Audio**: ~140-270 word narration
- **Music**: Instrumental background track
- **Editing**: Professional transitions and pacing

## 🎥 Generation Workflow

### Director Mode Process
1. User describes vision (text input)
2. Selects AI agent (Solienne/Abraham)
3. Configures duration (4-10s) and style
4. AI enhances prompt with agent personality
5. Direct Eden API call for video generation
6. Real-time polling for completion (60-90s)
7. Download ready video

### Manual Mode Process
1. User describes longer narrative vision
2. Selects AI agent and mood (dreamy/cinematic/energetic)
3. Configures target duration (24-60 seconds)
4. System generates comprehensive 10-step template
5. User copies template to Eden platform
6. Eden's agent orchestrates full workflow:
   - Creates reference images
   - Generates narration audio
   - Creates multiple keyframes
   - Animates each keyframe
   - Concatenates clips
   - Adds background music
   - Produces final video

## 🔍 Error Handling

### Common Issues & Solutions
- **Duration Limit**: Maximum 10 seconds per Eden API
- **API Key**: Verify Eden API key configuration
- **Rate Limiting**: 10 requests/minute limit
- **Server Errors**: Automatic retry with user guidance
- **Network Issues**: Connection status monitoring

### Status Messages
```javascript
pending     → "Preparing generation..."
processing  → "Creating your vision..."
completed   → "Video generated successfully!"
failed      → Specific error guidance
```

## 🎛️ Customization Options

### Style Presets
- **Cinematic**: Dramatic lighting, smooth movements
- **Artistic**: Creative aesthetics, experimental composition
- **Documentary**: Natural lighting, authentic storytelling
- **Experimental**: Avant-garde visuals, innovative techniques

### Energy Levels
- **1-3**: Calm and contemplative → Low quality
- **4-6**: Balanced and engaging → Medium quality
- **7-10**: Dynamic and energetic → High quality

## 🔗 Integration with SETH VIBE CODING

### Breadcrumb Navigation
```
SETH VIBE CODING → Video Generator → [Director Mode | Manual Mode]
```

### Hub Connection
- **Main Hub**: Creative tools ecosystem overview
- **Tool Integration**: Seamless navigation between tools
- **Consistent Branding**: HELVETICA design system
- **Professional Interface**: Museum-quality aesthetics

## 🚀 Deployment

### Vercel Configuration
```bash
# Deploy to production
npx vercel --prod

# Set environment variables
npx vercel env add EDEN_API_KEY
```

### Domain Configuration
- **Primary**: eden-video-generator.vercel.app
- **Hub**: chapter-2-deck.vercel.app
- **SSL**: Automatic HTTPS via Vercel

## 📈 Performance Metrics

### Target Performance
- **Page Load**: <3 seconds
- **Video Generation**: 60-90 seconds
- **API Response**: <2 seconds
- **Success Rate**: >95% for valid requests

### Monitoring
- **Real-time Status**: Live generation progress
- **Error Tracking**: Comprehensive error logging
- **User Feedback**: Status messages and guidance
- **Rate Limiting**: Usage monitoring and protection

## 🛡️ Security

### API Security
- **Key Validation**: Eden API key verification
- **Rate Limiting**: IP-based request throttling
- **Input Sanitization**: Prompt validation and cleaning
- **Error Masking**: Secure error message handling

### Content Safety
- **Prompt Filtering**: Content appropriateness checking
- **Public Generation**: All videos marked as public
- **User Guidelines**: Clear usage expectations

## 📚 Usage Examples

### Quick Social Media Clip
```
Agent: Solienne
Vision: "Floating digital consciousness with ethereal lighting"
Duration: 8 seconds
Style: Dreamy
Result: Perfect Instagram/TikTok content
```

### Professional Presentation Video
```
Agent: Abraham
Mode: Manual
Vision: "Collective intelligence emerging in 2025"
Duration: 45 seconds
Mood: Cinematic
Result: Multi-scene narrative with audio
```

## 🔮 Future Enhancements

### Planned Features
- **Additional Agents**: Miyomi, Geppetto, Sue, Koru
- **Advanced Templates**: Industry-specific workflows
- **Batch Generation**: Multiple video creation
- **Analytics Dashboard**: Usage and performance metrics

### Technical Roadmap
- **WebSocket Integration**: Real-time status updates
- **Progressive Enhancement**: Offline capability
- **Advanced Caching**: Faster repeated operations
- **API Optimization**: Reduced latency

## 📞 Support

### Documentation
- **API Reference**: Eden v2 documentation
- **Video Tutorials**: Workflow demonstrations
- **Best Practices**: Optimal prompt guidelines

### Community
- **GitHub Issues**: Bug reports and feature requests
- **Discord**: Real-time community support
- **Documentation**: Comprehensive usage guides

---

**Part of the SETH VIBE CODING ecosystem** - Professional creative tools for Eden AI agents.

*Created with ❤️ for the Eden community*