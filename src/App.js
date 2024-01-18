import {useState} from 'react'
import {Route, Switch, Redirect} from 'react-router-dom'

import LoginForm from './components/LoginForm'
import Home from './components/Home'
import Products from './components/Products'
import ProductItemDetails from './components/ProductItemDetails'
import Cart from './components/Cart'
import NotFound from './components/NotFound'
import ProtectedRoute from './components/ProtectedRoute'
import CartContext from './context/CartContext'

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
      <Switch>
        <Route exact path="/login" component={LoginForm} />
        <ProtectedRoute exact path="/" component={Home} />
        <ProtectedRoute exact path="/products" component={Products} />
        <ProtectedRoute
          exact
          path="/products/:id"
          component={ProductItemDetails}
        />
        <ProtectedRoute exact path="/cart" component={Cart} />
        <Route path="/not-found" component={NotFound} />
        <Redirect to="not-found" />
      </Switch>
    </CartContext.Provider>
  )
}

export default App
