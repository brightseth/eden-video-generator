/**
 * Eden API Client
 * Handles video generation through Eden's API
 */

export interface EdenTask {
  taskId: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  creation?: {
    uri?: string;
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
   * Create a video generation task with enhanced error handling
   */
  async createVideoTask(params: VideoGenerationParams): Promise<string> {
    // Validate inputs
    if (!params.prompt || params.prompt.trim().length === 0) {
      throw new Error('Prompt is required for video generation');
    }

    if (params.duration && (params.duration < 4 || params.duration > 10)) {
      throw new Error('Duration must be between 4 and 10 seconds');
    }

    console.log('Creating Eden video task with params:', {
      prompt: params.prompt.substring(0, 100) + '...',
      duration: params.duration,
      quality: params.quality,
      dimensions: `${params.width || 1920}x${params.height || 1080}`
    });

    try {
      const response = await fetch('/api/eden/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: params.prompt.trim(),
          model_preference: 'veo', // Use Veo for video generation
          args: {
            duration: params.duration || 16
          }
        })
      });

      console.log('Response status:', response.status);
      console.log('Response headers:', Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Full error response:', errorText);

        let errorData;
        try {
          errorData = JSON.parse(errorText);
        } catch {
          errorData = { error: errorText || response.statusText };
        }

        console.error('Eden API error response:', errorData);
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Eden response data:', data);

      if (!data.taskId) {
        console.error('Invalid response from Eden API:', data);
        throw new Error('Invalid response: No task ID returned');
      }

      console.log('Eden task created successfully:', data.taskId);
      return data.taskId;
    } catch (error) {
      console.error('Error creating video task:', error);

      // Provide more helpful error messages based on the error type
      if (error instanceof Error) {
        if (error.message.includes('401') || error.message.includes('unauthorized')) {
          throw new Error('Invalid API key. Please check your Eden API credentials.');
        }
        if (error.message.includes('429') || error.message.includes('rate limit')) {
          throw new Error('Rate limit exceeded. Please try again in a few minutes.');
        }
        if (error.message.includes('400') || error.message.includes('bad request')) {
          throw new Error('Invalid request parameters. Please check your video settings.');
        }
        if (error.message.includes('503') || error.message.includes('service unavailable')) {
          throw new Error('Eden API is temporarily unavailable. Please try again later.');
        }
        if (error.message.includes('500') || error.message.includes('server error')) {
          throw new Error('Eden API server error. Please try again later.');
        }
        if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
          throw new Error('Network error. Please check your internet connection.');
        }
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
   * Poll for task completion with enhanced reliability
   */
  async pollForCompletion(
    taskId: string,
    onProgress?: (status: string) => void,
    maxAttempts: number = 60
  ): Promise<string> {
    const pollInterval = 5000; // 5 seconds
    let lastStatus = '';

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const task = await this.checkTaskStatus(taskId);

        // Only update progress if status changed
        if (onProgress && task.status !== lastStatus) {
          onProgress(task.status);
          lastStatus = task.status;
        }

        if (task.status === 'completed' && task.creation?.uri) {
          console.log('Video generation completed successfully:', task.creation.uri);
          return task.creation.uri;
        }

        if (task.status === 'failed') {
          const errorMsg = task.error || 'Video generation failed';
          console.error('Eden task failed:', errorMsg);
          throw new Error(errorMsg);
        }

        // Log progress for debugging
        if (attempt % 6 === 0) { // Every 30 seconds
          console.log(`Eden task ${taskId} status: ${task.status} (attempt ${attempt + 1}/${maxAttempts})`);
        }

        // Wait before next poll
        await new Promise(resolve => setTimeout(resolve, pollInterval));
      } catch (error) {
        console.error(`Polling attempt ${attempt + 1} failed:`, error);

        // If it's a network error, wait a bit longer before retrying
        if (error instanceof Error && error.message.includes('fetch')) {
          await new Promise(resolve => setTimeout(resolve, pollInterval * 2));
        } else {
          throw error; // Re-throw non-network errors
        }
      }
    }

    throw new Error(`Video generation timed out after ${(maxAttempts * pollInterval) / 1000 / 60} minutes. Please try with a shorter duration or simpler prompt.`);
  }

  /**
   * Generate video from prompt (complete flow with enhanced monitoring)
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
    console.log('Starting video generation:', {
      prompt: prompt.substring(0, 100) + '...',
      config
    });

    // Parse aspect ratio to dimensions
    const dimensions = this.getVideoDimensions(config.aspectRatio || '16:9');

    // Create task with progress notification
    if (onProgress) onProgress('preparing');

    const taskId = await this.createVideoTask({
      prompt,
      width: dimensions.width,
      height: dimensions.height,
      duration: config.duration || 16,
      quality: config.quality || 'medium'
    });

    console.log('Task created, beginning polling:', taskId);
    if (onProgress) onProgress('processing');

    // Poll for completion with extended timeout for longer videos
    const maxAttempts = Math.max(60, Math.ceil((config.duration || 16) * 2)); // Scale with duration

    return await this.pollForCompletion(taskId, onProgress, maxAttempts);
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