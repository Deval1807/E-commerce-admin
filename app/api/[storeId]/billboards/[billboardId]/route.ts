import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

// Apis for individual billboard - GET, PATCH (for updating) and DELETE (for deleting billboard)

export async function GET (
    req: Request,   // Even though it is not used, it is required. As the params is always a secnond argument
    { params }: { params: {billboardId: string} }
) {
    try{

        if(!params.billboardId){
            return new NextResponse("Billboard id is Required", { status: 400 });
        }

        const billboard = await prismadb.billboard.findUnique({
            where:{
                id: params.billboardId,
            }
        });

        return NextResponse.json(billboard);

    }catch (error){
        console.log('BILLBOARD_GET',error);
        return new NextResponse("Internal Error", {status: 500 });
    }
};

export async function PATCH (
    req: Request,
    { params }: { params: {storeId: string, billboardId: string} }
) {
    try{
        const { userId } = auth();

        const body = await req.json();  
        // Extract label and image url from body
        const { label, imageUrl } = body;

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!label) {
            return new NextResponse("Label is Required", { status: 400 });
        }

        if(!imageUrl) {
            return new NextResponse("Image URL is Required", { status: 400 });
        }

        if(!params.storeId){
            return new NextResponse("Store id is Required", { status: 400 });
        }

        if(!params.billboardId){
            return new NextResponse("Billboard id is Required", { status: 400 });
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

        const billboard = await prismadb.billboard.updateMany({
            where:{ 
                id: params.billboardId,
            },
            data: {
                label,
                imageUrl
            }
        });

        return NextResponse.json(billboard);
        

    }catch (error){
        console.log('BILLBOARD_PATCH',error);
        return new NextResponse("Internal Error", {status: 500 });
    }
};

export async function DELETE (
    req: Request,   // Even though it is not used, it is required. As the params is always a secnond argument
    { params }: { params: {storeId: string, billboardId: string} }
) {
    try{
        const { userId } = auth(); 

        if(!userId) {
            return new NextResponse("Unauthenticated", { status: 401 });
        }

        if(!params.storeId){
            return new NextResponse("StoreId is Required", { status: 400 });
        }

        if(!params.billboardId){
            return new NextResponse("Billboard id is Required", { status: 400 });
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

        const billboard = await prismadb.billboard.deleteMany({
            where:{
                id: params.billboardId,
            }
        });

        return NextResponse.json(billboard);

    }catch (error){
        console.log('BILLBOARD_DELETE',error);
        return new NextResponse("Internal Error", {status: 500 });
    }
};