import { NextResponse } from 'next/server';

/**
 * GET /api/health/version
 * Returns the current deployment build version and environment.
 * Does NOT expose secrets, connection strings, or credentials.
 */
export async function GET() {
    const info = {
        version: process.env.NEXT_PUBLIC_APP_VERSION || 'unknown',
        gitSha: process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 8) || process.env.GIT_SHA?.slice(0, 8) || 'local',
        environment: process.env.VERCEL_ENV || process.env.NODE_ENV || 'development',
        region: process.env.VERCEL_REGION || 'local',
        deployedAt: process.env.VERCEL_GIT_COMMIT_TIMESTAMP || null,
        buildTimestamp: process.env.BUILD_TIMESTAMP || null,
    };

    return NextResponse.json(info, {
        headers: {
            'Cache-Control': 'no-store, max-age=0',
            'X-Build-Sha': info.gitSha,
        },
    });
}
