import rootReducer from '../reducers';
import {legacy_createStore as createStore} from 'redux';

function configureStore() {
  const store = createStore(rootReducer);
  return store;
}

export default configureStore;
