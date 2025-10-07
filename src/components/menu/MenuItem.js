import { useContext, useState } from "react"
import { CartContext } from "../AppContext"
import toast from "react-hot-toast"
import MenuItemTile from "./MenuItemTile"
import Image from "next/image"

export default function MenuItem(menuItem){  
    const {image, name, description, basePrice, sizes = [], extraIngredientPrices = []} = menuItem  
    const [showPopup, setShowPopup] = useState(false)
    const [selectedSize, setSelectedSize] = useState(sizes?.[0] || null)
    const [selectedExtras, setSelectedExtras] = useState([])
    
    const {addToCart} = useContext(CartContext)
    
    function handleAddToCartButtonClick(){
        const hasOptions = (sizes?.length || 0) > 0 || (extraIngredientPrices?.length || 0) > 0
        if(hasOptions && !showPopup){
            setShowPopup(true)
            return
        }
        addToCart(menuItem, selectedSize, selectedExtras)
        toast.success('Added to cart!')
        setShowPopup(false)
    }

    function handleExtraThingClick(ev, extraThing){
        const checked = ev.target.checked
        if(checked){
            setSelectedExtras(prev => [...prev, extraThing])
        }
        else{
            setSelectedExtras(prev => {
                return prev.filter(e => e.name !== extraThing.name)
            })
        }
    }

    let selectedPrice = basePrice
    if(selectedSize){
        selectedPrice += selectedSize.price
    }
    if(selectedExtras?.length > 0){
        for(const extra of selectedExtras){
            selectedPrice += extra.price
        }
    }

    return(
        <>
            {showPopup && (
                <div 
                    onClick={() => setShowPopup(false)}
                    className="fixed inset-0 bg-black/80 flex items-center justify-center">
                    <div
                        onClick={ev => ev.stopPropagation()}
                        className="bg-white p-2 rounded-lg max-w-md  my-8">
                        <div className="overflow-y-scroll p-2" style={{maxHeight:'calc(100vh - 100px'}}>
                            <Image src={image} alt={name} width={300} height={200} className="mx-auto"></Image>
                            <h2 className="text-lg font-bold text-center mb-2">{name}</h2>
                            <p className="text-center text-gray-500 text-sm mb-2">{description}</p>
                            {sizes?.length > 0 && (
                                <div className="py-2">
                                    <h3 className="text-center text-gray-700">Pick Your size</h3>
                                    {sizes.map((size, index) => (
                                        <label key={index} className="flex items-center gap-2 p-4 rounded-md mb-1 border cursor-pointer hover:bg-gray-50">
                                            <input 
                                                type="radio"
                                                onChange={() => setSelectedSize(size)} 
                                                checked={selectedSize?.name === size.name}
                                                name="size"
                                                className="mr-2"
                                            />
                                            <span className="flex-1">
                                                {size.name} ${basePrice + size.price}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                            {extraIngredientPrices?.length > 0 && (
                                <div className="py-2">
                                    <h3 className="text-center text-gray-700">Any extras?</h3>
                                    {extraIngredientPrices.map((extraThing, index) => (
                                        <label key={index} className="flex items-center gap-2 p-4 rounded-md mb-1 border cursor-pointer hover:bg-gray-50">
                                            <input 
                                                type="checkbox" 
                                                onChange={ev => handleExtraThingClick(ev, extraThing)}
                                                name={extraThing.name}
                                                className="mr-2"
                                            />
                                            <span className="flex-1">
                                                {extraThing.name} +${extraThing.price}
                                            </span>
                                        </label>
                                    ))}
                                </div>
                            )}
                            <button 
                                className="bg-primary text-white rounded-full px-8 py-2 sticky bottom-2 w-full" 
                                onClick={handleAddToCartButtonClick}
                                type="button">
                                Add to cart ${selectedPrice}
                            </button>
                            <button 
                                className="mt-2 bg-gray-200 text-gray-800 rounded-full px-8 py-2 w-full" 
                                onClick={() => setShowPopup(false)}>
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <MenuItemTile onAddToCart={handleAddToCartButtonClick} {...menuItem}></MenuItemTile>
        </>
    )
}