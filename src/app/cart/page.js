'use client'
import { CartContext, cartProductPrice } from "../../components/AppContext";
import SectionHeaders from "@/components/layout/SectionHeaders";
import Image from "next/image";
import { useContext, useEffect, useState } from "react";
import Trash from "@/components/icons/Trash"
import AddressInputs from "@/components/layout/AddressInputs";
import { useProfile } from "@/components/UseProfile";
import { useSearchParams } from "next/navigation";
import SuccessBox from "@/components/layout/SuccessBox";

export default function CartPage(){

    const {cartProducts, removeCartProduct, clearCart} = useContext(CartContext)
    const [address, setAddress] = useState({
        phone: '',
        streetAddress: '',
        postalCode: '',
        city: '',
        country: ''
    })
    const {data:profileData} = useProfile()
    const searchParams = useSearchParams()
    const success = searchParams.get('success')

    let total = 0

    useEffect(() => {
        if(profileData?.city){
            const {phone, streetAddress, city, postalCode, country} = profileData
            const addressFromProfile = {
                phone, 
                streetAddress, 
                city, 
                postalCode, 
                country}
            setAddress(addressFromProfile)
        }
    }, [profileData])

    // Clear cart after successful payment
    useEffect(() => {
        if (success === '1') {
            clearCart()
        }
    }, [success, clearCart])

    for (const p of cartProducts){
        total += cartProductPrice(p)
    }
    
    function handleAddressChange(propName, value){
        setAddress(prevAddress => ({...prevAddress, [propName]:value}))
    }

    async function handleCheckout(ev){
        ev.preventDefault();
        const res = await fetch('/api/checkout', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ items: cartProducts, address, userEmail: profileData?.email }),
        });
        const data = await res.json();
        if(data?.url){
            // do not clear cart before redirect in case of back
            window.location = data.url;
        }
    }

    return(
        <section className="mt-8">
            <div className="text-center">
                <SectionHeaders mainHeader="Cart"></SectionHeaders>
            </div>
            {success === '1' && (
                <div className="mt-4">
                    <SuccessBox>
                        <h2 className="text-lg font-semibold">Payment successful!</h2>
                        <p>Your order has been placed and your cart has been cleared.</p>
                    </SuccessBox>
                </div>
            )}
            <div className="grid mt-8 grid-cols-2 gap-8">
                <div>
                    {cartProducts?.length === 0 && (
                        <div>No products in your shopping cart</div>
                    )}
                    {cartProducts?.length > 0 && cartProducts.map((product, index) => (
                        <div className="flex gap-4 mb-2 border-b py-2 items-center" key={product._id}>
                            <div className="w-24">
                                <Image width={240} height={240} alt="icon" src={product.image}></Image>
                            </div>
                            <div className="grow">
                                <h3 className="font-semibold">
                                    {product.name}
                                </h3>
                                {product.size && (
                                    <div className="text-sm">Size: <span>{product.size.name}</span></div>
                                )}
                                {product.extras?.length > 0 && (
                                    <div className="text-sm text-gray-500">
                                        {product.extras.map(extra => (
                                            <div>{extra.name} ${extra.price}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="text-lg font-semibold">
                                ${cartProductPrice(product)}
                            </div>
                            <div className="ml-2">
                                <button 
                                    type="button"
                                    onClick={() => removeCartProduct(index)}
                                    className="p-2">
                                    <Trash></Trash>
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="py-4 text-right pr-16">
                        <span className="text-gray-500">
                            Subtotal:
                        </span>
                        <span className="text-lg font-semibold pl-2">
                            ${total}
                        </span>
                    </div>
                </div>
                <div className="bg-gray-100 p-4 rounded-lg">
                    <h2>Checkout</h2>
                    <form onSubmit={handleCheckout}>
                        <AddressInputs adressProps={address} setAddressProp={handleAddressChange}></AddressInputs>
                        <button type="submit">Pay ${total}</button>
                    </form>
                </div>
            </div>
        </section>
    )
}