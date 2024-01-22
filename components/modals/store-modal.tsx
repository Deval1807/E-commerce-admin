"use client";

import * as z from "zod";
import axios from "axios";
import { useForm } from "react-hook-form";
import { useState } from "react";
import toast from "react-hot-toast";

import { useStoreModal } from "@/hooks/use-store-modal";
import { Modal } from "@/components/ui/modal";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const formSchema = z.object({
    name: z.string().min(1),
});

export const StoreModal = () => {
    const storeModal = useStoreModal();

    // To disable variables while loading
    const [loading, setLoading] = useState(false);


    // Hook for our form
    const form = useForm<z.infer<typeof formSchema>>({
        // Resolver - so than form can be validated through zod
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
        },
    });

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values);
        // Create Store    
        
        try{
            setLoading(true);

            const response = await axios.post(`/api/stores`,values);

            // Now created succesfully -> redirect to dashboard
            // We use window.location instead of navigate, as this refresh our page 
            // therefore loaded 100%
            window.location.assign(`/${response.data.id}`);          
        }catch(error){
            toast.error("Something went wrong!");     
        }finally{
            setLoading(false);
        }
    }

    return(
        <Modal
            title="Create Store"
            description="Add a new Store"
            isOpen={storeModal.isOpen}
            onClose={storeModal.onClose}
        >
            <div>
                <div className="space-y-4 py-2 pb-4">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <FormField 
                            control={form.control} 
                            name="name" 
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Name
                                    </FormLabel>
                                    <FormControl>
                                        <Input disabled={loading} placeholder="Name of the store" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />
                            <div className="pt-6 space-x-2 flex items-center justify-end w-full">
                                <Button
                                disabled={loading}
                                variant="outline"
                                onClick={storeModal.onClose}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={loading}>
                                    Continue
                                </Button>
                            </div>
                        </form>
                    </Form>
                </div>
            </div>
            
        </Modal>
    );
};