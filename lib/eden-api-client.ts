/**
 * Eden API Client
 * Handles video generation through Eden's API
 */

export interface EdenTask {
  id: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  output?: {
    output?: string;
  };
  error?: string;
}

export interface VideoGenerationParams {
  prompt: string;
  width?: number;
  height?: number;
  duration?: number; // in seconds
  fps?: number;
  quality?: 'low' | 'medium' | 'high';
}

class EdenAPIClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.EDEN_API_KEY || '';
    this.baseUrl = 'https://api.eden.art';
  }

  /**
   * Create a video generation task
   */
  async createVideoTask(params: VideoGenerationParams): Promise<string> {
    // Map quality to Eden parameters
    const qualitySettings = {
      low: { steps: 30, guidance_scale: 7.0 },
      medium: { steps: 40, guidance_scale: 8.0 },
      high: { steps: 50, guidance_scale: 8.5 }
    };

    const settings = qualitySettings[params.quality || 'medium'];
    const nFrames = (params.duration || 8) * (params.fps || 24);

    try {
      const response = await fetch('/api/eden/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tool: 'veo',
          args: {
            text_input: params.prompt,
            width: params.width || 1920,
            height: params.height || 1080,
            n_frames: nFrames,
            guidance_scale: settings.guidance_scale,
            steps: settings.steps,
            fps: params.fps || 24,
            motion_bucket_id: 127,
            noise_aug_strength: 0.05
          }
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: response.statusText }));
        throw new Error(errorData.error || `Failed to create task: ${response.statusText}`);
      }

      const data = await response.json();
      if (!data.taskId) {
        console.error('Invalid response from API:', data);
        throw new Error('Invalid response: No task ID returned');
      }
      return data.taskId;
    } catch (error) {
      console.error('Error creating video task:', error);
      // Provide more helpful error messages
      if (error instanceof Error && error.message.includes('401')) {
        throw new Error('Invalid API key. Please check your Eden API credentials.');
      }
      if (error instanceof Error && error.message.includes('429')) {
        throw new Error('Rate limit exceeded. Please try again in a few minutes.');
      }
      throw error;
    }
  }

  /**
   * Check the status of a task
   */
  async checkTaskStatus(taskId: string): Promise<EdenTask> {
    try {
      const response = await fetch(`/api/eden/status/${taskId}`);

      if (!response.ok) {
        throw new Error(`Failed to check task status: ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Error checking task status:', error);
      throw error;
    }
  }

  /**
   * Poll for task completion
   */
  async pollForCompletion(
    taskId: string,
    onProgress?: (status: string) => void,
    maxAttempts: number = 60
  ): Promise<string> {
    const pollInterval = 5000; // 5 seconds

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const task = await this.checkTaskStatus(taskId);

      if (onProgress) {
        onProgress(task.status);
      }

      if (task.status === 'completed' && task.output?.output) {
        return task.output.output;
      }

      if (task.status === 'failed') {
        throw new Error(task.error || 'Task failed');
      }

      // Wait before next poll
      await new Promise(resolve => setTimeout(resolve, pollInterval));
    }

    throw new Error('Task timeout - generation took too long');
  }

  /**
   * Generate video from prompt (complete flow)
   */
  async generateVideo(
    prompt: string,
    config: {
      aspectRatio?: string;
      duration?: number;
      quality?: 'low' | 'medium' | 'high';
    } = {},
    onProgress?: (status: string) => void
  ): Promise<string> {
    // Parse aspect ratio to dimensions
    const dimensions = this.getVideoDimensions(config.aspectRatio || '16:9');

    // Create task
    const taskId = await this.createVideoTask({
      prompt,
      width: dimensions.width,
      height: dimensions.height,
      duration: config.duration || 8,
      quality: config.quality || 'medium'
    });

    // Poll for completion
    return await this.pollForCompletion(taskId, onProgress);
  }

  /**
   * Convert aspect ratio to dimensions
   */
  private getVideoDimensions(aspectRatio: string): { width: number; height: number } {
    const dimensionMap: Record<string, { width: number; height: number }> = {
      '16:9': { width: 1920, height: 1080 },
      '9:16': { width: 1080, height: 1920 },
      '1:1': { width: 1080, height: 1080 },
      '4:3': { width: 1440, height: 1080 }
    };

    return dimensionMap[aspectRatio] || dimensionMap['16:9'];
  }
}

export const edenAPIClient = new EdenAPIClient();