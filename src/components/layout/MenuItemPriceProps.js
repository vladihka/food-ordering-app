import Plus from "../icons/Plus";
import Trash from "../icons/Trash";

export default function MenuItemPriceProps({props, setProps}) {

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
            <label>Sizes</label>
            {props?.length > 0 && props.map((size, index) => (
                <div key={index} className="flex items-end gap-2">
                    <div>
                        <label>Size name</label>
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
                Add item size
            </button>
        </div>
    )
}