import React, { useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImageEditor } from "expo-image-editor";

const SERVER_URL = "https://chem-app-api.herokuapp.com";

export default function App() {
  const [image, setImage] = useState(null);
  const [result, setResult] = useState(null);
  const [editorVisible, setEditorVisible] = useState(false);

  const openCamera = async () => {
    setResult(null);

    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      console.log("You refused to allow the app to access the camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    if (!result.cancelled) {
      setImage(result);
      setEditorVisible(true);
    }
  };

  const openPhotos = async () => {
    setResult(null);

    const result = await ImagePicker.launchImageLibraryAsync();
    if (!result.cancelled) {
      setImage(result);
      setEditorVisible(true);
    }
  };

  const uploadPhoto = async () => {
    const data = new FormData();
    const file = {
      uri: image.uri,
      name: "userPhoto.jpg",
      type: "image/jpg",
    };
    data.append("file", file);

    const response = await fetch(`${SERVER_URL}/pic`, {
      method: "POST",
      body: data,
    });

    const json = await response.json();
    setResult(json["result"]);
  };

  return (
    <View style={styles.container}>
      {image && <Image source={{ uri: image.uri }} style={styles.image} />}
      {result && <Text>Concentration: {result}</Text>}
      <Button title="Take Photo" onPress={openCamera} />
      <Button title="Choose from Library" onPress={openPhotos} />
      <ImageEditor
        visible={editorVisible}
        onCloseEditor={() => {
          setEditorVisible(false);
          uploadPhoto();
        }}
        imageUri={image ? image.uri : null}
        onEditingComplete={(result) => {
          setImage(result);
        }}
        mode="crop-only"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    height: 200,
    width: 200,
  },
});
