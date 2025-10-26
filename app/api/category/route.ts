import { NextRequest, NextResponse } from "next/server";
import { createCategorySchema } from "@/app/validations/category";
import { prisma } from "@/lib/prisma";

export async function POST(request: NextRequest): Promise<Response> {
    try {
        const body = await request.json();

        const validationResult = createCategorySchema.safeParse(body);

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

        const { name, description } = validationResult.data;

        const slug = name
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/^-+|-+$/g, '');

        const existingByName = await prisma.category.findUnique({
            where: { name },
        });

        if (existingByName) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Kategoria o tej nazwie już istnieje',
                },
                { status: 409 }
            );
        }

        const existingBySlug = await prisma.category.findUnique({
            where: { slug },
        });

        if (existingBySlug) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Kategoria o tym slugu już istnieje',
                },
                { status: 409 }
            );
        }

        const savedCategory = await prisma.category.create({
            data: {
                name,
                slug,
                description: description || null,
                active: true,
            },
        });

        return NextResponse.json(
            {
                success: true,
                message: 'Kategoria została dodana',
                data: savedCategory,
            },
            { status: 201 }
        );
    } catch (error) {
        console.error('Error creating category:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Nie udało się utworzyć kategorii',
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
            where.active = active === 'true';
        }

        if (query.trim() !== '') {
            where.name = {
                contains: query,
            };
        }
        
        const [categories, total] = await Promise.all([
            prisma.category.findMany({
                where,
                skip,
                take: limit,
                select: {
                  id: true,
                  name: true,
                },
                orderBy: {
                    createdAt: 'desc',
                },
            }),
            prisma.category.count({ where }),
        ]);

        const totalPages = Math.ceil(total / limit);

        return NextResponse.json({
            success: true,
            data: categories,
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
        console.error('Error fetching categories:', error);
        return NextResponse.json(
            {
                success: false,
                error: 'Nie udało się pobrać kategorii',
                message: error instanceof Error ? error.message : 'Unknown error',
            },
            { status: 500 }
        );
    }
}