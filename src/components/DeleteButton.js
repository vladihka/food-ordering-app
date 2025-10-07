import { useState } from "react"

export default function DeleteButton({label, onDelete}){
    
    const [showConfirm, setShowConfirm] = useState(false)

    if(showConfirm){
        return(
            <div className="fixed bg-black/80 items-center h-full inset-0 flex justify-center">
                <div className=" bg-white dark:bg-slate-800 p-4 rounded-lg">
                    <h4 className="dark:text-slate-100">Are you sure you want to delete?</h4>
                    <div className="flex gap-2 mt-1">
                        <button 
                            type="button" 
                            onClick={() => setShowConfirm(false)}>
                            Cancel
                        </button>
                        <button 
                            type="button" 
                            className="primary"
                            onClick={() => {onDelete(); setShowConfirm(false)}}>
                            Yes,&nbsp;delete!
                        </button>
                    </div>
                </div>
            </div>

        )
    }

    return(
        <button type="button" onClick={() => setShowConfirm(true)}>
            {label}
        </button>
    )
}