'use client'
import Right from "@/components/icons/Right";
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function MenuItemsPage() {

    const {loading, data} = useProfile();
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() =>{
        fetch('/api/menu-items').then(res => {
            res.json().then(menuItems => {
                setMenuItems(menuItems)
            })
        })
    },[])

    if(loading){
        return 'Loading user info...'
    }

    if(!data.admin){
        return 'Not an admin'
    }

    

    return (
        <section className="mt-8 max-w-2xl mx-auto">
            <UserTabs isAdmin={true}></UserTabs>
            <div className="mt-8">
                <Link 
                    className="button flex" 
                    href="/menu-items/new">
                    <span>Create new menu item</span>
                    <Right></Right>
                </Link>
            </div>
            <div>
                <h2 className="text-sm text-gray-500 dark:text-slate-400 mt-8">Edit menu item:</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {menuItems?.length > 0 && menuItems.map(item => (
                    <Link href={'/menu-items/edit/'+item._id} 
                            className="bg-gray-200 dark:bg-slate-800 rounded-lg p-4 hover:bg-gray-300 dark:hover:bg-slate-700 transition-colors" key={item._id}>
                        <div className="relative">
                            <Image
                                className="rounded-md w-full h-auto"
                                src={item.image} alt={''} width={200} height={200}></Image>
                        </div>
                        <div className="text-center dark:text-slate-100 mt-2">
                            {item.name}
                        </div>
                    </Link>
                ))}
                </div>
            </div>
        </section>
    )
}