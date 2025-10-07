export default function MenuItemTile({onAddToCart, ...item}){
    const {image, description, name, basePrice, sizes, extraIngredientPrices} = item
    return(
        <div className="bg-gray-200 dark:bg-slate-800 p-3 sm:p-4 rounded-lg text-center hover:bg-white dark:hover:bg-slate-700 transition-all hover:shadow-md hover:shadow-black/25 h-full flex flex-col">
            <div className="text-center flex-shrink-0">
                <img src={image} alt="pizza" className="max-h-20 sm:max-h-24 block mx-auto max-w-auto w-full h-auto object-contain"></img>
            </div>
            <h4 className="font-semibold my-2 sm:my-3 text-lg sm:text-xl dark:text-slate-100 flex-shrink-0">{name}</h4>
            <p className="text-gray-500 dark:text-slate-400 text-xs sm:text-sm line-clamp-3 flex-grow">{description}</p>
            <button 
                type="button"
                onClick={onAddToCart}
                className="mt-4 bg-primary text-white rounded-full px-6 sm:px-8 py-2 hover:bg-primary/90 transition-colors text-sm sm:text-base flex-shrink-0">
                {(sizes?.length > 0 || extraIngredientPrices?.length > 0) ? (
                    <span>Add to cart (from ${basePrice})</span>
                ) : (
                    <span>Add to cart ${basePrice}</span>
                )}
                </button>
        </div>
    )
}