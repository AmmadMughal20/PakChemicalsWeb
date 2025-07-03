import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import dbConnect from '@/lib/dbConnect';
import OrderModel from '@/models/Order';

export interface JwtPayload
{
    id: string;
    name: string;
    phone: string;
    email?: string;
    address?: string;
    role?: string;
}

export async function POST(req: Request)
{
    try
    {
        const authHeader = req.headers.get('token');

        if (!authHeader || !authHeader.startsWith('Bearer '))
        {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const token = authHeader.split(' ')[1];
        const JWT_SECRET = process.env.JWT_SECRET!;

        const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;

        if (!decoded?.id)
        {
            return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
        }

        const body = await req.json();
        const { customer, products, total, date, orderType } = body;

        if (!customer || !products || !total || !date || !orderType)
        {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        await dbConnect();

        const newOrder = await OrderModel.create({
            customer,
            items: products,
            total,
            timestamp: date,
            orderType,
            user: decoded.id,
        });

        return NextResponse.json(newOrder, { status: 201 });
    } catch (error: unknown)
    {
        if (error instanceof Error)
        {
            console.error('[ORDER_POST_ERROR]', error.message);
        } else
        {
            console.error('Unknown error loading data:', error);
        }
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
