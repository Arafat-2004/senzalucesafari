import { NextRequest, NextResponse } from 'next/server';
import { getSession } from '@/lib/admin-auth';

export async function checkRBACMiddleware(
  request: NextRequest,
  module: string,
  action: string
) {
  try {
    const session = await getSession();
    
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    if (session.role.name === 'super_admin') {
      return null;
    }

    const permissions = session.role.permissions[module] || [];
    if (!permissions.includes(action)) {
      return NextResponse.json(
        { error: 'Forbidden: Insufficient permissions' },
        { status: 403 }
      );
    }

    // Permission granted
    return null;
  } catch (error) {
    return NextResponse.json(
      { error: 'Authentication failed' },
      { status: 401 }
    );
  }
}
