'use client'
import { set } from "mongoose"
import { useSession } from "next-auth/react"
import Image from "next/image"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"

export default function ProfilePage(){

    const session = useSession()
    const {status} = session
    const [image, setImage] = useState('')
    const [userName, setUserName] = useState('')
    const [saved, setSaved] = useState(false)
    const [isSaving, setIsSaving] = useState(false)
    const [isUploading, setIsUploading] = useState(false)

    useEffect(() => {
        if(status === 'authenticated'){
            setUserName(session.data.user.name)
            setImage(session.data.user.image)
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
            body: JSON.stringify({name:userName, image}),
        })
        setIsSaving(false)
        if(response.ok){
            setSaved(true)
        }
    }

    async function handleFileChange(ev){
        const files = ev.target.files;
        if(files?.length === 1){
            const data = new FormData;
            data.set('file', files[0]);
            setIsUploading(true)
            const response = await fetch('/api/upload',{
                method: 'POST',
                body: data,
            })
            const link = await response.json()
            setImage(link)
            setIsUploading(false)
        }
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
                {isUploading && (
                    <h2 className="text-center bg-blue-100 rounded-lg border border-blue-300 p-4">Uploading...</h2>
                )}
                <div className="flex gap-4 items-center">
                    <div>
                        <div className="p-2 max-w-[120px] rounded-lg relative">
                            {image && (
                                <Image className="rounded-lg w-full h-full mb-1" src={image} width={250} height={250} alt="avatar"></Image>
                            )}
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