import { NextRequest, NextResponse } from 'next/server';

const EDEN_API_KEY = process.env.EDEN_API_KEY;
const EDEN_BASE_URL = process.env.NEXT_PUBLIC_EDEN_BASE_URL || 'https://api.eden.art';

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
    const response = await fetch(`${EDEN_BASE_URL}/v2/tasks/${taskId}`, {
      headers: {
        'Authorization': `Bearer ${EDEN_API_KEY}`
      }
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json(
        { error: `Eden API error: ${error}` },
        { status: response.status }
      );
    }

    const task = await response.json();

    // Map Eden status to our format
    const status = {
      id: task.id,
      status: task.status,
      output: task.output,
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