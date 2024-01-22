import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

// api for creating billboards

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
){
    try{
        // To get the access of currently logged in user
        const { userId } = auth();

        const body = await req.json();  // needed- label, imageUrl and userId, rest default.... userId from clerk
        // Therefore only needed label and imageUrl from body
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

        // If everything satisfied: Create Billboard
        const billboard = await prismadb.billboard.create({
            data: {
                label,
                imageUrl,
                storeId: params.storeId
            }
        });


        return NextResponse.json(billboard);
        
    }catch(error){
        console.log('BILLBOARDS_POST',error);
        return new NextResponse("Internal Error", {status: 500 });
    }
};

// To get all billboards in frontend
export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
){
    try{
        if(!params.storeId){
            return new NextResponse("Store ID is Required", { status: 400 });
        }

        const billboards = await prismadb.billboard.findMany({
            where: {
                storeId: params.storeId,
            },
        });


        return NextResponse.json(billboards);
        
    }catch(error){
        console.log('BILLBOARDS_GET',error);
        return new NextResponse("Internal Error", {status: 500 });
    }
};