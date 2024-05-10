import React, { useState } from "react";
import { StyleSheet, View, Text, Modal, Pressable } from "react-native";
import SettingsForm from "./SettingsForm";

const Settings = () => {
  const [modalVisible, setModalVisable] = useState(false);

  const setModalVisible = (visible: boolean ) => {
    setModalVisable(visible);
  }

  return (
    <View>
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
      >
        <View>
          <View style={styles.modalView}>
            <Text style={styles.title}>Enter RSS feeds for your news:</Text>
            <SettingsForm />
            <Pressable
              style={{ ...styles.closeButton, margin: 10 }}
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.closeText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <Pressable
        style={styles.openButton}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.textStyle}>Config</Text>
      </Pressable>
    </View> 
  );
}

const styles = StyleSheet.create({
  centeredView: {
    marginTop: 50,
  },
  modalView: {
    marginTop: 175,
    marginHorizontal: 10,
    backgroundColor: "#b3d6cf",
    alignItems: "center",
    borderRadius: 5,
    paddingTop: 15,
    paddingLeft: 15,
    paddingRight: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5
  },
  openButton: {
    backgroundColor: "#0b7c66",
    borderRadius: 5,
    padding: 10,
    elevation: 2
  },
  closeButton: {
    borderColor: "#0b7c66",
    borderWidth: 2,
    borderRadius: 5,
    padding: 10,

  },
  closeText: {
    color: "#0b7c66",
    fontWeight: "bold"
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#565656"
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center"
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center"
  }
});

export default Settings;