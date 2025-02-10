'use client'
import { useProfile } from "@/components/UseProfile";
import { useState } from "react";
import toast from "react-hot-toast";
import UserTabs from "@/components/layout/UserTabs";
import Link from "next/link";
import Left from "@/components/icons/Left";
import { redirect } from "next/navigation";
import MenuItemForm from "@/components/layout/MenuItemForm";

export default function NewMenuItemPage() {

    const {loading, data} = useProfile();
    const [redirectToItems, setRedirectToItems] = useState(false);

    async function handleFormSubmit(ev, data){
        ev.preventDefault();
        const savingPromise = new Promise(async(resolve, reject) => {
            const response = await fetch('/api/menu-items', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            if(response.ok){
                resolve();
            } else {
                reject();
            }
        })

        await toast.promise(savingPromise, {
            loading: 'Saving...',
            success: 'Saved',
            error: 'Failed to save',
        })
        
        setRedirectToItems(true);
    }

    if(redirectToItems){
        return redirect('/menu-items')
    }

    if(loading){
        return 'Loading user info...'
    }

    if(!data.admin){
        return 'Not an admin'
    }
 
    return(
        <section className="mt-8">
            <UserTabs isAdmin={true}></UserTabs>
            <div className="max-w-2xl mx-auto mt-8">
                <Link 
                    className="button" 
                    href={'/menu-items'}>
                    <Left></Left>
                    <span>Show all menu items</span>
                </Link>
            </div>
            <MenuItemForm menuItem={null} onSubmit={handleFormSubmit}></MenuItemForm>
        </section>
    )
}