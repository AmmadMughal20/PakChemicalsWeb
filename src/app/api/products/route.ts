
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/models/Product';
import { NextRequest, NextResponse } from 'next/server';

// 🔹 GET all products
export async function GET()
{
    await dbConnect();
    const products = await ProductModel.find({});
    return NextResponse.json(products);
}

export async function POST(req: NextRequest)
{
    await dbConnect();

    const body = await req.json();

    // ✅ Validate fields
    const requiredFields = [
        'title_english', 'desc_english', 'category_english', 'price_english', 'unit_english',
        'title_urdu', 'desc_urdu', 'category_urdu', 'price_urdu', 'unit_urdu', 'image_link'
    ];

    const missingFields = requiredFields.filter(field => !body[field]);

    if (missingFields.length > 0)
    {
        return NextResponse.json(
            { error: `Missing fields: ${missingFields.join(', ')}` },
            { status: 400 }
        );
    }

    try
    {
        const product = await ProductModel.create(body);
        return NextResponse.json(product, { status: 201 });
    } catch (err: unknown)
    {
        if (err instanceof Error)
        {
            return NextResponse.json({ error: err.message }, { status: 400 });
        }
        // fallback for non-Error objects
        return NextResponse.json({ error: 'An unknown error occurred' }, { status: 400 });
    }
}