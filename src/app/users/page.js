'use client'
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function UsersPage(){

    const [users, setUsers] = useState([])

    const {loading, data} = useProfile();

    useEffect(() => {
        fetch('/api/users').then(response => {
            response.json().then(users => {
                setUsers(users)
            })
        })
    }, [])

    if(loading){
        return 'Loading user info'
    }
    if(!data.admin){
        return 'Not an admin'
    }

    return(
        <section className="mt-8 max-w-2xl mx-auto">
            <UserTabs isAdmin={true}></UserTabs>
            <div className="mt-8">
                {users?.length > 0 && users.map(user => (
                    <div key={user._id} className="bg-gray-100 dark:bg-slate-800 rounded-lg mb-2 p-3 sm:p-4 items-center gap-4 flex flex-col sm:flex-row">
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4 grow w-full">
                            <div className="text-gray-900 dark:text-slate-100">
                                {user.name && (
                                    <span className="font-medium">{user.name}</span>
                                )}
                                {!user.name && (
                                    <span className="italic">No name</span>
                                )}
                            </div>
                            <span className="text-gray-500 dark:text-slate-400 text-sm sm:text-base break-all">{user.email}</span>
                        </div>
                        <div className="flex-shrink-0 w-full sm:w-auto">
                            <Link className="button text-sm sm:text-base" href={'/users/'+user._id}>Edit</Link>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}