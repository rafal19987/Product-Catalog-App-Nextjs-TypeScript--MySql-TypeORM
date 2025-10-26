import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createProductSchema } from "@/app/validations/product";

export async function POST(request: NextRequest): Promise<Response> {
    try {
        const body = await request.json();

        const validationResult = createProductSchema.safeParse(body);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Validation error',
                    details: validationResult.error.flatten().fieldErrors,
                },
                { status: 400 }
            );
        }

        const { name, sku, description, price, stock, imageUrl, isActive, categoryId } = validationResult.data;

        const existingBySku = await prisma.product.findUnique({
            where: { sku },
        });

        if (existingBySku) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Produkt o tym SKU już istnieje',
                },
                { status: 409 }
            );
        }

        if (categoryId) {
            const categoryExists = await prisma.category.findUnique({
                where: { id: categoryId },
            });

            if (!categoryExists) {
                return NextResponse.json(
                    {
                        success: false,
                        error: 'Podana kategoria nie istnieje',
                    },
                    { status: 404 }
                );
            }
        }

        const savedProduct = await prisma.product.create({
            data: {
                name,
                sku,
                description: description || null,
                price,
                stock: stock || 0,
                imageUrl: imageUrl || null,
                isActive: isActive ?? true,
                categoryId: categoryId || null,
            },
            include: {
                category: true,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Produkt został dodany',
                data: savedProduct,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating product:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Nie udało się utworzyć produktu',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}

export async function GET(request: NextRequest): Promise<Response> {
    try {
        const searchParams = request.nextUrl.searchParams;

        const page = parseInt(searchParams.get('page') || '1');
        const limit = parseInt(searchParams.get('limit') || '10');
        const active = searchParams.get('active');
        const query = searchParams.get('query') || '';

        const skip = (page - 1) * limit;

        const where: any = {};
        if (active !== null) {
            where.isActive = active === 'true';
        }

        if (query.trim() !== '') {
            where.name = {
                contains: query,
            };
        }

        const [products, total] = await Promise.all([
            prisma.product.findMany({
                where,
                skip,
                take: limit,
                select: {
                    id: true,
                    name: true,
                    category: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            prisma.product.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            success: true,
            data: products,
            pagination: {
                page,
                limit,
                total,
                totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1,
            },
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Nie udało się pobrać produktów',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}