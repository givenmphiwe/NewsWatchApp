import React from "react";
import { View, ActivityIndicator, Modal } from "react-native";
import { observer } from "mobx-react-lite";
import loaderStore from "../state/LoaderStore";

const Loader = observer(() => {
  return (
    <Modal transparent animationType="fade" visible={loaderStore.isLoading}>
      <View className="flex-1 justify-center items-center bg-black/40">
        <ActivityIndicator size="large" color="#007AFF" />
      </View>
    </Modal>
  );
});

export default Loader;
