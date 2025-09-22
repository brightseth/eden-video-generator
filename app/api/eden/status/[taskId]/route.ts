import { NextRequest, NextResponse } from 'next/server';

const EDEN_API_KEY = process.env.EDEN_API_KEY;
const EDEN_BASE_URL = 'https://api.eden.art/v2';

interface RouteContext {
  params: Promise<{
    taskId: string;
  }>;
}

export async function GET(
  request: NextRequest,
  { params }: RouteContext
) {
  const { taskId } = await params;

  // Validate taskId
  if (!taskId || taskId.trim().length === 0) {
    return NextResponse.json(
      { error: 'Task ID is required' },
      { status: 400 }
    );
  }

  if (!EDEN_API_KEY) {
    return NextResponse.json(
      { error: 'Eden API key not configured' },
      { status: 503 }
    );
  }

  try {
    // Check task status with Eden API
    console.log(`Checking status for task: ${taskId}`);

    const response = await fetch(`${EDEN_BASE_URL}/tasks/${taskId}`, {
      headers: {
        'X-Api-Key': EDEN_API_KEY,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.text();
      console.error(`Eden API status error (${response.status}):`, error);

      // Provide specific error messages
      let errorMessage = 'Failed to check task status';
      if (response.status === 404) {
        errorMessage = 'Task not found. It may have expired or been removed.';
      } else if (response.status === 401) {
        errorMessage = 'Invalid API key';
      } else if (response.status >= 500) {
        errorMessage = 'Eden API server error. Please try again later.';
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Task status response for', taskId, ':', {
      status: data.task?.status || data.status,
      hasResult: !!(data.task?.result || data.result)
    });

    // Extract task data (API returns { task: {...} })
    const task = data.task || data;

    // Enhanced status mapping with better error handling
    const status = {
      taskId: task._id || task.taskId || task.id || taskId,
      status: task.status || 'unknown',
      creation: undefined as { uri?: string } | undefined,
      error: task.error,
      progress: task.progress || undefined,
      estimatedTime: task.estimatedTime || undefined
    };

    // Check for completed video with multiple possible result structures
    if (task.status === 'completed') {
      const result = task.result || task.results || task.output;
      let videoUri;

      if (Array.isArray(result) && result.length > 0) {
        // Array of results
        const firstResult = result[0];
        if (firstResult.output && Array.isArray(firstResult.output)) {
          videoUri = firstResult.output[0]?.url || firstResult.output[0]?.uri;
        } else {
          videoUri = firstResult.url || firstResult.uri;
        }
      } else if (result) {
        // Single result object
        videoUri = result.url || result.uri;
      }

      if (videoUri) {
        status.creation = { uri: videoUri };
        console.log('Video completed for task', taskId, ':', videoUri);
      } else {
        console.warn('Task marked as completed but no video URI found:', task);
      }
    }

    return NextResponse.json(status);

  } catch (error) {
    console.error('Error checking task status:', error);

    let errorMessage = 'Failed to check task status';
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your connection.';
      } else {
        errorMessage = error.message;
      }
    }

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}