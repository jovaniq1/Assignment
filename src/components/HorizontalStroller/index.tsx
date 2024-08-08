import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { set, type SharedValue } from 'react-native-reanimated';
import React, { useEffect } from 'react';
import { useAtom } from 'jotai';

import type { productsProps } from '../../constants/constants';
import theme, { normalize } from '../../theme/theme';
import { productsAtom, useAddToCart, useRemoveFromCart } from '../../cartStore';

import { CoverFlowCarousel } from './components/coverflow-carousel';

type HorizontalStrollerProps = {
  currentItem: productsProps;
  products: productsProps[];
  addToCart: (id: number) => void;
  id: number;
  scrollToIndex: SharedValue<number>;
};
const HorizontalStroller = (props: HorizontalStrollerProps) => {
  const { id, scrollToIndex } = props;

  const [products] = useAtom(productsAtom);
  const handleAddToCart = useAddToCart();

  return (
    <View style={styles.container}>
      <View style={styles.coverflow}>
        <CoverFlowCarousel
          products={products}
          id={id}
          scrollToIndex={scrollToIndex}
          addToCart={handleAddToCart}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  coverflow: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export { HorizontalStroller };
