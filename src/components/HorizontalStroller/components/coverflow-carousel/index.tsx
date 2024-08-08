import type { SharedValue } from 'react-native-reanimated';
import Animated, {
  useAnimatedRef,
  useScrollViewOffset,
} from 'react-native-reanimated';
import { useWindowDimensions, Dimensions } from 'react-native';
import React, { useCallback, useEffect } from 'react';

import type { productsProps } from '../../../../constants/constants';

import { CarouselItem } from './carousel-item';

const { width: ScreenWidth } = Dimensions.get('window');
type CoverFlowCarouselProps = {
  products: productsProps[];

  scrollToIndex: SharedValue<number>;

  addToCart: (id: number) => void;
  id: number;
};

const ItemWidth = ScreenWidth * 0.85;

export const CoverFlowCarousel: React.FC<CoverFlowCarouselProps> = ({
  products,
  id,
  addToCart,
}) => {
  const animatedRef = useAnimatedRef(null);
  const scrollOffset = useScrollViewOffset(animatedRef);
  const [currentItemIndex, setCurrentItemIndex] = React.useState(0);

  const { width: windowWidth } = useWindowDimensions();

  const paddingHorizontal = Math.round((windowWidth - ItemWidth) / 2);

  const renderItem = useCallback(
    ({ item, index }: { item: productsProps; index: number }) => {
      return (
        <CarouselItem
          key={item?.id}
          item={item}
          index={index}
          scrollOffset={scrollOffset}
          itemWidth={ItemWidth}
          id={id}
          addToCart={addToCart}
        />
      );
    },
    [scrollOffset, currentItemIndex, addToCart, products],
  );

  useEffect(() => {
    if (currentItemIndex !== id) {
      setCurrentItemIndex(id);
    }
  }, [id, currentItemIndex]);

  useEffect(() => {
    goToItem();
  }, [currentItemIndex]);

  const goToItem = () => {
    setTimeout(() => {
      animatedRef?.current?.scrollTo({
        x: currentItemIndex * ItemWidth - ItemWidth,
        animated: false,
      });
    }, 0);
  };

  return (
    <Animated.ScrollView
      ref={animatedRef}
      horizontal
      pagingEnabled
      snapToInterval={ItemWidth}
      scrollEventThrottle={16} // 60fps
      decelerationRate={'fast'}
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        alignItems: 'center',
        paddingHorizontal,
      }}>
      {products.map((item, index) => renderItem({ item, index }))}
    </Animated.ScrollView>
  );
};
