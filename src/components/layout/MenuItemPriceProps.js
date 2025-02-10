import Plus from "../icons/Plus";
import Trash from "../icons/Trash";
import ChevronUp from "../icons/ChevronDown";
import ChevronDown from "../icons/ChevronDown";
import { useState } from "react";

export default function MenuItemPriceProps({name, addLabel, props, setProps}) {

    const [isOpen, setIsOpen] = useState(false);

    function addProp(){
        setProps(oldProps => {
            return [...oldProps, {name: '', price: 0}]
        })
    }

    function editProp(ev, index, prop){
        const newValue = ev.target.value;
        setProps(prevSizes => {
            const newSizes = [...prevSizes];
            newSizes[index][prop] = newValue;
            return newSizes
        })
    }

    function removeProps(indexToRemove){
        setProps(prev => prev.filter((v,index) => index !== indexToRemove))
    }

    return(
        <div className="bg-gray-200 p-2 rounded-md mb-2">
            <button 
                onClick={() => setIsOpen(!isOpen)}
                type="button" 
                className="inline-flex p-1 border-0 justify-start">
                {isOpen && (
                    <ChevronUp></ChevronUp>
                )}
                {!isOpen && (
                    <ChevronDown></ChevronDown>
                )}
                <span>{name}</span>
                <span>({props?.length})</span>
        </button>
        <div className={isOpen ? 'block' : 'hidden'}>
            {props?.length > 0 && props.map((size, index) => (
                <div key={index} className="flex items-end gap-2">
                    <div>
                        <label>Name</label>
                        <input 
                            type="text" 
                            placeholder="Size name" 
                            value={size.name}
                            onChange={ev => editProp(ev, index, 'name')}
                        ></input>
                    </div>
                    <div>
                        <label>Extra price</label>
                        <input 
                            type="text" 
                            placeholder="Extra price" 
                            value={size.price}
                            onChange={ev => editProp(ev, index, 'price')}
                        ></input>
                    </div>
                        <div>
                            <button 
                                onClick={() => removeProps(index)} 
                                type="button" 
                                className="bg-white mb-2 px-2">
                                <Trash></Trash>
                            </button>
                        </div>
                    </div>
                ))}
                <button onClick={addProp} type="button" className="bg-white items-center">
                    <Plus></Plus>
                    <span>{addLabel}</span>
                </button>
            </div>
        </div>
    )
}