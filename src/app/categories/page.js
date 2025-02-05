'use client'
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import { useEffect, useState } from "react";

export default function CategoriesPage() {

    const {loading:profileLoading, data:profileData} = useProfile();

    if(profileLoading){
        return 'Loading user info...'
    }

    if(!profileData.admin){
        return 'Not an admin'
    }

    return(
        <section className="mt-8 max-w-md mx-auto">
            <UserTabs isAdmin={true}></UserTabs>
            <form className="mt-8">
                <label>New category name</label>
                <input type="text"></input>
            </form>
        </section>
    )
}