import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

// api for creating products

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
){
    try{
        // To get the access of currently logged in user
        const { userId } = auth();

        const body = await req.json();  
        const { 
            name,
            price,
            categoryId,
            colorId,
            sizeId,
            images,
            isFeatured,
            isArchived
        } = body;

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!name) {
            return new NextResponse("Name is Required", { status: 400 });
        }

        if(!images || !images.length) {
            return new NextResponse("Images are Required", { status: 400 });
        }

        if(!price) {
            return new NextResponse("Price is Required", { status: 400 });
        }

        if(!categoryId) {
            return new NextResponse("Category Id is Required", { status: 400 });
        }

        if(!colorId) {
            return new NextResponse("Color Id is Required", { status: 400 });
        }

        if(!sizeId) {
            return new NextResponse("Size Id is Required", { status: 400 });
        }

        if(!params.storeId){
            return new NextResponse("Store ID is Required", { status: 400 });
        }

        // Confirm that this storeId actually exist for this user
        // 
        const storeByUseId = await prismadb.store.findFirst({
            where: {
                id: params.storeId,
                userId
            }
        });

        if(!storeByUseId) {
            // user is trying to update someone else's store
            return new NextResponse("Unauthorized", { status: 403 });
        }

        // If everything satisfied: Create Product
        const product = await prismadb.product.create({
            data: {
                name,
                price,
                isArchived,
                isFeatured,
                colorId,
                categoryId,
                sizeId,
                storeId: params.storeId,
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: { url: string }) => image)
                        ]
                    }
                }
            }
        });


        return NextResponse.json(product);
        
    }catch(error){
        console.log('PRODUCTS_POST',error);
        return new NextResponse("Internal Error", {status: 500 });
    }
};

// To get all products in frontend
// Heavily used in frontedn - therefore use filters to get specific products only
export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
){
    try{
        const { searchParams } = new URL(req.url);
        const categoryId = searchParams.get("categoryId") || undefined;
        const colorId = searchParams.get("colorId") || undefined;
        const sizeId = searchParams.get("sizeId") || undefined;
        const isFeatured = searchParams.get("isFeatured");

        if(!params.storeId){
            return new NextResponse("Store ID is Required", { status: 400 });
        }

        const products = await prismadb.product.findMany({
            where: {
                storeId: params.storeId,
                categoryId,
                colorId,
                sizeId,
                isFeatured: isFeatured ? true : undefined,
                isArchived: false
            },
            // include as we need it on our frontend
            include : {
                images: true,
                category: true,
                size: true,
                color: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json(products);
        
    }catch(error){
        console.log('PRODUCTS_GET',error);
        return new NextResponse("Internal Error", {status: 500 });
    }
};