import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

// Apis for individual size - GET, PATCH (for updating) and DELETE (for deleting size)

export async function GET (
    req: Request,   // Even though it is not used, it is required. As the params is always a secnond argument
    { params }: { params: {sizeId: string} }
) {
    try{

        if(!params.sizeId){
            return new NextResponse("Size id is Required", { status: 400 });
        }

        const size = await prismadb.size.findUnique({
            where:{
                id: params.sizeId,
            }
        });

        return NextResponse.json(size);

    }catch (error){
        console.log('SIZE_GET',error);
        return new NextResponse("Internal Error", {status: 500 });
    }
};

export async function PATCH (
    req: Request,
    { params }: { params: {storeId: string, sizeId: string} }
) {
    try{
        const { userId } = auth();

        const body = await req.json();  
        // Extract name and value from body
        const { name, value } = body;

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!name) {
            return new NextResponse("Name is Required", { status: 400 });
        }

        if(!value) {
            return new NextResponse("Value is Required", { status: 400 });
        }

        if(!params.storeId){
            return new NextResponse("Store id is Required", { status: 400 });
        }

        if(!params.sizeId){
            return new NextResponse("Size id is Required", { status: 400 });
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

        const size = await prismadb.size.updateMany({
            where:{ 
                id: params.sizeId,
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(size);
        

    }catch (error){
        console.log('SIZE_PATCH',error);
        return new NextResponse("Internal Error", {status: 500 });
    }
};

export async function DELETE (
    req: Request,   // Even though it is not used, it is required. As the params is always a secnond argument
    { params }: { params: {storeId: string, sizeId: string} }
) {
    try{
        const { userId } = auth(); 

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!params.storeId){
            return new NextResponse("StoreId is Required", { status: 400 });
        }

        if(!params.sizeId){
            return new NextResponse("Size id is Required", { status: 400 });
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

        const size = await prismadb.size.deleteMany({
            where:{
                id: params.sizeId,
            }
        });

        return NextResponse.json(size);

    }catch (error){
        console.log('SIZE_DELETE',error);
        return new NextResponse("Internal Error", {status: 500 });
    }
};