'use client'
import UserForm from "@/components/layout/UserForm";
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function EditUserPage(){

    const {loading, data} = useProfile();
    const [user, setUser] = useState(null)
    const {id} = useParams()

    useEffect(() => {
        fetch('/api/users').then(res => {
            res.json().then(users => {
                const user = users.find(u => u._id === id)
                setUser(user)
            })
        })
    }, [])
    
    if(loading){
        return 'Loading user profile...'
    }
    if(!data.admin){
        return 'Not an admin'
    }

    return(
        <section className="mt-8 mx-auto max-w-2xl">
            <UserTabs isAdmin={true}></UserTabs>
            <div className="mt-8">
                <UserForm user={user}></UserForm>
            </div>
        </section>
    )
}