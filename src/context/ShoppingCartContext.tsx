import { ShoppingCart } from "components/ShoppingCart";
import { ReactNode, createContext, useContext, useState } from "react";
import { useLocalStorage } from "utilities/useLocalStorage";

type ShoppingCartProviderProps = {
    children: ReactNode
}

type CartItem = {
    id: string, 
    quantity: number
}

type ShoppingCartContent = {
    openCart: () => void,
    closeCart: () => void,
    getItemQuantity: (id: string) => number,
    increaseCartQuantity: (id: string) => void,
    decreaseCartQuantity: (id: string) => void,
    removeFromCart: (id: string) => void,
    cartQuantity: number,
    cartItems: CartItem[]
}

const ShoppingCartContext =  createContext({} as ShoppingCartContent)

export function useShoppingCart () {
    return useContext(ShoppingCartContext)
}



export function ShoppingCartProvider ({children}:ShoppingCartProviderProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [cartItems, setCartItems] = useLocalStorage<CartItem[]>('shopping-cart',[])

    const cartQuantity = cartItems.reduce((quantity, item) => quantity + item.quantity, 
    0)

    const openCart = () => setIsOpen(true)
    const closeCart = () => setIsOpen(false)

    function getItemQuantity(id: string) {
        return cartItems.find(item => item.id === id)?.quantity || 0 
    }

    function increaseCartQuantity(id: string) {
        setCartItems(currItems => {
            if(currItems.find(item => item.id === id) === undefined) {
                return [...currItems, {id, quantity: 1}]
            }else {
                return currItems.map(item => {
                    if(item.id === id){
                        return {...item, quantity: item.quantity + 1}
                    }else {
                        return item
                    }
                })
            }
        })
    }

    function decreaseCartQuantity(id: string) {
        setCartItems(currItems => {
            if(currItems.find(item => item.id === id)?.quantity === 1) {
                return currItems.filter(item => item.id !== id)
            }else {
                return currItems.map(item => {
                    if(item.id === id){
                        return {...item, quantity: item.quantity - 1}
                    }else {
                        return item
                    }
                })
            }
        })
    }

    function removeFromCart(id: string) {
        setCartItems(currItems => {
            return currItems.filter(item => item.id !== id)
        })
    }

    

    return <ShoppingCartContext.Provider 
    value={{getItemQuantity, increaseCartQuantity, decreaseCartQuantity, removeFromCart, cartItems, cartQuantity,openCart, closeCart }} >
        {children}
        <ShoppingCart isOpen={isOpen}/>
        </ShoppingCartContext.Provider>
}
