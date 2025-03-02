import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { Provider, useDispatch, useSelector } from "react-redux";
import { createStore } from "redux";
import "./styles.css";

// Redux - Initial State
const initialState = {
  cart: JSON.parse(localStorage.getItem("cart")) || []
};

// Redux - Reducer
const cartReducer = (state = initialState, action) => {
  switch (action.type) {
    case "ADD_TO_CART":
      const existing = state.cart.find((item) => item.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          cart: state.cart.map((item) =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
          )
        };
      } else {
        return { ...state, cart: [...state.cart, { ...action.payload, quantity: 1 }] };
      }
    case "REMOVE_FROM_CART":
      return { ...state, cart: state.cart.filter((item) => item.id !== action.payload) };
    case "UPDATE_QUANTITY":
      return {
        ...state,
        cart: state.cart.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        )
      };
    default:
      return state;
  }
};

const store = createStore(cartReducer);

// Redux Hooks
const useCart = () => useSelector((state) => state.cart);
const useCartDispatch = () => useDispatch();

// Sample Product Data
const products = [
  { id: 1, name: "Aloe Vera", price: 10, image: "/images/aloe.jpg", category: "Succulents" },
  { id: 2, name: "Snake Plant", price: 15, image: "/images/snake.jpg", category: "Succulents" },
  { id: 3, name: "Fiddle Leaf Fig", price: 25, image: "/images/fig.jpg", category: "Trees" },
  { id: 4, name: "Peace Lily", price: 20, image: "/images/lily.jpg", category: "Flowers" },
  { id: 5, name: "Jade Plant", price: 12, image: "/images/jade.jpg", category: "Succulents" },
  { id: 6, name: "Rubber Plant", price: 18, image: "/images/rubber.jpg", category: "Trees" }
];

// Header Component
const Header = () => {
  const cart = useCart();
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  return (
    <nav className="header">
      <Link to="/">Home</Link>
      <Link to="/products">Products</Link>
      <Link to="/cart">Cart ({totalItems})</Link>
    </nav>
  );
};

// Landing Page
const LandingPage = () => (
  <div className="landing" style={{ backgroundImage: 'url("/images/landing.jpg")', backgroundSize: 'cover', height: '100vh' }}>
    <h1>Paradise Nursery</h1>
    <p>Welcome to the best place for houseplants.</p>
    <Link to="/products"><button>Get Started</button></Link>
  </div>
);

// Product Page
const ProductPage = () => {
  const dispatch = useCartDispatch();
  const cart = useCart();

  return (
    <div>
      <h2>Our Collection</h2>
      {['Succulents', 'Trees', 'Flowers'].map((category) => (
        <div key={category}>
          <h3>{category}</h3>
          <div className="product-list">
            {products.filter(p => p.category === category).map((product) => (
              <div key={product.id} className="product">
                <img src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <p>${product.price}</p>
                <button onClick={() => dispatch({ type: "ADD_TO_CART", payload: product })} disabled={cart.some(item => item.id === product.id)}>
                  {cart.some(item => item.id === product.id) ? "Added" : "Add to Cart"}
                </button>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

// Cart Page
const CartPage = () => {
  const dispatch = useCartDispatch();
  const cart = useCart();
  const totalCost = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div>
      <h2>Your Shopping Cart</h2>
      {cart.length === 0 ? <p>Your cart is empty.</p> : (
        <div>
          {cart.map((item) => (
            <div key={item.id} className="cart-item">
              <img src={item.image} alt={item.name} />
              <h3>{item.name}</h3>
              <p>${item.price} x {item.quantity}</p>
              <button onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, quantity: item.quantity - 1 } })} disabled={item.quantity <= 1}>-</button>
              <button onClick={() => dispatch({ type: "UPDATE_QUANTITY", payload: { id: item.id, quantity: item.quantity + 1 } })}>+</button>
              <button onClick={() => dispatch({ type: "REMOVE_FROM_CART", payload: item.id })}>Remove</button>
            </div>
          ))}
          <h3>Total: ${totalCost.toFixed(2)}</h3>
          <button>Checkout (Coming Soon)</button>
          <Link to="/products"><button>Continue Shopping</button></Link>
        </div>
      )}
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <Provider store={store}>
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/cart" element={<CartPage />} />
        </Routes>
      </Router>
    </Provider>
  );
};

export default App;
