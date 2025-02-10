'use client'

import { useState } from "react"
import EditableImage from "./EditableImage"

export default function UserForm({user, onSave}){

    const [userName, setUserName] = useState(user?.name || '')
    const [image, setImage] = useState(user?.image || '')
    const [phone, setPhone] = useState(user?.phone || '')
    const [streetAddress, setStreetAddress] = useState(user?.streetAddress || '')
    const [postalCode, setPostalCode] = useState(user?.postalCode || '')
    const [city, setCity] = useState(user?.city || '')
    const [country, setCountry] = useState(user?.country || '')

    return(
        <div className="flex gap-4">
            <div>
                <div className="p-2 max-w-[120px] rounded-lg relative">
                    <EditableImage link={image} setLink={setImage}></EditableImage>
                </div>
            </div>
            <form 
                className="grow" 
                onSubmit={ev => onSave(ev, {
                    user:userName, image, phone, streetAddress, city, postalCode
                })}
            >
                <label>
                    First and last name
                </label>
                <input 
                    type="text" 
                    placeholder="First and last name"
                    value={userName}
                    onChange={ev => setUserName(ev.target.value)}></input>
                <label>Email</label>
                <input 
                    type="email" 
                    disabled={true} 
                    value={user.email}
                    placeholder="email"
                ></input>
                <label>Phone</label>
                <input 
                    type="tel" 
                    value={phone}
                    onChange={ev => setPhone(ev.target.value)}
                    placeholder="Phone number"
                ></input>
                <label>Street address</label>
                <input 
                    type="text" 
                    value={streetAddress}
                    onChange={ev => setStreetAddress(ev.target.value)}
                    placeholder="Street address"
                ></input>
                <div className="flex gap-2">
                    <div>
                        <label>Postal code</label>
                        <input 
                            type="text" 
                            value={postalCode}
                            onChange={ev => setPostalCode(ev.target.value)}
                            placeholder="Postal code"
                        ></input>
                    </div>
                    <div>
                        <label>City</label>
                        <input 
                            type="text" 
                            value={city}
                            onChange={ev => setCity(ev.target.value)}
                            placeholder="City"
                        ></input>
                    </div>
                </div>
                <label>Country</label>
                <input 
                    type="text" 
                    value={country}
                    onChange={ev => setCountry(ev.target.value)}
                    placeholder="Country"
                ></input>
                <button type="submit">Save</button>
            </form>
        </div>
    )
}