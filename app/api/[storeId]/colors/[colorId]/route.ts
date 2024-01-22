import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

// Apis for individual size - GET, PATCH (for updating) and DELETE (for deleting color)

export async function GET (
    req: Request,   // Even though it is not used, it is required. As the params is always a secnond argument
    { params }: { params: {colorId: string} }
) {
    try{

        if(!params.colorId){
            return new NextResponse("Color id is Required", { status: 400 });
        }

        const color = await prismadb.color.findUnique({
            where:{
                id: params.colorId,
            }
        });

        return NextResponse.json(color);

    }catch (error){
        console.log('COLOR_GET',error);
        return new NextResponse("Internal Error", {status: 500 });
    }
};

export async function PATCH (
    req: Request,
    { params }: { params: {storeId: string, colorId: string} }
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

        if(!params.colorId){
            return new NextResponse("Color id is Required", { status: 400 });
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

        const color = await prismadb.color.updateMany({
            where:{ 
                id: params.colorId,
            },
            data: {
                name,
                value
            }
        });

        return NextResponse.json(color);
        

    }catch (error){
        console.log('COLOR_PATCH',error);
        return new NextResponse("Internal Error", {status: 500 });
    }
};

export async function DELETE (
    req: Request,   // Even though it is not used, it is required. As the params is always a secnond argument
    { params }: { params: {storeId: string, colorId: string} }
) {
    try{
        const { userId } = auth(); 

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!params.storeId){
            return new NextResponse("StoreId is Required", { status: 400 });
        }

        if(!params.colorId){
            return new NextResponse("Color id is Required", { status: 400 });
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

        const color = await prismadb.color.deleteMany({
            where:{
                id: params.colorId,
            }
        });

        return NextResponse.json(color);

    }catch (error){
        console.log('COLOR_DELETE',error);
        return new NextResponse("Internal Error", {status: 500 });
    }
};