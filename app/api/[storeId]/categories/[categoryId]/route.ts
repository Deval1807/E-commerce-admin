import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

// Apis for individual category - GET, PATCH (for updating) and DELETE (for deleting category)

export async function GET (
    req: Request,   // Even though it is not used, it is required. As the params is always a secnond argument
    { params }: { params: {categoryId: string} }
) {
    try{

        if(!params.categoryId){
            return new NextResponse("Category id is Required", { status: 400 });
        }

        const category = await prismadb.category.findUnique({
            where:{
                id: params.categoryId,
            },
            include: {
                billboard: true,
            }
        });

        return NextResponse.json(category);

    }catch (error){
        console.log('CATEGORY_GET',error);
        return new NextResponse("Internal Error", {status: 500 });
    }
};

export async function PATCH (
    req: Request,
    { params }: { params: {storeId: string, categoryId: string} }
) {
    try{
        const { userId } = auth();

        const body = await req.json();  
        // Extract label and image url from body
        const { name, billboardId } = body;

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!name) {
            return new NextResponse("Name is Required", { status: 400 });
        }

        if(!billboardId) {
            return new NextResponse("Billboard ID is Required", { status: 400 });
        }

        if(!params.storeId){
            return new NextResponse("Store id is Required", { status: 400 });
        }

        if(!params.categoryId){
            return new NextResponse("Category id is Required", { status: 400 });
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

        const category = await prismadb.category.updateMany({
            where:{ 
                id: params.categoryId,
            },
            data: {
                name,
                billboardId
            }
        });

        return NextResponse.json(category);
        

    }catch (error){
        console.log('CATEGORY_PATCH',error);
        return new NextResponse("Internal Error", {status: 500 });
    }
};

export async function DELETE (
    req: Request,   // Even though it is not used, it is required. As the params is always a secnond argument
    { params }: { params: {storeId: string, categoryId: string} }
) {
    try{
        const { userId } = auth(); 

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!params.storeId){
            return new NextResponse("StoreId is Required", { status: 400 });
        }

        if(!params.categoryId){
            return new NextResponse("Category id is Required", { status: 400 });
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

        const category = await prismadb.category.deleteMany({
            where:{
                id: params.categoryId,
            }
        });

        return NextResponse.json(category);

    }catch (error){
        console.log('CATEGORY_DELETE',error);
        return new NextResponse("Internal Error", {status: 500 });
    }
};