import {useState} from 'react'
import {Routes, Route, Navigate} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import CartContext from './context/CartContext'
import ProtectedRoute from './components/ProtectedRoute'

import './App.css'

const App = () => {
  const [cartList, setCartList] = useState([])

  const removeAllCartItems = () => {
    setCartList([])
  }

  const incrementCartItemQuantity = id => {
    setCartList(prevCartList =>
      prevCartList.map(cartItem =>
        cartItem.id === id
          ? {...cartItem, quantity: cartItem.quantity + 1}
          : cartItem,
      ),
    )
  }

  const decrementCartItemQuantity = id => {
    setCartList(prevCartList =>
      prevCartList
        .map(cartItem => {
          if (cartItem.id === id) {
            return cartItem.quantity > 1
              ? {...cartItem, quantity: cartItem.quantity - 1}
              : cartItem
          }
          return cartItem
        })
        .filter(cartItem => !(cartItem.id === id && cartItem.quantity === 1)),
    )
  }

  const removeCartItem = id => {
    setCartList(prevCartList =>
      prevCartList.filter(cartItem => cartItem.id !== id),
    )
  }

  const addCartItem = product => {
    setCartList(prevCartList => {
      const productIndex = prevCartList.findIndex(
        cartItem => cartItem.id === product.id,
      )
      if (productIndex > -1) {
        return prevCartList.map((cartItem, index) =>
          index === productIndex
            ? {...cartItem, quantity: cartItem.quantity + product.quantity}
            : cartItem,
        )
      }
      return [...prevCartList, product]
    })
  }

  return (
    <CartContext.Provider
      value={{
        cartList,
        addCartItem,
        removeCartItem,
        incrementCartItemQuantity,
        decrementCartItemQuantity,
        removeAllCartItems,
      }}
    >
      <Routes>
        <Route path="/login" element={<LoginForm />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products/:id"
          element={
            <ProtectedRoute>
              <ProductItemDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />
        <Route path="/not-found" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/not-found" />} />
      </Routes>
    </CartContext.Provider>
  )
}

export default App
