// eslint-disable-next-line import/no-extraneous-dependencies
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useAtom } from 'jotai';

import { App } from './src';
import { ToastProvider } from './src/components/Toast/toast-manager';
import { CartButton } from './src/components/Cart/CartButton';
import { showCartAtom } from './src/cartStore';
import { PinchToAccess } from './src/components/Pinch/PinchToAccess';

const AppContainer = () => {
  const [showCart] = useAtom(showCartAtom);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ToastProvider>
        {showCart && <CartButton />}
        <PinchToAccess>
          <App />
        </PinchToAccess>
      </ToastProvider>
    </GestureHandlerRootView>
  );
};

// eslint-disable-next-line import/no-default-export
export default AppContainer;
