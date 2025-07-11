import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/models/Order';
import jwt from 'jsonwebtoken';

export async function GET(req: NextRequest)
{
    await dbConnect();

    try
    {
        const authHeader = req.headers.get('token');

        const token = authHeader?.split(' ')[1];

        if (!token)
        {
            return NextResponse.json({ error: 'Unauthorized - No token' }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

        const userId = decoded.id;

        const orders = await OrderModel.find({ user: userId }).sort({ createdAt: -1 });

        return NextResponse.json({ orders });
    } catch (err)
    {
        console.error('[GET /api/orders/my] Error:', err);
        return NextResponse.json({ error: 'Failed to fetch orders' }, { status: 500 });
    }
}