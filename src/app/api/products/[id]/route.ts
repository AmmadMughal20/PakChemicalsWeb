import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import ProductModel from '@/models/Product';
import { isValidObjectId } from 'mongoose';
import cloudinary from '@/lib/cloudinary';

const extractPublicId = (url: string) =>
{
    const matches = url.match(/\/upload\/(?:v\d+\/)?(.+)\.(jpg|jpeg|png|webp|gif)$/);
    return matches ? matches[1] : null;
};

// 🔹 GET product by ID
export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> })
{
    await dbConnect();
    const { id } = await params;

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
export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> })
{
    await dbConnect();
    const { id } = await params;
    const body = await req.json();

    if (!isValidObjectId(id))
    {
        return NextResponse.json({ error: 'Invalid Product ID' }, { status: 400 });
    }

    try
    {
        const existing = await ProductModel.findById(id);
        if (!existing)
        {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        // 🔁 If image is being updated, delete the old one
        if (body.image_link && body.image_link !== existing.image_link)
        {
            const oldPublicId = extractPublicId(existing.image_link);
            if (oldPublicId)
            {
                try
                {
                    await cloudinary.uploader.destroy(oldPublicId);
                } catch (err)
                {
                    console.warn('Failed to delete old Cloudinary image:', err);
                }
            }
        }

        const updated = await ProductModel.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });

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
export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> })
{
    console.log('calling delete product api')
    await dbConnect();
    const { id } = await params;

    if (!isValidObjectId(id))
    {
        return NextResponse.json({ error: 'Invalid Product ID' }, { status: 400 });
    }

    const product = await ProductModel.findById(id);
    if (!product)
    {
        return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // 🧹 Remove Cloudinary image
    const publicId = extractPublicId(product.image_link);
    if (publicId)
    {
        try
        {
            await cloudinary.uploader.destroy(publicId);
        } catch (err)
        {
            console.warn('Failed to delete Cloudinary image:', err);
        }
    }

    await product.deleteOne();

    return NextResponse.json({ message: 'Product deleted successfully' });
}
