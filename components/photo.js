import React,{ useState } from 'react';
import { Text, View , Button, Image, AsyncStorage } from 'react-native';
import Lightbox from 'react-native-lightbox';
import PutImageToS3 from '../service/s3Api';

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
        <Button title="Upload" style={{justifyContent: 'flex-end'}} onPress={()=>PutImageToS3(store)}/>
      </View>
    )
}

export default Photo;
