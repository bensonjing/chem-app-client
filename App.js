import React, { useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImageEditor } from "expo-image-editor";

const SERVER_URL = "http://127.0.0.1:5000";

const createFormData = (imageUri) => {
  const data = new FormData();

  data.append("photo", {
    uri: Platform.OS === "ios" ? imageUri.replace("file://", "") : imageUri,
  });

  return data;
};

export default function App() {
  const [imageUri, setImageUri] = useState(null);
  const [editorVisible, setEditorVisible] = useState(false);

  const openCamera = async () => {
    const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!permissionResult.granted) {
      console.log("You refused to allow the app to access the camera!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync();
    console.log(result);
    if (!result.cancelled) {
      setImageUri(result.uri);
      setEditorVisible(true);
    }
  };

  const openPhotos = async () => {
    const result = await ImagePicker.launchImageLibraryAsync();
    console.log(result);
    if (!result.cancelled) {
      setImageUri(result.uri);
      setEditorVisible(true);
    }
  };

  const uploadPhoto = async () => {
    const response = await fetch(`${SERVER_URL}/pic`, {
      method: "POST",
      body: createFormData(imageUri),
    });
    const json = await response.json();
    console.log(json);
  };

  return (
    <View style={styles.container}>
      {imageUri && <Image source={{ uri: imageUri }} style={styles.image} />}
      <Button title="Take Photo" onPress={openCamera} />
      <Button title="Choose from Photos" onPress={openPhotos} />
      <Button title="Upload Photo" onPress={uploadPhoto} />
      <ImageEditor
        visible={editorVisible}
        onCloseEditor={() => setEditorVisible(false)}
        imageUri={imageUri}
        onEditingComplete={(result) => {
          setImageUri(result.uri);
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
