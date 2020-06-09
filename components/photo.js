import React,{ useState } from 'react';
import { Text, View , Button, Image, AsyncStorage } from 'react-native';
import Lightbox from 'react-native-lightbox';
import { RNS3 } from 'react-native-s3-upload';

const options = {
  keyPrefix: "uploads/",
  bucket: "image-picker-test",
  region: "us-west-1",
  accessKey: "",
  secretKey: "",
  successActionStatus: 201
}
const Photo = ({ store,i }) => {
  const [, setTick] = useState(0);
    return (
      <View key={store[0]} style={{flexDirection:"row"}}>
            <Lightbox underlayColor="white">
                <Image
                  source={{
                    uri: JSON.parse(store[1]).uri,
                  }}
                  resizeMode="contain"
                  style={{ width: 100, height: 100,justifyContent: 'flex-start' }}
                />
              </Lightbox>
            <Text style={{ alignItems: 'center',justifyContent: 'flex-end'}}>
            {`Step - ${i+1}`}
            </Text>
             <Button title="Delete" style={{justifyContent: 'flex-end'}} onPress={()=>{
               AsyncStorage.removeItem(store[0],(err,result)=> {setTick(tick => tick + 1)})}}/>
               <Button title="Upload" style={{justifyContent: 'flex-end'}} onPress={()=>{
                 const file = {
                    // `uri` can also be a file system path (i.e. file://)
                    uri: JSON.parse(store[1]).uri,
                    name: `image${store[0]}.png`,
                    type: "image/png"
                  }
                 RNS3.put(file, options).then(response => {
                  if (response.status !== 201)
                    throw new Error("Failed to upload image to S3");
                  console.log(response.body);
                });}}/>
            </View>
          )

}

export default Photo;
