'use client'
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function UserTabs({isAdmin}){
    const path = usePathname();
    return(
       <div className="flex justify-center gap-2 tabs">
            <Link className={path === '/profile' ? 'active' : ''} href="/profile">Profile</Link>
            {isAdmin && (
                <>
                    <Link 
                        className={path === '/categories' ? 'active' : ''}
                        href="/categories">
                        Categories
                    </Link>
                    <Link 
                        className={path === '/menu-items' ? 'active' : ''}
                        href="/menu-items">
                        Menu Items
                    </Link>
                    <Link 
                        href="/users"
                        className={path === '/users' ? 'active' : ''}>
                        Users
                    </Link>
                </>
            )}
        </div> 
    )
}