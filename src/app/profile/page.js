'use client'
import { useSession } from "next-auth/react"
import Image from "next/image"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProfilePage(){

    const session = useSession()
    const {status} = session
    const userImage = session?.data?.user?.image
    const [userName, setUserName] = useState('')
    const [saved, setSaved] = useState(false)
    const [isSaving, setIsSaving] = useState(false)


    useEffect(() => {
        if(status === 'authenticated'){
            setUserName(session.data.user.name)
        }
    }, [session, status])

    if(status === 'loading'){
        return 'Loading...'
    }

    if(status === 'unauthenticated'){
        redirect('/login')
    }

    async function handleProfileInfoUpdate(ev){
        ev.preventDefault()
        setSaved(false)
        setIsSaving(true)
        const response = await fetch('/api/profile', {
            method: 'PUT',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({name:userName}),
        })
        setIsSaving(false)
        if(response.ok){
            setSaved(true)
        }
    }

    function handleFileChange(ev){
        console.log(ev);
    }

    return(
        <section className="mt-8">
            <h1 className="text-center text-primary text-4xl mb-4">Profile</h1>
            <div className="max-w-md mx-auto">
                {saved && (
                    <h2 className="text-center bg-green-100 rounded-lg border border-green-300 p-4">Profile saved!</h2>
                )}
                {isSaving && (
                    <h2 className="text-center bg-blue-100 rounded-lg border border-blue-300 p-4">Saving...</h2>
                )}
                <div className="flex gap-4 items-center">
                    <div>
                        <div className="p-2 rounded-lg relative">
                            <Image className="rounded-lg w-full h-full mb-1" src={userImage} width={250} height={250} alt="avatar"></Image>
                            <label>
                                <input type="file" className="hidden" onChange={handleFileChange}></input>
                                <span className="border rounded-lg p-2 text-center border-gray-300 cursor-pointer block">Edit</span>
                            </label>
                        </div>
                    </div>
                    <form className="grow" onSubmit={handleProfileInfoUpdate}>
                        <input 
                            type="text" 
                            placeholder="First and last name"
                            value={userName}
                            onChange={ev => setUserName(ev.target.value)}></input>
                        <input type="email" disabled={true} value={session.data.user.email}></input>
                        <button type="submit">Save</button>
                    </form>
                </div>
            </div>
        </section>
    )
}