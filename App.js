import React, { useEffect, useState } from "react";
import { Button, Image, StyleSheet, Text, View } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { ImageEditor } from "expo-image-editor";

const SERVER_URL = "https://chem-app-api.herokuapp.com";

export default function App() {
	const [image, setImage] = useState(null);
	const [result, setResult] = useState(null);
	const [editorVisible, setEditorVisible] = useState(false);

	useEffect(() => {
		console.log(image);
	}, [image]);

	const openCamera = async () => {
		setResult(null);

		const permissionResult = await ImagePicker.requestCameraPermissionsAsync();
		if (!permissionResult.granted) {
			console.log("You refused to allow the app to access the camera!");
			return;
		}

		const result = await ImagePicker.launchCameraAsync();
		if (result.cancelled) {
			setImage(null);
		} else {
			setImage(result);
			setEditorVisible(true);
		}
	};

	const openPhotos = async () => {
		setResult(null);

		const result = await ImagePicker.launchImageLibraryAsync();
		if (result.cancelled) {
			setImage(null);
		} else {
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
		console.log(json)
		setResult(json["result"]);
	};

	return (
		<View style={styles.container}>
			<Text style={styles.title}>Antimony Meter</Text>

			<View style={styles.imageContainer}>
				{image && <Image source={{ uri: image.uri }} style={styles.image} />}
			</View>

			<Text style={styles.result}>
				Concentration: {Math.round(result * 10) / 10}
			</Text>

			<View style={styles.buttons}>
				<Button title="Take Photo" onPress={openCamera} style={styles.button} />
				<Button
					title="Choose from Library"
					onPress={openPhotos}
					style={styles.button}
				/>
			</View>

			<ImageEditor
				visible={editorVisible}
				onCloseEditor={() => {
					setEditorVisible(false);
				}}
				imageUri={image ? image.uri : null}
				onEditingComplete={(result) => {
					setImage(result);
					uploadPhoto();
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
	title: {
		fontSize: 32,
		fontWeight: "bold",
		position: "absolute",
		top: "10%",
	},
	imageContainer: {
		width: 300,
		height: 300,
		borderWidth: 2,
	},
	image: {
		flex: 1,
		resizeMode: "contain",
	},
	result: {
		fontSize: 18,
		fontWeight: "700",
	},
	buttons: {
		marginTop: 100,
	},
	button: {},
});
