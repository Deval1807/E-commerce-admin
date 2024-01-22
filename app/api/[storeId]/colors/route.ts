import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

// api for creating colors

export async function POST(
    req: Request,
    { params }: { params: { storeId: string } }
){
    try{
        // To get the access of currently logged in user
        const { userId } = auth();

        const body = await req.json();  
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

        // If everything satisfied: Create Color
        const color = await prismadb.color.create({
            data: {
                name,
                value,
                storeId: params.storeId
            }
        });


        return NextResponse.json(color);
        
    }catch(error){
        console.log('COLORS_POST',error);
        return new NextResponse("Internal Error", {status: 500 });
    }
};

// To get all Colors in frontend
export async function GET(
    req: Request,
    { params }: { params: { storeId: string } }
){
    try{
        if(!params.storeId){
            return new NextResponse("Store ID is Required", { status: 400 });
        }

        const colors = await prismadb.color.findMany({
            where: {
                storeId: params.storeId,
            },
        });


        return NextResponse.json(colors);
        
    }catch(error){
        console.log('COLORS_GET',error);
        return new NextResponse("Internal Error", {status: 500 });
    }
};