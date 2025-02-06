'use client'
import { useProfile } from "@/components/UseProfile";
import { useState } from "react";
import toast from "react-hot-toast";
import UserTabs from "@/components/layout/UserTabs";
import EditableImage from "@/components/layout/EditableImage";
import Link from "next/link";
import Left from "@/components/icons/Left";
import { redirect } from "next/navigation";

export default function NewMenuItemPage() {

    const [image, setImage] = useState('');
    const {loading, data} = useProfile();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [redirectToItems, setRedirectToItems] = useState(false);
    const [basePrice, setBasePrice] = useState('');

    async function handleFormSubmit(ev){
        ev.preventDefault();
        const data = {name, description, basePrice, image};
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
            <div className="max-w-md mx-auto mt-8">
                <Link 
                    className="button" 
                    href={'/menu-items'}>
                    <Left></Left>
                    <span>Show all menu items</span>
                </Link>
            </div>
            <form className="mt-8 max-w-md mx-auto" onSubmit={handleFormSubmit}>
                <div 
                    className="grid items-start gap-2" 
                    style={{gridTemplateColumns: '.3fr .7fr'}}>
                    <div>
                        <EditableImage link={image} setLink={setImage}></EditableImage>
                    </div>
                    <div className="grow">
                        <label>Item name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={ev => setName(ev.target.value)}>
                        </input>
                        <label>Description</label>
                        <input 
                            type="text" 
                            value={description} 
                            onChange={ev => setDescription(ev.target.value)}>
                        </input>
                        <label>Base Price</label>
                        <input 
                            type="text" 
                            value={basePrice} 
                            onChange={ev => setBasePrice(ev.target.value)}>
                        </input>
                        <button type="submit">Save</button>
                    </div>
                    <div>
                        
                    </div>
                </div>
            </form>
        </section>
    )
}