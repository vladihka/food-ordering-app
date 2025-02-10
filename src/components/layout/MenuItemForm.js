import { useEffect, useState } from "react";
import EditableImage from "./EditableImage";
import MenuItemPriceProps from "@/components/layout/MenuItemPriceProps";

export default function MenuItemForm({onSubmit, menuItem}){
    
    const [image, setImage] = useState(menuItem?.image || '');
    const [name, setName] = useState(menuItem?.name || '');
    const [description, setDescription] = useState(menuItem?.description || '');
    const [basePrice, setBasePrice] = useState(menuItem?.basePrice || '');
    const [sizes, setSizes] = useState(menuItem?.sizes || []);
    const [extraIngredientsPrices, setExtraIngredientsPrices] = useState(menuItem?.extraIngredientsPrices || []);
    const [categories, setCategories] = useState([])
    const [category, setCategory] = useState(menuItem?.category || '')

    useEffect(() => {
        fetch('/api/categories').then(res => {
            res.json().then(categories => {
                setCategories(categories)
            })
        })
    }, [])

    return(
        <form className="mt-8 max-w-2xl mx-auto" 
            onSubmit={ev => 
                onSubmit(ev, {
                    image, name, description, basePrice, sizes, extraIngredientsPrices, category
                })
            }>
                <div 
                    className="grid items-start gap-2" 
                    style={{gridTemplateColumns: '.3fr .7fr'}}>
                    <div>
                        <EditableImage link={image} setLink={setImage}></EditableImage>
                    </div>
                    <div className="grow">
                        <label>Item name</label>
                        <input 
                            type="text" 
                            value={name} 
                            onChange={ev => setName(ev.target.value)}>
                        </input>
                        <label>Description</label>
                        <input 
                            type="text" 
                            value={description} 
                            onChange={ev => setDescription(ev.target.value)}>
                        </input>
                        <label>Category</label>
                        <select value={category} onChange={ev => setCategory(ev.target.value)}>
                            {categories?.length > 0 && categories.map(c => (
                                <option key={c._id} value={c._id}>{c.name}</option>
                            ))}
                        </select>
                        <label>Base Price</label>
                        <input 
                            type="text" 
                            value={basePrice} 
                            onChange={ev => setBasePrice(ev.target.value)}>
                        </input>
                        <MenuItemPriceProps 
                            name={'Sizes'} 
                            addLabel={'Add item size'} 
                            props={sizes} 
                            setProps={setSizes}>
                        </MenuItemPriceProps>
                        <MenuItemPriceProps
                            name={'Extra ingredients'} 
                            addLabel={'Add ingredients prices'} 
                            props={extraIngredientsPrices} 
                            setProps={setExtraIngredientsPrices}>
                        </MenuItemPriceProps>
                        <button type="submit">Save</button>
                    </div>
                    <div> 
                    </div>
                </div>
            </form>
    )
}