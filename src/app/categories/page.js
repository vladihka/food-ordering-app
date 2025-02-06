'use client'
import UserTabs from "@/components/layout/UserTabs";
import { useProfile } from "@/components/UseProfile";
import { set } from "mongoose";
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

    return(
        <section className="mt-8 max-w-md mx-auto">
            <UserTabs isAdmin={true}></UserTabs>
            <form className="mt-8" onSubmit={handleCategorySubmit}>
                <div className="flex gap-2 items-end">
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
                    <div className="pb-2">
                        <button type="submit" className="border border-primary">
                            {editedCategory ? 'Update' : 'Create'}
                        </button>
                    </div>
                </div>
            </form>
            <div>
                <h2 className="mt-8 text-sm text-gray-500">Edit category:</h2>
                {categories?.length > 0 && categories.map(c => (
                    <button 
                        className="bg-gray-200 rounded-xl p-2 px-4 flex gap-1 cursor-pointer mb-1" 
                        onClick={() => {
                            setEditedCategory(c);
                            setCategoryName(c.name);
                        }}
                        key={c._id}>
                        <span>{c.name}</span>
                    </button>
                ))}
            </div>
        </section>
    )
}