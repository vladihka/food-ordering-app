'use client'

import { useState } from "react"
import EditableImage from "./EditableImage"
import { useProfile } from "../UseProfile"
import AddressInputs from "./AddressInputs"

export default function UserForm({user, onSave}){

    const [userName, setUserName] = useState(user?.name || '')
    const [image, setImage] = useState(user?.image || '')
    const [phone, setPhone] = useState(user?.phone || '')
    const [streetAddress, setStreetAddress] = useState(user?.streetAddress || '')
    const [postalCode, setPostalCode] = useState(user?.postalCode || '')
    const [city, setCity] = useState(user?.city || '')
    const [country, setCountry] = useState(user?.country || '')
    const [admin, setAdmin] = useState(user?.admin || false)
    const {data:loggedInUserData} = useProfile()

    function handleAddressChange(propName, value){
        if(propName === 'phone') setPhone(value)
        if(propName === 'streetAddress') setStreetAddress(value)
        if(propName === 'postalCode') setPostalCode(value)
        if(propName === 'city') setCity(value)
        if(propName === 'country') setCountry(value)
    }

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
                    name:userName, image, phone, streetAddress, city, postalCode, admin, country
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
                <AddressInputs 
                    adressProps={{phone, streetAddress, postalCode, city, country}}
                    setAddressProp={handleAddressChange}>
                </AddressInputs>
                {loggedInUserData.admin && (
                    <div>
                        <label className="p-2 inline-flex items-center gap-2 mb-2" htmlFor="adminCb">
                            <input 
                            value={'1'} 
                            checked={admin} 
                            onChange={()=>{}}
                            onClick={ev => setAdmin(ev.target.checked)} 
                            id="adminCb" 
                            className="" 
                            type="checkbox"></input>
                            <span>Admin</span>
                        </label>
                    </div>
                )}
                <button type="submit">Save</button>
            </form>
        </div>
    )
}