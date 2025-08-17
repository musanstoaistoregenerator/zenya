import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const { shouldFail } = await request.json();
    
    // Simulate processing time
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Simulate random failure for testing
    if (shouldFail || Math.random() < 0.3) {
      throw new Error('Simulated API failure for testing');
    }

    return NextResponse.json({
      success: true,
      message: 'Test API call successful'
    });
  } catch (error) {
    console.error('Test API error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
}