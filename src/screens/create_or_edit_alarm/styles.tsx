import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F7FE',
    keyboardShouldPersistTaps: 'always',
  },
  bottomContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    borderTopRightRadius: 40,
    borderTopLeftRadius: 40,
    padding: 25,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 10,
    fontSize: 16,
    fontStyle: 'italic',
    fontFamily: 'DMSans_18pt-Black',

    marginBottom: 20,
  },
});

export default styles;
