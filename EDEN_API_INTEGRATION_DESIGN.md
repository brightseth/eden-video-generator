# Eden API Video Generation Integration Design

## Overview
This document outlines the architecture for integrating Eden API's video generation capabilities directly into the Eden Video Prompt Generator.

## Eden API Endpoints

### 1. Create Task
- **Endpoint**: `POST https://api.eden.art/v2/tasks/create`
- **Authentication**: Bearer token with API key
- **Request Body**:
```json
{
  "tool": "veo",  // For video generation
  "args": {
    "text_input": "Detailed video prompt",
    "width": 1920,
    "height": 1080,
    "n_frames": 192,  // 8 seconds at 24fps
    "guidance_scale": 8.5,
    "steps": 50,
    "fps": 24,
    "motion_bucket_id": 127,
    "noise_aug_strength": 0.05
  }
}
```

### 2. Check Task Status
- **Endpoint**: `GET https://api.eden.art/v2/tasks/{taskId}`
- **Authentication**: Bearer token with API key
- **Response**:
```json
{
  "status": "completed",  // or "processing", "failed"
  "output": {
    "output": "https://eden-cdn.art/videos/generated-video.mp4"
  },
  "error": null
}
```

## Integration Architecture

### Client-Side Components

1. **EdenAPIClient** (`/lib/eden-api-client.ts`)
   - Handle authentication
   - Create video generation tasks
   - Poll for completion
   - Error handling & retries

2. **VideoGenerationManager** (`/lib/video-generation-manager.ts`)
   - Queue management for multiple segments
   - Progress tracking
   - Result caching
   - Fallback to demo videos

3. **UI Components**
   - Generation button with loading states
   - Progress indicator
   - Video preview player
   - Download options
   - Generation history

### Server-Side API Routes

1. **`/api/eden/generate`** - POST
   - Validate request
   - Create Eden task
   - Return task ID

2. **`/api/eden/status/{taskId}`** - GET
   - Check task status
   - Return progress/result

3. **`/api/eden/history`** - GET
   - Return user's generation history
   - Cached results

## Implementation Phases

### Phase 1: Basic Integration (MVP)
- [ ] Set up environment variables for API key
- [ ] Create EdenAPIClient with authentication
- [ ] Implement single video generation
- [ ] Add polling mechanism
- [ ] Basic UI with generate button

### Phase 2: Enhanced Features
- [ ] Multi-segment video generation
- [ ] Progress tracking UI
- [ ] Video preview component
- [ ] Generation history
- [ ] Error handling & retries

### Phase 3: Advanced Features
- [ ] Queue management for batch generation
- [ ] Video editing capabilities
- [ ] Custom LoRA integration
- [ ] Agent-specific optimizations
- [ ] Export in multiple formats

## Configuration

### Environment Variables
```env
# Eden API Configuration
NEXT_PUBLIC_EDEN_API_KEY=your_api_key_here
NEXT_PUBLIC_EDEN_BASE_URL=https://api.eden.art
NEXT_PUBLIC_ENABLE_EDEN_API=true
```

### Video Generation Parameters

#### By Agent Type
- **SOLIENNE**: Ethereal, slow motion, consciousness themes
- **MIYOMI**: Dynamic, data visualization, market patterns
- **GEPPETTO**: Narrative-driven, character-focused, storybook aesthetic
- **ABRAHAM**: Sacred geometry, collective patterns, unity themes

#### Quality Presets
1. **Demo**: 512x512, 4 seconds, 12fps
2. **Preview**: 1280x720, 8 seconds, 24fps
3. **Production**: 1920x1080, 16 seconds, 30fps

## API Rate Limits & Pricing

### Considerations
- Rate limit: 10 requests per minute
- Task timeout: 5 minutes
- Max file size: 100MB
- Cost per generation: ~$0.50-2.00 depending on quality

### Error Handling
- 401: Invalid API key
- 402: Insufficient credits
- 429: Rate limit exceeded
- 500: Server error (retry with exponential backoff)

## Security Considerations

1. **API Key Management**
   - Never expose API key in client code
   - Use server-side proxy for all Eden API calls
   - Implement request signing

2. **User Authentication**
   - Track generations per user
   - Implement usage limits
   - Store generation history securely

3. **Content Moderation**
   - Validate prompts before submission
   - Filter inappropriate content
   - Log all generation requests

## User Experience Flow

1. **Initial Setup**
   - User configures prompt using UI
   - Selects agent and template
   - Customizes parameters

2. **Generation Process**
   - Click "Generate with Eden"
   - Show estimated time & cost
   - Display progress bar
   - Real-time status updates

3. **Completion**
   - Auto-play preview
   - Download options
   - Share capabilities
   - Save to history

## Technical Implementation Notes

### Polling Strategy
```typescript
const pollForCompletion = async (taskId: string): Promise<string> => {
  const maxAttempts = 60;  // 5 minutes max
  const pollInterval = 5000;  // 5 seconds

  for (let i = 0; i < maxAttempts; i++) {
    const status = await checkTaskStatus(taskId);

    if (status.status === 'completed') {
      return status.output.output;
    } else if (status.status === 'failed') {
      throw new Error(status.error);
    }

    await sleep(pollInterval);
  }

  throw new Error('Task timeout');
};
```

### Multi-Segment Generation
For longer videos, generate multiple segments and concatenate:
1. Split narrative into segments
2. Generate each segment in parallel
3. Use consistent style parameters
4. Concatenate using ffmpeg or Eden's composition API

## Testing Strategy

1. **Unit Tests**
   - API client methods
   - Polling logic
   - Error handling

2. **Integration Tests**
   - End-to-end generation flow
   - API mock server
   - Rate limit handling

3. **UI Tests**
   - Progress indicators
   - Error states
   - Video playback

## Monitoring & Analytics

Track:
- Generation success rate
- Average generation time
- Popular templates/agents
- Error frequency
- User engagement metrics

## Next Steps

1. **Immediate Actions**
   - Obtain Eden API key
   - Set up development environment
   - Create basic API client

2. **Development Priority**
   - MVP implementation (Phase 1)
   - User testing
   - Performance optimization
   - Scale to production

## Questions to Resolve

1. **API Key Source**: Personal key or Eden Academy's organizational key?
2. **Cost Model**: Who pays for generations? User credits or flat fee?
3. **Storage**: Where to store generated videos? Eden CDN or custom S3?
4. **Caching**: How long to cache generated videos?
5. **Limits**: Daily/monthly generation limits per user?

## Alternative Approaches

### Option 1: Client-Direct
- Browser makes direct API calls to Eden
- Simpler architecture
- Requires exposing API key (not recommended)

### Option 2: Server Proxy (Recommended)
- All API calls through Next.js backend
- Secure API key management
- Better error handling and caching

### Option 3: Webhook-Based
- Submit job, receive webhook on completion
- More complex but scalable
- Good for batch processing

## Conclusion

The Eden API integration will transform the Video Prompt Generator from a prompt creation tool into a complete video generation platform. By following this phased approach, we can deliver value quickly while building toward a comprehensive solution.

**Recommended First Step**: Implement Phase 1 MVP with server proxy architecture to validate the integration before adding advanced features.