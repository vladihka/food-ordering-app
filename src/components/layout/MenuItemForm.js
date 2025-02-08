import { useState } from "react";
import EditableImage from "./EditableImage";
import MenuItemPriceProps from "@/components/layout/MenuItemPriceProps";

export default function MenuItemForm({onSubmit, menuItem}){
    
    const [image, setImage] = useState(menuItem?.image || '');
    const [name, setName] = useState(menuItem?.name || '');
    const [description, setDescription] = useState(menuItem?.description || '');
    const [basePrice, setBasePrice] = useState(menuItem?.basePrice || '');
    const [sizes, setSizes] = useState([]);
    

    return(
        <form className="mt-8 max-w-md mx-auto" 
            onSubmit={ev => onSubmit(ev, {image, name, description, basePrice})}
            >
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
                        <label>Base Price</label>
                        <input 
                            type="text" 
                            value={basePrice} 
                            onChange={ev => setBasePrice(ev.target.value)}>
                        </input>
                        <MenuItemPriceProps props={sizes} setProps={setSizes}></MenuItemPriceProps>
                        <button type="submit">Save</button>
                    </div>
                    <div> 
                    </div>
                </div>
            </form>
    )
}