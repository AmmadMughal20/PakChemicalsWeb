import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET as string;

const protectedRoutes: { [key: string]: string[] } = {
    '/api/users': ['admin'],        // only admin can access /api/users
    '/api/orders': ['admin', 'distributor'], // both can access
};

export function middleware(req: NextRequest)
{
    const url = req.nextUrl.pathname;

    // Find matched protected route
    const matched = Object.entries(protectedRoutes).find(([path]) =>
        url.startsWith(path)
    );

    if (!matched)
    {
        return NextResponse.next(); // ✅ Allow if not protected
    }

    const [matchedPath, allowedRoles] = matched;

    const authHeader = req.headers.get('authorization');
    const token = authHeader?.split(' ')[1];

    if (!token)
    {
        return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 });
    }

    try
    {
        const decoded = jwt.verify(token, JWT_SECRET) as {
            id: string;
            name: string;
            phone: string;
            role: 'admin' | 'distributor';
        };

        // Check if user role is allowed
        if (!allowedRoles.includes(decoded.role))
        {
            return NextResponse.json({ error: 'Forbidden - Role not allowed' }, { status: 403 });
        }

        // ✅ Attach user data to request if needed (e.g. req.user via cookies or headers)
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('x-user-id', decoded.id);
        requestHeaders.set('x-user-role', decoded.role);

        return NextResponse.next({ request: { headers: requestHeaders } });
    } catch (err)
    {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}
