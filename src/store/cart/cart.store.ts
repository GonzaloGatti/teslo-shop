import { CartProduct } from "@/interfaces";
import { MouseEventHandler } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface State {
    cart: CartProduct[];

    // Methods
    getProductsInCart: () => number;
    getSummaryInformation: () => {
      subTotal: number;
      tax: number;
      total: number;
      itemsInCart: number;
    };

    addProductToCart: (product: CartProduct) => void;
    updateProductQuantity: (product: CartProduct, quantity: number) => void;
    removeProductToCart: (product: CartProduct) => void;
    clearCart: () => void;
}

export const useCartStore = create<State>()(
  persist(
    (set, get) => ({
      cart: [],

      // Métodos

      getProductsInCart: (): number => {
        const { cart } = get();

        return cart.reduce(( total, item ) => total + item.quantity, 0);
      },

      getSummaryInformation: () => {
        const { cart } = get();

        const subTotal = cart.reduce(
          (subTotal, product) => product.quantity * product.price + subTotal,
          0
        );
        const tax = subTotal * 0.15;
        const total = subTotal + tax;
        const itemsInCart = cart.reduce(
          (total, item) => total + item.quantity,
          0
        );

        return {
          subTotal,
          tax,
          total,
          itemsInCart,
        };
      },

      addProductToCart: (product: CartProduct) => {
        const { cart } = get();

        // 1. Revisar si el producto existe en el carrito con el talle seleccionado
        const isProductInCart = cart.some(
          (item) => item.id === product.id && item.size === product.size
        );

        // 2. El producto no existe con el mismo talle, entonces lo añado al array
        if (!isProductInCart) {
          set({ cart: [...cart, product] });
          return;
        }

        // 3. El producto existe con el mismo talle en el array, entonces lo incremento
        const updatedCartProducts = cart.map(item => {
          if (item.id === product.id && item.size === product.size) {
            return { ...item, quantity: item.quantity + product.quantity };
          }

          return item;
        });

        set({ cart: updatedCartProducts });
      },

      updateProductQuantity: (product: CartProduct, quantity: number) => {
        const { cart } = get();

        const updatedProductQuantity = cart.map(item => {
          if(item.id === product.id && item.size === product.size){
            return { ...item, quantity: quantity }
          }

          return item
        });
        
        set({ cart: updatedProductQuantity });
      },

      removeProductToCart: (product: CartProduct) => {
        const { cart } = get();

        const updatedProductCart = cart.filter(item => item.id !== product.id || item.size !== product.size)

        set({ cart: updatedProductCart })
      },

      clearCart: () => {
        set({ cart: [] })
      }

    }),

    {
      name: "shopping-cart",
    }
  )
);
