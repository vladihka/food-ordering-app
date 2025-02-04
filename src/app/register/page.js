"use client"
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function RegisterPage(){
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [creatingUser, setCreatingUSer] = useState(false)
    const [userCreated, setUserCreated] = useState(false)
    const [error, setError] = useState(false)

    async function handleFormSubmit(ev){
        ev.preventDefault();
        setCreatingUSer(true)
        setError(false)
        setUserCreated(false)
        const response = await fetch('/api/register', {
            method: 'POST',
            body: JSON.stringify({email, password}),
            headers: {'Content-Type': 'application/json'},
        });
        if(response.ok){
            setUserCreated(true)
        }
        else{
            setError(true)
        }
        setCreatingUSer(false);
    }

    return(
        <section className="mt-8">
            <h1 className="text-center text-primary text-4xl mb-4">
                Register
            </h1>
            {userCreated && (
                <div className="my-4 text-center">User created. <br></br> Now you can{' '}
                <Link className="underline" href={'/login'}>Login &raquo;</Link></div>
            )}
            {error && (
                <div className="my-4 text-center">
                    An error has occurred.<br></br>
                    Please try again later.
                </div>
            )}
            <form className="block max-w-xs mx-auto" onSubmit={handleFormSubmit}>
                <input 
                    type="email" 
                    placeholder="email" 
                    disabled={creatingUser}
                    value={email} 
                    onChange={ev=>setEmail(ev.target.value)}>
                </input>
                <input 
                    type="password" 
                    disabled={creatingUser}
                    placeholder="password" 
                    value={password} 
                    onChange={ev=>setPassword(ev.target.value)}>
                </input>
                <button 
                    type="submit"
                    disabled={creatingUser}>
                    Register
                </button>
                <div className="my-4 text-center text-gray-500">
                    or Login with provider
                </div>
                <button className="flex gap-4 justify-center">
                    <Image src={'/google.png'} alt="" width={24} height={24}></Image>
                    Login with google
                </button>
            </form>
        </section>
    )
}