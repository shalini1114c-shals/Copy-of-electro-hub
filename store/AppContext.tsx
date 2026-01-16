
import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { Product, CartItem, User, Order } from '../types';

interface State {
  cart: CartItem[];
  user: User | null;
  orders: Order[];
  wishlist: string[]; // IDs
}

type Action =
  | { type: 'ADD_TO_CART'; payload: Product }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_QUANTITY'; payload: { id: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'LOGOUT' }
  | { type: 'TOGGLE_WISHLIST'; payload: string }
  | { type: 'PLACE_ORDER'; payload: Order };

const initialState: State = {
  cart: [],
  user: null,
  orders: [],
  wishlist: [],
};

const AppContext = createContext<{
  state: State;
  dispatch: React.Dispatch<Action>;
} | undefined>(undefined);

function appReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'ADD_TO_CART':
      const existingItem = state.cart.find(item => item.id === action.payload.id);
      if (existingItem) {
        return {
          ...state,
          cart: state.cart.map(item =>
            item.id === action.payload.id ? { ...item, quantity: item.quantity + 1 } : item
          ),
        };
      }
      return { ...state, cart: [...state.cart, { ...action.payload, quantity: 1 }] };

    case 'REMOVE_FROM_CART':
      return { ...state, cart: state.cart.filter(item => item.id !== action.payload) };

    case 'UPDATE_QUANTITY':
      return {
        ...state,
        cart: state.cart.map(item =>
          item.id === action.payload.id ? { ...item, quantity: Math.max(1, action.payload.quantity) } : item
        ),
      };

    case 'CLEAR_CART':
      return { ...state, cart: [] };

    case 'SET_USER':
      localStorage.setItem('electrohub_user', JSON.stringify(action.payload));
      return { ...state, user: action.payload };

    case 'LOGOUT':
      localStorage.removeItem('electrohub_user');
      return { ...state, user: null };

    case 'TOGGLE_WISHLIST':
      const inWishlist = state.wishlist.includes(action.payload);
      return {
        ...state,
        wishlist: inWishlist
          ? state.wishlist.filter(id => id !== action.payload)
          : [...state.wishlist, action.payload],
      };

    case 'PLACE_ORDER':
      return { ...state, orders: [action.payload, ...state.orders], cart: [] };

    default:
      return state;
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  // Initialize from LocalStorage
  useEffect(() => {
    const savedUser = localStorage.getItem('electrohub_user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'SET_USER', payload: user });
      } catch (e) {
        console.error("Failed to load user session");
      }
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
