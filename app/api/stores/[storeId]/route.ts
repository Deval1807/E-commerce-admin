import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

// Apis for individual store settings - PATCH (for updating name) and DELETE (for deleting store)

export async function PATCH (
    req: Request,
    { params }: { params: {storeId: string} }
) {
    try{
        const { userId } = auth();

        const body = await req.json();  
        // Extract name from body
        const { name } = body;

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!name) {
            return new NextResponse("Name is Required", { status: 400 });
        }

        if(!params.storeId){
            return new NextResponse("StoreId is Required", { status: 400 });
        }

        const store = await prismadb.store.updateMany({
            where:{ 
                id: params.storeId,
                userId
            },
            data: {
                name
            }
        });

        return NextResponse.json(store);
        

    }catch (error){
        console.log('STORE_PATCH',error);
        return new NextResponse("Internal Error", {status: 500 });
    }
}

export async function DELETE (
    req: Request,   // Even though it is not used, it is required. As the params is always a secnond argument
    { params }: { params: {storeId: string} }
) {
    try{
        const { userId } = auth(); 

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!params.storeId){
            return new NextResponse("StoreId is Required", { status: 400 });
        }

        const store = await prismadb.store.deleteMany({
            where:{
                id: params.storeId,
                userId
            }
        });

        return NextResponse.json(store);

    }catch (error){
        console.log('STORE_DELETE',error);
        return new NextResponse("Internal Error", {status: 500 });
    }
}