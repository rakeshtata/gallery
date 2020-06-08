/*This is an example of Image Picker in React Native*/
import React from 'react';
import { StyleSheet, Text, View,ScrollView , Button, Image, AsyncStorage } from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Lightbox from 'react-native-lightbox';
import { RNS3 } from 'react-native-s3-upload';
/*import {AsyncStorage} from '@react-native-community/async-storage'*/

const options = {
  keyPrefix: "uploads/",
  bucket: "image-picker-test",
  region: "us-west-1",
  accessKey: "AKIAJTG7TY4IWKS7CVAQ",
  secretKey: "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",
  successActionStatus: 201
}

export default class App extends React.Component {

  constructor(props) {
    super(props);
    AsyncStorage.clear();
    this.state = {
      filePath: {},
      counter: 0
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
        let counter = this.state.counter;
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
    let self = this;
    try{
      let keys = await AsyncStorage.getAllKeys();
      let stores =  await AsyncStorage.multiGet(keys);
      stores = stores.sort((a,b) => a[0] - b[0]);
      let imgView = await stores.map((store,i) => {
        return  <View key={store[0]} style={{flexDirection:"row"}}>
      <Lightbox underlayColor="white">
          <Image
            source={{
              uri: 'data:image/jpeg;base64,' + JSON.parse(store[1]).data,
            }}
            resizeMode="contain"
            style={{ width: 100, height: 100,justifyContent: 'flex-start' }}
          />
        </Lightbox>
        <Text style={{ alignItems: 'center',justifyContent: 'flex-end'}}>
        {`Step - ${i+1}`}
        </Text>
         <Button title="Delete" style={{justifyContent: 'flex-end'}} onPress={()=>{
           AsyncStorage.removeItem(store[0],(err,result)=> {this.setState({ state: this.state });})}}/>
           <Button title="Upload" style={{justifyContent: 'flex-end'}} onPress={()=>{
             const file = {
                // `uri` can also be a file system path (i.e. file://)
                uri: 'data:image/jpeg;base64,' + JSON.parse(store[1]).data,
                name: `image${store[0]}.png`,
                type: "image/png"
              }
             RNS3.put(file, options).then(response => {
              if (response.status !== 201)
                throw new Error("Failed to upload image to S3");
              console.log(response.body);
            });}}/>
        </View>
      });
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
      <View style={styles.container}>
        <Button title="Add a Step" style={styles.chooseButton} onPress={this.chooseFile.bind(this)} />
      <View style={{height: 580}} >
        <ScrollView contentContainerStyle={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#AFEEEE',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chooseButton: {
    marginTop: '25%',
  }
});
