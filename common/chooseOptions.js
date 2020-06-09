import { AsyncStorage } from 'react-native';

const ChooseOptions = (response,self) => {
    if (response.didCancel) {
      console.log('User cancelled image picker');
    } else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    } else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
      alert(response.customButton);
    } else {
      let source = response;
      let counter = self.state.counter;
      AsyncStorage.setItem(""+
      counter, JSON.stringify(source));
      counter++;
      self.setState({
        filePath: source,
        counter: counter
      });
    }
  }


export default ChooseOptions;
