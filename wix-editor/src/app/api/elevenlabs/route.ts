import { NextResponse } from 'next/server';

export async function POST(request: Request) {
    try {
        const { text, voiceId } = await request.json();

        if (!text || typeof text !== 'string') {
            return NextResponse.json({ error: 'Text is required and must be a string' }, { status: 400 });
        }

        if (text.length > 5000) {
            return NextResponse.json({ error: 'Text exceeds maximum length of 5000 characters' }, { status: 400 });
        }

        const apiKey = process.env.ELEVENLABS_API_KEY;
        if (!apiKey) {
            console.error('ELEVENLABS_API_KEY is missing in environment variables');
            return NextResponse.json({ error: 'Server configuration error: parameters missing' }, { status: 500 });
        }

        // Default voice: 'JBFqnCBsd6RMkjVDRZzb' (User Requested) if not provided
        const voice = voiceId || 'JBFqnCBsd6RMkjVDRZzb';

        try {
            console.log(`Sending request to ElevenLabs for voice: ${voice}`);
            const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voice}`, {
                method: 'POST',
                headers: {
                    'Accept': 'audio/mpeg',
                    'Content-Type': 'application/json',
                    'xi-api-key': apiKey,
                },
                body: JSON.stringify({
                    text,
                    model_id: 'eleven_multilingual_v2',
                    voice_settings: {
                        stability: 0.5,
                        similarity_boost: 0.5,
                    }
                }),
            });

            if (!response.ok) {
                const errorText = await response.text();
                console.error(`ElevenLabs API Error: Status ${response.status}`, errorText);

                if (response.status === 401) {
                    return NextResponse.json({ error: 'Invalid API Key' }, { status: 401 }); // distinct status for auth error
                }
                if (response.status === 429) {
                    return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 });
                }
                return NextResponse.json({ error: 'Failed to generate speech', details: errorText }, { status: response.status });
            }

            const audioBuffer = await response.arrayBuffer();

            return new NextResponse(audioBuffer, {
                headers: {
                    'Content-Type': 'audio/mpeg',
                    'Content-Length': audioBuffer.byteLength.toString(),
                },
            });
        } catch (fetchError) {
            console.error('Network error calling ElevenLabs:', fetchError);
            return NextResponse.json({ error: 'Failed to connect to speech service' }, { status: 502 });
        }

    } catch (error) {
        console.error('Error in ElevenLabs API route:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
