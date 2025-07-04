import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET);

const protectedRoutes: {
    [key: string]: { [method: string]: string[] }; // path => method => allowedRoles
} = {
    '/api/users': {
        GET: ['admin'],
        POST: ['admin'],
        PUT: ['admin', 'distributor'],
        DELETE: ['admin'],
        PATCH: ['admin'],
    },
    '/api/orders': {
        POST: ['admin', 'distributor'],
        GET: ['admin'],
    },
    '/api/orders/my': {
        GET: ['admin', 'distributor'],
    },
    '/api/products': {
        GET: ['admin', 'distributor'],
        POST: ['admin'], // only admin can create
        PUT: ['admin'],
        DELETE: ['admin'],
    },
    '/api/cloudinary-signature': {
        POST: ['admin', 'distributor'],
    },
};

export async function middleware(req: NextRequest)
{
    const url = req.nextUrl.pathname;
    const method = req.method;

    const matchedEntry = Object.entries(protectedRoutes)
        .sort((a, b) => b[0].length - a[0].length) // prioritize longer (more specific) paths
        .find(([path]) => url.startsWith(path));

    if (!matchedEntry) return NextResponse.next(); // route is not protected

    const [route, methodMap] = matchedEntry;
    console.log(route, 'printing route')
    const allowedRoles = methodMap[method];

    if (!allowedRoles)
    {
        // Method not allowed at all
        return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    }

    const authHeader = req.headers.get('token');
    const token = authHeader?.split(' ')[1];

    if (!token)
    {
        return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 });
    }

    try
    {
        const { payload } = await jwtVerify(token, JWT_SECRET);

        if (typeof payload.role !== 'string' || typeof payload.id !== 'string')
        {
            return NextResponse.json({ error: 'Invalid token payload' }, { status: 401 });
        }

        if (!allowedRoles.includes(payload.role))
        {
            return NextResponse.json({ error: 'Forbidden - Role not allowed' }, { status: 403 });
        }

        // ✅ Pass user info forward if needed
        const requestHeaders = new Headers(req.headers);
        requestHeaders.set('x-user-id', payload.id);
        requestHeaders.set('x-user-role', payload.role);

        return NextResponse.next({
            request: { headers: requestHeaders },
        });
    } catch (err)
    {
        console.error('JWT verification failed:', err);
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }
}

// 👇 Required to activate middleware on specific routes
export const config = {
    matcher: ['/api/users/:path*', '/api/orders/:path*', '/api/products/:path*', '/api/cloudinary-signature/:path*'],
};
