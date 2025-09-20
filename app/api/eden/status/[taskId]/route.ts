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

  if (!EDEN_API_KEY) {
    return NextResponse.json(
      { error: 'Eden API key not configured' },
      { status: 503 }
    );
  }

  try {
    // Check task status with Eden API
    const response = await fetch(`${EDEN_BASE_URL}/tasks/${taskId}`, {
      headers: {
        'X-Api-Key': EDEN_API_KEY,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `Eden API error: ${error}` },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.log('Task status response:', data);

    // Extract task data (API returns { task: {...} })
    const task = data.task || data;

    // Map Eden response to our format following hello-eden pattern
    const status = {
      taskId: task._id || task.taskId || task.id || taskId,
      status: task.status,
      creation: task.result && task.result.length > 0 && task.result[0].output
        ? {
            uri: task.result[0].output[0]?.url || task.result[0].output[0]?.uri
          }
        : undefined,
      error: task.error
    };

    return NextResponse.json(status);

  } catch (error) {
    console.error('Error checking task status:', error);
    return NextResponse.json(
      { error: 'Failed to check task status' },
      { status: 500 }
    );
  }
}