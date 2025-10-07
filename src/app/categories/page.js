'use client'
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import DeleteButton from "@/components/DeleteButton";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

export default function CategoriesPage() {

    const [categoryName, setCategoryName] = useState('');
    const [categories, setCategories] = useState([]);
    const {loading:profileLoading, data:profileData} = useProfile();
    const [editedCategory, setEditedCategory] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, [])

    function fetchCategories(){
        fetch('/api/categories').then(res => {
            res.json().then(categories => {
            setCategories(categories);
            })
        })
    }

    if(profileLoading){
        return 'Loading user info...'
    }

    if(!profileData.admin){
        return 'Not an admin'
    }

    async function handleCategorySubmit(ev){
        ev.preventDefault();
        const creationPromise = new Promise(async(resolve, reject) => {
            const data = {name: categoryName};
            if(editedCategory){
                data._id = editedCategory._id;
            }
            const response = await fetch('/api/categories', {
                method: editedCategory ? 'PUT' : 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data),
            })
            setCategoryName(''); // Clear the input
            setEditedCategory(null); // Clear the edited category
            fetchCategories();
            if(response.ok){
                resolve();
            }
            else{
                reject();
            }
        })
        await toast.promise(creationPromise, {
            loading: editedCategory ? 'Updating category...' : 'Creating your new category...',
            success: editedCategory ? 'Category...' : 'Category created',
            error: 'Failed to create category',
        })
    }

    async function handleDeleteClick(_id){
        const promise = new Promise(async(resolve, reject) => {
            const response = await fetch('/api/categories?_id='+_id, {
                method: 'DELETE',
            })
            if(response.ok){
                resolve();
            }
            else{
                reject();
            }
        })

        toast.promise(promise, {
            loading: 'Deleting category...',
            success: 'Category deleted',
            error: 'Failed to delete category',
        })
        fetchCategories();
    }

    return(
        <section className="mt-8 max-w-2xl mx-auto">
            <UserTabs isAdmin={true}></UserTabs>
            <form className="mt-8" onSubmit={handleCategorySubmit}>
                <div className="flex flex-col sm:flex-row gap-2 sm:items-end">
                    <div className="grow">
                        <label>
                            {editedCategory ? 'Update category' : 'New category name'}
                            {editedCategory && (
                                <>: <b>{editedCategory.name}</b></>
                            )}
                        </label>
                        <input type="text"
                            value={categoryName}
                            onChange={ev => setCategoryName(ev.target.value)}></input>
                    </div>
                    <div className="pb-2 flex flex-col sm:flex-row gap-2">
                        <button type="submit" className="border border-primary">
                            {editedCategory ? 'Update' : 'Create'}
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                setEditedCategory(null)
                                setCategoryName('')
                            }}>
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
            <div>
                <h2 className="mt-8 text-sm text-gray-500 dark:text-slate-400">Existing categories:</h2>
                {categories?.length > 0 && categories.map(c => (
                    <div 
                        className="bg-gray-100 dark:bg-slate-800 rounded-xl p-3 sm:p-4 flex flex-col sm:flex-row gap-2 sm:gap-1 mb-2 sm:mb-1 items-start sm:items-center" 
                        key={c._id}>
                        <div
                            className="grow cursor-pointer dark:text-slate-100 font-medium"
                            >{c.name}
                        </div>
                        <div className="flex gap-1 w-full sm:w-auto">
                            <button 
                                type="button"
                                className="flex-1 sm:flex-none"
                                onClick={() => {
                                    setEditedCategory(c);
                                    setCategoryName(c.name);
                                }}>
                                Edit
                            </button>
                            <DeleteButton
                                label="Delete"
                                onDelete={() => handleDeleteClick(c._id)}>
                            </DeleteButton>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}