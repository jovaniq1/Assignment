import { atom, useAtom } from 'jotai';

import type { productsProps } from './constants/constants';
import { products } from './constants/constants';

// Define the initial state for products and cart
const initialProducts = [...products]; // This should be your initial products data
export const cartAtom = atom([]);
export const productsAtom = atom(initialProducts);

export const showCartAtom = atom(true);
// Atom to handle add to cart
export const useAddToCart = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const [products, setProducts] = useAtom(productsAtom);

  const handleAddToCart = (id: number) => {
    setProducts(prevProducts => {
      return prevProducts.map((product: productsProps) => {
        if (product.id === id) {
          const newAdded = (product.added || 0) + 1;
          // update cart atom conditionally within the same operation
          setCart(prevCart => {
            const inCart = prevCart?.find(
              (item: productsProps) => item.id === id,
            );
            if (inCart) {
              return prevCart.map((item: productsProps) =>
                item.id === id ? { ...item, added: newAdded } : item,
              );
            }
            return [...prevCart, { ...product, added: newAdded }];
          });

          return { ...product, added: newAdded };
        }
        return product;
      });
    });
  };

  return handleAddToCart;
};

// Atom to handle removing from cart
export const useRemoveFromCart = () => {
  const [cart, setCart] = useAtom(cartAtom);
  const [products, setProducts] = useAtom(productsAtom);

  const handleRemoveFromCart = (id: number) => {
    setProducts(prevProducts => {
      return prevProducts.map((product: productsProps) => {
        if (product.id === id) {
          const newAdded = (product.added || 0) - 1;
          // update cart atom conditionally within the same operation
          setCart(prevCart => {
            const inCart = prevCart?.find(
              (item: productsProps) => item.id === id,
            );
            if (inCart && newAdded > 0) {
              return prevCart.map((item: productsProps) =>
                item.id === id ? { ...item, added: newAdded } : item,
              );
            } else {
              return prevCart.filter((item: productsProps) => item.id !== id);
            }
          });

          return { ...product, added: newAdded };
        }
        return product;
      });
    });
  };

  return handleRemoveFromCart;
};

// Atom to handle clearing the cart
export const useClearCart = () => {
  const [, setCart] = useAtom(cartAtom);
  // make all products added 0
  const [products, setProducts] = useAtom(productsAtom);

  const handleClearCart = () => {
    setCart([]);
    setProducts(prevProducts => {
      return prevProducts.map((product: productsProps) => {
        return { ...product, added: 0 };
      });
    });
  };

  return handleClearCart;
};

// Hook to use the showCartAtom
export const useShowCartIcon = () => {
  const [showCart, setShowCart] = useAtom(showCartAtom);

  // Function to show the cart
  const handleShowCart = (val: boolean) => {
    setShowCart(val);
  };

  return handleShowCart;
};
