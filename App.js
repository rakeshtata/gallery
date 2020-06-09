/*This is an example of Image Picker in React Native*/
import React from 'react';
import { Text, View,ScrollView , Button, Image, AsyncStorage } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Lightbox from 'react-native-lightbox';
import { RNS3 } from 'react-native-s3-upload';
import Styles from './style';
import Photo from './components/photo';
/*import {AsyncStorage} from '@react-native-community/async-storage'*/



export default class App extends React.Component {

  constructor(props) {
    super(props);
    //AsyncStorage.clear();
    this.state = {
      filePath: {},
      counter: 0
    };
    this.getImages();
  }

  componentDidUpdate(){
    this.getImages();
  }


  chooseFile = () => {
    var options = {
      title: 'Select Image',
      customButtons: [
        { name: 'customOptionKey', title: 'Choose Photo from Custom Option' },
      ],
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    ImagePicker.showImagePicker(options,async (response) => {


      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response;
        let counter = this.state.counter;
      //  let lastCounter =  await AsyncStorage.getItem("lastCounter");
      //  counter = lastCounter ? parseInt(lastCounter): counter;
        AsyncStorage.setItem(""+
        counter, JSON.stringify(source));
        counter++;
        this.setState({
          filePath: source,
          counter: counter
        });
      }
    });
  };




  getImages =  async () => {
    try{
      let keys = await AsyncStorage.getAllKeys();
      let stores =  await AsyncStorage.multiGet(keys);
      stores = stores.sort((a,b) => a[0] - b[0]);
      let imgView = await stores.map((store,i) =>
        { if(store[1])  return (<Photo store={store} i={i}/>)}
      );
      this.setState({
        isAvail: true,
        imgView: imgView
      });

    } catch(e){
      console.log(e);
    }
  }


  render() {
    return (
      <View style={Styles.container}>
        <Button title="Add a Step" style={Styles.chooseButton} onPress={this.chooseFile.bind(this)} />
      <View style={{height: 580}} >
        <ScrollView contentContainerStyle={Styles.container}>
          {/*<Image
            source={{
              uri: 'data:image/jpeg;base64,' + this.state.filePath.data,
            }}
            style={{ width: 100, height: 100 }}
          />*/}
        {this.state.isAvail && this.state.imgView.map((mView) => mView)}
        </ScrollView>
      </View>
      </View>
    );
  }
}
