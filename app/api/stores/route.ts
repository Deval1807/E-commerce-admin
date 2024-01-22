import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs";
import prismadb from "@/lib/prismadb";

// api for creating store

export async function POST(
    req: Request,
){
    try{
        // To get the access of currently logged in user
        const { userId } = auth();

        const body = await req.json();  // needed- name and userId, rest default, userId from clerk
        // Therefore only needed name from body
        const { name } = body;

        if(!userId) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        if(!name) {
            return new NextResponse("Name is Required", { status: 400 });
        }

        // If everything satisfied: Create store
        const store = await prismadb.store.create({
            data: {
                name,
                userId
            }
        });

        return NextResponse.json(store);
        
    }catch(error){
        console.log('STORES_POST',error);
        return new NextResponse("Internal Error", {status: 500 });
    }
}