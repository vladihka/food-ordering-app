'use client'
import { useSession } from "next-auth/react"
import { redirect } from "next/navigation"
import { useEffect, useState } from "react"
import UserTabs from "@/components/layout/UserTabs"
import SectionHeaders from "@/components/layout/SectionHeaders"
import Image from "next/image"

export default function OrdersPage() {
    const session = useSession()
    const { status } = session
    const [orders, setOrders] = useState([])
    const [isAdmin, setIsAdmin] = useState(false)
    const [profileFetched, setProfileFetched] = useState(false)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (status === 'authenticated') {
            fetch('/api/profile').then(response => {
                response.json().then(data => {
                    setIsAdmin(data.admin)
                    setProfileFetched(true)
                })
            })
        }
    }, [session, status])

    useEffect(() => {
        if (isAdmin) {
            fetchOrders()
        }
    }, [isAdmin])

    function fetchOrders() {
        fetch('/api/orders').then(response => {
            response.json().then(orders => {
                setOrders(orders)
            })
        })
    }

    async function markAsCompleted(orderId) {
        setLoading(true)
        try {
            await fetch('/api/orders', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ _id: orderId, completed: true })
            })
            fetchOrders() // Refresh orders
        } catch (error) {
            console.error('Error updating order:', error)
        } finally {
            setLoading(false)
        }
    }

    if (status === 'loading' || !profileFetched) {
        return 'Loading...'
    }

    if (status === 'unauthenticated') {
        redirect('/login')
    }

    if (!isAdmin) {
        redirect('/profile')
    }

    return (
        <section className="mt-8">
            <UserTabs isAdmin={isAdmin} />
            <div className="text-center mt-8">
                <SectionHeaders mainHeader="Orders" />
            </div>
            
            <div className="mt-8">
                {orders?.length === 0 && (
                    <div className="text-center text-gray-500">
                        No orders found
                    </div>
                )}
                
                {orders?.length > 0 && (
                    <div className="grid gap-4">
                        {orders.map(order => (
                            <div key={order._id} className="bg-gray-100 p-4 rounded-lg">
                                <div className="flex items-center justify-between mb-4">
                                    <div>
                                        <div className="text-sm text-gray-500">
                                            Order #{order._id.slice(-6)}
                                        </div>
                                        <div className="text-lg font-semibold">
                                            ${order.subtotal}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="flex gap-2 mb-2">
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                order.paid 
                                                    ? 'bg-green-100 text-green-800' 
                                                    : 'bg-red-100 text-red-800'
                                            }`}>
                                                {order.paid ? 'Paid' : 'Unpaid'}
                                            </div>
                                            <div className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                order.completed 
                                                    ? 'bg-blue-100 text-blue-800' 
                                                    : 'bg-yellow-100 text-yellow-800'
                                            }`}>
                                                {order.completed ? 'Completed' : 'In Progress'}
                                            </div>
                                        </div>
                                        <div className="text-sm text-gray-500">
                                            {new Date(order.createdAt).toLocaleDateString()}
                                        </div>
                                        {order.paid && !order.completed && (
                                            <button 
                                                onClick={() => markAsCompleted(order._id)}
                                                disabled={loading}
                                                className="mt-2 bg-primary text-white px-3 py-1 rounded text-sm hover:bg-primary/80 disabled:opacity-50"
                                            >
                                                Mark as Completed
                                            </button>
                                        )}
                                    </div>
                                </div>

                                <div className="grid gap-2 mb-4">
                                    {order.items.map((item, index) => (
                                        <div key={index} className="flex items-center gap-3 bg-white p-2 rounded">
                                            <div className="w-12 h-12 relative">
                                                <Image 
                                                    src={item.image} 
                                                    alt={item.name}
                                                    fill
                                                    className="object-cover rounded"
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium">{item.name}</div>
                                                <div className="text-sm text-gray-500">
                                                    ${item.basePrice}
                                                    {item.size && (
                                                        <span> + {item.size.name} (${item.size.price})</span>
                                                    )}
                                                    {item.extras?.length > 0 && (
                                                        <span> + {item.extras.map(extra => extra.name).join(', ')}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {order.userEmail && (
                                    <div className="text-sm text-gray-600 mb-2">
                                        Customer: {order.userEmail}
                                    </div>
                                )}

                                {(order.streetAddress || order.phone) && (
                                    <div className="text-sm text-gray-600">
                                        {order.phone && <div>Phone: {order.phone}</div>}
                                        {order.streetAddress && (
                                            <div>
                                                Address: {order.streetAddress}, {order.city} {order.postalCode}, {order.country}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </section>
    )
}
