'use client'
import { useProfile } from "@/components/UseProfile";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UserTabs from "@/components/layout/UserTabs";
import Link from "next/link";
import Left from "@/components/icons/Left";
import { redirect, useParams } from "next/navigation";
import MenuItemForm from "@/components/layout/MenuItemForm";

export default function EditMenuItemPage() {

    const {id} = useParams();

    const [menuItem, setMenuItem] = useState(null);
    const [redirectToItems, setRedirectToItems] = useState(false);
    const {loading, data} = useProfile();

    useEffect(() => {
        fetch('/api/menu-items').then(res => {
            res.json().then(items => {
                const item = items.find(i => i._id === id);
                setMenuItem(item);
            })
        })
    },[])

    async function handleFormSubmit(ev, data){
        ev.preventDefault();
        data = {...data, _id: id};
        const savingPromise = new Promise(async(resolve, reject) => {
            const response = await fetch('/api/menu-items', {
                method: 'PUT',
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
            <div className="max-w-md mx-auto mt-8">
                <Link 
                    className="button" 
                    href={'/menu-items'}>
                    <Left></Left>
                    <span>Show all menu items</span>
                </Link>
            </div>
            <MenuItemForm menuItem={menuItem} onSubmit={handleFormSubmit}></MenuItemForm>
        </section>
    )
}