'use client'
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { useContext, useState } from "react"
import { CartContext } from "../AppContext"
import { useTheme } from "../ThemeContext"
import ShoppingCart from "@/components/icons/ShoppingCart"

export default function Header(){
  const session = useSession()
  console.log(session)
  const status = session.status;
  const userData = session.data?.user;
  let userName = userData?.name || userData?.email;
  const {cartProducts, clearCart} = useContext(CartContext)
  const {isDarkMode, toggleTheme} = useTheme()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  
  if(userName && userName.includes(' ')){
    userName = userName.split(' ')[0];
  }

    return (
        <header className="flex items-center justify-between dark:bg-slate-900 dark:text-slate-100 relative">
          {/* Logo */}
          <Link className="text-primary font-semibold text-xl md:text-2xl dark:text-primary" href="/">
            Vladihka's PIZZA
          </Link>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex gap-6 lg:gap-8 text-gray-500 font-semibold items-center dark:text-slate-300">
            <Link href="/" className="hover:text-primary dark:hover:text-primary">Home</Link>
            <Link href="/menu" className="hover:text-primary dark:hover:text-primary">Menu</Link>
            <Link href="/#about" className="hover:text-primary dark:hover:text-primary">About</Link>
            <Link href="/#contact" className="hover:text-primary dark:hover:text-primary">Contact</Link>
          </nav>
          
          {/* Desktop User Actions */}
          <nav className="hidden md:flex items-center gap-2 lg:gap-4 text-gray-500 font-semibold dark:text-slate-300">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle theme"
            >
              {isDarkMode ? (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                </svg>
              )}
            </button>
            
            {status === 'authenticated' && (
              <>
                <Link href={'/profile'} className="whitespace-nowrap hover:text-primary dark:hover:text-primary">Hello, {userName}</Link>
                <button onClick={() => {
                  clearCart()
                  signOut()
                }} className="bg-primary text-white px-4 lg:px-8 rounded-full py-2 hover:bg-primary/90 transition-colors text-sm lg:text-base">Logout</button>
              </>
            )}
            {status === 'unauthenticated' && (
              <>
                <Link href="/login" className="hover:text-primary dark:hover:text-primary">Login</Link>
                <Link href="/register" className="bg-primary text-white px-4 lg:px-8 rounded-full py-2 hover:bg-primary/90 transition-colors text-sm lg:text-base">Register</Link>
              </>
            )}
            <Link href={'/cart'} className="relative hover:text-primary dark:hover:text-primary">
              <ShoppingCart></ShoppingCart>
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">{cartProducts.length}</span>
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <Link href={'/cart'} className="relative hover:text-primary dark:hover:text-primary">
              <ShoppingCart></ShoppingCart>
              <span className="absolute -top-2 -right-4 bg-primary text-white text-xs py-1 px-1 rounded-full leading-3">{cartProducts.length}</span>
            </Link>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors"
              aria-label="Toggle mobile menu"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 shadow-lg md:hidden">
              <nav className="flex flex-col p-4 space-y-4">
                <Link 
                  href="/" 
                  className="text-gray-500 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Home
                </Link>
                <Link 
                  href="/menu" 
                  className="text-gray-500 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Menu
                </Link>
                <Link 
                  href="/#about" 
                  className="text-gray-500 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  About
                </Link>
                <Link 
                  href="/#contact" 
                  className="text-gray-500 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-semibold"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Contact
                </Link>
                
                <div className="border-t border-gray-200 dark:border-slate-700 pt-4">
                  <button
                    onClick={toggleTheme}
                    className="flex items-center gap-2 text-gray-500 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-semibold w-full text-left"
                  >
                    {isDarkMode ? (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                        </svg>
                        Light Mode
                      </>
                    ) : (
                      <>
                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                        </svg>
                        Dark Mode
                      </>
                    )}
                  </button>
                  
                  {status === 'authenticated' && (
                    <>
                      <Link 
                        href={'/profile'} 
                        className="block text-gray-500 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-semibold mt-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Hello, {userName}
                      </Link>
                      <button 
                        onClick={() => {
                          clearCart()
                          signOut()
                          setMobileMenuOpen(false)
                        }} 
                        className="bg-primary text-white px-6 rounded-full py-2 hover:bg-primary/90 transition-colors w-full mt-2"
                      >
                        Logout
                      </button>
                    </>
                  )}
                  {status === 'unauthenticated' && (
                    <>
                      <Link 
                        href="/login" 
                        className="block text-gray-500 dark:text-slate-300 hover:text-primary dark:hover:text-primary font-semibold mt-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link 
                        href="/register" 
                        className="block bg-primary text-white px-6 rounded-full py-2 hover:bg-primary/90 transition-colors text-center mt-2"
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        Register
                      </Link>
                    </>
                  )}
                </div>
              </nav>
            </div>
          )}
        </header>
    )
}