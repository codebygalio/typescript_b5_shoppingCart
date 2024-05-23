import { useShoppingCart } from "context/ShoppingCartContext";
import { Offcanvas, Stack } from "react-bootstrap";
import { CartItem } from "./CartItem";
import { formatCurrency } from "utilities/formatCurrency";
import storeItems from 'data/items.json'

type ShoppingCartProps = {
    isOpen: boolean
}

export function ShoppingCart ({isOpen}: ShoppingCartProps) {
    const {closeCart, cartItems } = useShoppingCart()
    const totalPrice = cartItems.reduce((total, cartItem) => {
        const item = storeItems.find(storeItem => storeItem.id === cartItem.id);
        if (item)return item.price * cartItem.quantity + total
        return 0
    },0)

    return (<Offcanvas show={isOpen} onHide={closeCart} placement="end">
        <Offcanvas.Header closeButton>
            <Offcanvas.Title>Cart</Offcanvas.Title>
        </Offcanvas.Header>
        <Offcanvas.Body>
            <Stack gap={3}>
                {cartItems.map(item => (<CartItem key={item.id} {...item} />))}
                <div className="ms-auto fw-bold fs-5">Total {formatCurrency(totalPrice)}</div>
            </Stack>
        </Offcanvas.Body>
    </Offcanvas>)
}