/*This is an example of Image Picker in React Native*/
import React from 'react';
import { StyleSheet, Text, View,ScrollView , Button, Image, AsyncStorage } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Lightbox from 'react-native-lightbox';
/*import {AsyncStorage} from '@react-native-community/async-storage'*/

export default class App extends React.Component {

  constructor(props) {
    super(props);
    AsyncStorage.clear();
    this.state = {
      filePath: {}
    };
  }
  componentDidMount(){
    //this.getImages();
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
    ImagePicker.showImagePicker(options, response => {
    {/*console.log('Response = ', response);*/}

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
        alert(response.customButton);
      } else {
        let source = response;
        AsyncStorage.setItem("profilePic"+Math.random(), JSON.stringify(source));
        this.setState({
          filePath: source
        });
      }
    });
  };



  getImages =  () => {
    let self = this;
    try{
      AsyncStorage.getAllKeys((err, keys) => {
        AsyncStorage.multiGet(keys, async (err, stores) => {
          imgView = await stores.map((result, i, store) => {
            return  <View key={store[i][0]} style={{flexDirection:"row"}}>
          <Lightbox underlayColor="white">
              <Image
                source={{
                  uri: 'data:image/jpeg;base64,' + JSON.parse(store[i][1]).data,
                }}
                resizeMode="contain"
                style={{ width: 100, height: 100,justifyContent: 'flex-start' }}
              />
            </Lightbox>
             <Button title="Delete" style={{justifyContent: 'flex-end'}} onPress={()=>{console.log(store[i][0]);
               AsyncStorage.removeItem(store[i][0],(err)=> console.log(err))}}/>
            </View>
          });
          this.setState({
            isAvail: true,
            imgView: imgView
          });
        });
      });
    } catch(e){
      console.log("%%%%%%%%")
      console.log(e);
    }
  }


  render() {
    return (
      <ScrollView contentContainerStyle={styles.container}>
        <ScrollView contentContainerStyle={styles.container}>
          {/*<Image
            source={{
              uri: 'data:image/jpeg;base64,' + this.state.filePath.data,
            }}
            style={{ width: 100, height: 100 }}
          />*/}
        {this.state.isAvail && this.state.imgView.map((mView) => mView)}
          <Button title="Choose File" onPress={this.chooseFile.bind(this)} />
        </ScrollView>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mainContainer: {
    alignItems: 'center',
    justifyContent: 'center'
  }
});
