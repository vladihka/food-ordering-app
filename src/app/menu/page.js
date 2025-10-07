'use client'
import SectionHeaders from "@/components/layout/SectionHeaders"
import MenuItem from "@/components/menu/MenuItem"
import Image from "next/image"
import { useEffect, useState } from "react"

export default function MenuPAge(){
    
    const [categories, setCategories] = useState([])
    const [menuItems, setMenuItems] = useState([])

    useEffect(() => {
        fetch('/api/categories').then(res => {
            res.json().then(categories => {
                setCategories(categories)
            })
        })
    }, [])

        useEffect(() => {
        fetch('/api/menu-items').then(res => {
            res.json().then(menuItems => {
                setMenuItems(menuItems)
            })
        })
    }, [])
    
    return (
        <section className="mt-8">
            {categories?.length > 0 && categories.map(c => (
                <div key={c._id} className="mb-8">
                    <div className="text-center">
                        <SectionHeaders mainHeader={c.name}></SectionHeaders>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 mb-12">
                        {menuItems.filter(m => m.category === c._id).map(item => (
                            <MenuItem key={item._id} {...item}></MenuItem>
                        ))}
                    </div>
                </div>
            ))}
        </section>
    )
}