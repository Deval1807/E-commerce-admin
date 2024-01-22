import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

// Apis for individual product - GET, PATCH (for updating) and DELETE (for deleting product)

export async function GET (
    req: Request,   // Even though it is not used, it is required. As the params is always a secnond argument
    { params }: { params: {productId: string} }
) {
    try{

        if(!params.productId){
            return new NextResponse("Product id is Required", { status: 400 });
        }

        const product = await prismadb.product.findUnique({
            where:{
                id: params.productId,
            },
            // as we need it in our frontend so include
            include: {
                images: true,
                category: true,
                color: true,
                size: true
            }
        });

        return NextResponse.json(product);

    }catch (error){
        console.log('PRODUCT_GET',error);
        return new NextResponse("Internal Error", {status: 500 });
    }
};

export async function PATCH (
    req: Request,
    { params }: { params: {storeId: string, productId: string} }
) {
    try{
        const { userId } = auth();

        const body = await req.json();  
        // Extract label and image url from body
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
            return new NextResponse("Store id is Required", { status: 400 });
        }

        if(!params.productId){
            return new NextResponse("Product id is Required", { status: 400 });
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

       await prismadb.product.update({
            where:{ 
                id: params.productId,
            },
            data: {
                name,
                price,
                isArchived,
                isFeatured,
                colorId,
                categoryId,
                sizeId,
                images: {
                    deleteMany: {}
                }
            }
        });

        const product = await prismadb.product.update({
            where: {
                id: params.productId
            },
            data : {
                images: {
                    createMany: {
                        data: [
                            ...images.map((image: {url: string}) => image),
                        ]
                    }
                }
            }
        })

        return NextResponse.json(product);
        

    }catch (error){
        console.log('PRODUCT_PATCH',error);
        return new NextResponse("Internal Error", {status: 500 });
    }
};

export async function DELETE (
    req: Request,   // Even though it is not used, it is required. As the params is always a secnond argument
    { params }: { params: {storeId: string, productId: string} }
) {
    try{
        const { userId } = auth(); 

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!params.storeId){
            return new NextResponse("StoreId is Required", { status: 400 });
        }

        if(!params.productId){
            return new NextResponse("Product id is Required", { status: 400 });
        }

        // Confirm that this storeId actually exist for this user
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

        const product = await prismadb.product.deleteMany({
            where:{
                id: params.productId,
            }
        });

        return NextResponse.json(product);

    }catch (error){
        console.log('PRODUCT_DELETE',error);
        return new NextResponse("Internal Error", {status: 500 });
    }
};