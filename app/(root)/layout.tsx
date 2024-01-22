import { auth } from "@clerk/nextjs";
import { redirect } from "next/navigation";

import prismadb from "@/lib/prismadb";

export default async function SetupLayout({
    children
}:{
    children: React.ReactNode;
}){
    const { userId } = auth();

    if(!userId) {
        redirect('/sign-in');
    }

    // Here we dont have any specific storeId 
    // Therefore we load any (the first) store with currently logged in user
    // and then if store exist, redirect
    const store = await prismadb.store.findFirst({
        where:{
            userId
        }
    });

    if(store){
        redirect(`/${store.id}`);
    }

    // otherwise

    return(
        <>
            {children}
        </>
    )
}