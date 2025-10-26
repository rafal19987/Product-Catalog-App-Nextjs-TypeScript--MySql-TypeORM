import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    request: NextRequest,
    context: { params: Promise<{ id: string }> }
): Promise<Response> {
    try {
        const { id } = await context.params;

        const category = await prisma.category.findFirstOrThrow({
            where: { id },
            include: {
                products: {
                    orderBy: {
                        createdAt: 'desc',
                    },
                },
            },
        });

        if (!category) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Kategoria nie została znaleziona',
                },
                { status: 404 }
            );
        }

        return NextResponse.json({
            success: true,
            data: category,
        });
    } catch (error) {
        console.error('Error fetching category:', error);
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