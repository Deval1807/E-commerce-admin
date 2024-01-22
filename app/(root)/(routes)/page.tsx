"use client";

import { useEffect } from "react";

import { useStoreModal } from "@/hooks/use-store-modal";


const HomePage = () =>{

  //No need to render modal in Return(), we already have it in our layout. so can directly trigger it
  const onOpen = useStoreModal((state) => state.onOpen)
  const isOpen = useStoreModal((state) => state.isOpen)

  // Cant close the create store form. As no store is there. Minimum 1 store needed
  useEffect(() => {
    if(!isOpen) {
      onOpen();
    }
  }, [isOpen, onOpen]);

  return null;
}

export default HomePage;
