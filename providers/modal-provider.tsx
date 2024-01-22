"use client";

import { useState, useEffect } from "react";

import { StoreModal } from "@/components/modals/store-modal";

export const ModalProvider = () => {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(()=>{
        setIsMounted(true);
    },[]);

    // To check if it has not mounted i.e. if i am in server side rendering -> return null
    // no hydration error between client and server side
    if(!isMounted){
        return null;
    }

    // If in client side
    return(
        <>
            <StoreModal />
        </>
    )
}