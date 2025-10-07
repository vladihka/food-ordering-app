'use client'
import Image from "next/image";
import MenuItem from "../menu/MenuItem";
import SectionHeaders from "./SectionHeaders";
import { useEffect, useState } from "react";

export default function HomeMenu(){

    const [bestSellers, setBestSellers] = useState([])

    useEffect(() => {
        fetch('/api/menu-items').then(res => {
            res.json().then(menuItems => {
                setBestSellers(menuItems.slice(-3))
            })
        })
    }, [])

    return (
        <section className="">
            <div className="absolute left-0 right-0  w-full">
                <div className="absolute left-0 -top-[70px] text-left -z-10">
                    <Image src={'/sallad1.png'} width={109} height={189} alt="sallad"></Image>
                </div>
                <div className="absolute -top-[200px] -z-10 right-0">
                    <Image src={'/sallad2.png'} width={107} height={195} alt="sallad"></Image>
                </div>
            </div>
            <SectionHeaders subHeader={'check out'} mainHeader={'Our Best Sellers'}></SectionHeaders>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
                {bestSellers?.length > 0 && bestSellers.map(item => (
                    <MenuItem key={item._id} {...item}></MenuItem>
                ))}
            </div>
        </section>
    )
}