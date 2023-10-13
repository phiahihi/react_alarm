import React, {useEffect} from 'react';
import Root from './src/navigation';
import {Provider} from 'react-redux';
import configureStore from './redux/store/store';
import SplashScreen from 'react-native-splash-screen';

function App() {
  useEffect(() => {
    SplashScreen.hide();
  }, []);

  return (
    <Provider store={configureStore()}>
      <Root />
    </Provider>
  );
}
export default App;
