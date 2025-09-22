import { NextRequest, NextResponse } from 'next/server';

const EDEN_API_KEY = process.env.EDEN_API_KEY;
const EDEN_BASE_URL = 'https://api.eden.art/v2'; // v2 API for video generation

// Rate limiting (simple in-memory store - in production use Redis)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const RATE_LIMIT_MAX = 10; // 10 requests per minute per IP

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const key = ip;
  const current = rateLimitStore.get(key);

  if (!current || now > current.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return true;
  }

  if (current.count >= RATE_LIMIT_MAX) {
    return false;
  }

  current.count++;
  return true;
}

export async function POST(request: NextRequest) {
  // Rate limiting
  const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown';
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: 'Rate limit exceeded. Please try again in a minute.' },
      { status: 429 }
    );
  }

  if (!EDEN_API_KEY) {
    console.error('Eden API key not configured');
    return NextResponse.json(
      { error: 'Eden API key not configured' },
      { status: 503 }
    );
  }

  try {
    const body = await request.json();

    // Validate required inputs
    if (!body.prompt || body.prompt.trim().length === 0) {
      return NextResponse.json(
        { error: 'Prompt is required' },
        { status: 400 }
      );
    }

    console.log('Creating Eden task:', {
      prompt: body.prompt.substring(0, 100) + '...',
      model: body.model_preference || 'veo',
      duration: body.args?.duration || 16
    });

    // Simplified payload structure - only include what Eden actually accepts
    const edenPayload = {
      tool: "create",
      args: {
        prompt: body.prompt.trim(),
        output: "video",
        ...(body.args?.duration && { duration: Math.min(body.args.duration, 10) }) // Cap at 10s per Eden limit
      }
    };

    console.log('Eden v2 payload:', JSON.stringify(edenPayload, null, 2));

    const response = await fetch(`${EDEN_BASE_URL}/tasks/create`, {
      method: 'POST',
      headers: {
        'X-Api-Key': EDEN_API_KEY,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(edenPayload)
    });

    const responseText = await response.text();
    console.log('Eden API response status:', response.status);

    if (!response.ok) {
      console.error('Eden API error:', responseText);

      // Provide specific error messages based on status code
      let errorMessage = 'Unknown error';
      if (response.status === 401) {
        errorMessage = 'Invalid API key';
      } else if (response.status === 429) {
        errorMessage = 'Rate limit exceeded. Please try again in a few minutes';
      } else if (response.status === 400) {
        errorMessage = 'Invalid request parameters';
      } else if (response.status >= 500) {
        errorMessage = 'Eden API server error. Please try again later';
      } else {
        errorMessage = responseText || response.statusText;
      }

      return NextResponse.json(
        { error: errorMessage },
        { status: response.status }
      );
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse Eden response:', e);
      return NextResponse.json(
        { error: 'Invalid response from Eden API' },
        { status: 500 }
      );
    }

    // Extract taskId following hello-eden pattern
    const taskId = data.task?._id || data.taskId || data.task_id || data.id || data._id;

    if (!taskId) {
      console.error('No taskId found in response:', data);
      return NextResponse.json(
        { error: 'No taskId returned from Eden API' },
        { status: 500 }
      );
    }

    console.log('Task created successfully:', taskId);
    return NextResponse.json({
      taskId,
      estimatedTime: body.args?.duration ? `${Math.ceil(body.args.duration / 8)} minutes` : '2-3 minutes'
    });

  } catch (error) {
    console.error('Error creating Eden task:', error);

    // Handle specific error types
    let errorMessage = 'Failed to create task';
    if (error instanceof Error) {
      if (error.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your connection';
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