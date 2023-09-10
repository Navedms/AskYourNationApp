import React from 'react';
import LottieView from 'lottie-react-native';

function Activityindicator({ visible = false }) {
  if (!visible) return null;
  return (
    <LottieView
      autoPlay
      loop
      source={require('../../assets/animations/loader.json')}
      style={{ zIndex: 10 }}
    />
  );
}

export default Activityindicator;
