'use client'
import Right from "@/components/icons/Right";
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
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
        <section className="mt-8 max-w-md mx-auto">
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
                {menuItems?.length > 0 && menuItems.map(item => (
                    <button key={item._id}>
                        {item.name}
                    </button>
                ))}
            </div>
        </section>
    )
}