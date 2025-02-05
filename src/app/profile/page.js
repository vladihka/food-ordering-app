'use client'
import { useSession } from "next-auth/react"
import Image from "next/image"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import toast from "react-hot-toast"

export default function ProfilePage(){

    const session = useSession()
    const {status} = session
    const [image, setImage] = useState('')
    const [userName, setUserName] = useState('')

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
        const savingPromise = new Promise(async(resolve, reject) => {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({name:userName, image}),
            })
            if(response.ok){
                resolve()
            }
            else{
                reject()
            }
        })

        await toast.promise(savingPromise, {
            loading: 'Saving...',
            success: 'Saved',
            error: 'Failed to save',
        })
    }

    async function handleFileChange(ev){
        const files = ev.target.files;
        if(files?.length === 1){
            const data = new FormData;
            data.set('file', files[0]);
            
            const uploadPromise = fetch('/api/upload',{
                method: 'POST',
                body: data,
            }).then(response => {
                if(response.ok){
                    return response.json().then(link => {
                        setImage(link)
                    })
                }
                throw new Error('Failed to upload')
            })
            await toast.promise(uploadPromise, {
                loading: 'Uploading...',
                success: 'Uploaded',
                error: 'Failed to upload',
            })
        }
    }

    return(
        <section className="mt-8">
            <h1 className="text-center text-primary text-4xl mb-4">Profile</h1>
            <div className="max-w-md mx-auto">
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