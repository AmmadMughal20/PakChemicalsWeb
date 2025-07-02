import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/models/Product';
import { isValidObjectId } from 'mongoose';

// 🔹 GET product by ID
export async function GET(_: NextRequest, { params }: { params: { id: string } })
{
    await dbConnect();
    const { id } = params;

    if (!isValidObjectId(id))
    {
        return NextResponse.json({ error: 'Invalid Product ID' }, { status: 400 });
    }

    const product = await ProductModel.findById(id);
    if (!product)
    {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json(product);
}

// 🔹 PUT - Update product
export async function PUT(req: NextRequest, { params }: { params: { id: string } })
{
    await dbConnect();
    const { id } = params;
    const body = await req.json();

    if (!isValidObjectId(id))
    {
        return NextResponse.json({ error: 'Invalid Product ID' }, { status: 400 });
    }

    try
    {
        const updated = await ProductModel.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

        if (!updated)
        {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        return NextResponse.json(updated);
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

// 🔹 DELETE - Delete product
export async function DELETE(_: NextRequest, { params }: { params: { id: string } })
{
    await dbConnect();
    const { id } = params;

    if (!isValidObjectId(id))
    {
        return NextResponse.json({ error: 'Invalid Product ID' }, { status: 400 });
    }

    const deleted = await ProductModel.findByIdAndDelete(id);
    if (!deleted)
    {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Product deleted successfully' });
}
