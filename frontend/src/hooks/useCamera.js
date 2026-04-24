import { useState } from 'react';

const useCamera = () => {
  const [cameraActive, setCameraActive] = useState(false);

  const startCamera = () => setCameraActive(true);
  const stopCamera = () => setCameraActive(false);

  return { cameraActive, startCamera, stopCamera };
};

export default useCamera;
