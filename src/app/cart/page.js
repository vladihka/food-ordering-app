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
            <div className="grid mt-8 grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    {cartProducts?.length === 0 && (
                        <div className="text-gray-500 dark:text-slate-400">No products in your shopping cart</div>
                    )}
                    {cartProducts?.length > 0 && cartProducts.map((product, index) => (
                        <div className="flex gap-3 sm:gap-4 mb-2 border-b py-2 items-center dark:border-slate-700" key={product._id}>
                            <div className="w-16 sm:w-20 md:w-24 flex-shrink-0">
                                <Image width={240} height={240} alt="icon" src={product.image} className="w-full h-auto"></Image>
                            </div>
                            <div className="grow min-w-0">
                                <h3 className="font-semibold dark:text-slate-100">
                                    {product.name}
                                </h3>
                                {product.size && (
                                    <div className="text-sm dark:text-slate-300">Size: <span>{product.size.name}</span></div>
                                )}
                                {product.extras?.length > 0 && (
                                    <div className="text-sm text-gray-500 dark:text-slate-400">
                                        {product.extras.map(extra => (
                                            <div>{extra.name} ${extra.price}</div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="text-lg font-semibold dark:text-slate-100 flex-shrink-0">
                                ${cartProductPrice(product)}
                            </div>
                            <div className="ml-2 flex-shrink-0">
                                <button 
                                    type="button"
                                    onClick={() => removeCartProduct(index)}
                                    className="p-2 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg transition-colors">
                                    <Trash></Trash>
                                </button>
                            </div>
                        </div>
                    ))}
                    <div className="py-4 text-right pr-4 sm:pr-16">
                        <span className="text-gray-500 dark:text-slate-400">
                            Subtotal:
                        </span>
                        <span className="text-lg font-semibold pl-2 dark:text-slate-100">
                            ${total}
                        </span>
                    </div>
                </div>
                <div className="bg-gray-100 dark:bg-slate-800 p-4 rounded-lg">
                    <h2 className="dark:text-slate-100">Checkout</h2>
                    <form onSubmit={handleCheckout}>
                        <AddressInputs adressProps={address} setAddressProp={handleAddressChange}></AddressInputs>
                        <button type="submit" className="bg-primary text-white px-8 py-2 rounded-full hover:bg-primary/90 transition-colors">Pay ${total}</button>
                    </form>
                </div>
            </div>
        </section>
    )
}