export default function AddressInputs({adressProps, setAddressProp}){

    const {phone, streetAddress, postalCode, city, country} = adressProps

    return(
        <>
            <label>Phone</label>
                <input 
                    type="tel" 
                    value={phone}
                    onChange={ev => setAddressProp('phone',ev.target.value)}
                    placeholder="Phone number"
                ></input>
                <label>Street address</label>
                <input 
                    type="text" 
                    value={streetAddress}
                    onChange={ev => setAddressProp('streetAddress',ev.target.value)}
                    placeholder="Street address"
                ></input>
                <div className="grid grid-cols-2 gap-2">
                    <div>
                        <label>Postal code</label>
                        <input 
                            type="text" 
                            value={postalCode}
                            onChange={ev => setAddressProp('postalCode',ev.target.value)}
                            placeholder="Postal code"
                        ></input>
                    </div>
                    <div>
                        <label>City</label>
                        <input 
                            type="text" 
                            value={city}
                            onChange={ev => setAddressProp('city',ev.target.value)}
                            placeholder="City"
                        ></input>
                    </div>
                </div>
                <label>Country</label>
                <input 
                    type="text" 
                    value={country}
                    onChange={ev => setAddressProp('country', ev.target.value)}
                    placeholder="Country"
                ></input>
        </>
    )
}