import React, { useRef, useState } from "react";
import Head from "next/head";
import { RecordRTCPromisesHandler } from "recordrtc";
import { Button } from "components/Button";
import { H1 } from "components/Header";

export default () => {
  const videoElement = useRef(null);
  const [recorder, setRecorder] = useState(null);

  const captureCamera = async () => {
    try {
      return navigator.mediaDevices.getUserMedia({ video: true });
    } catch (error) {
      console.log({ msg: "Failed to get camera", error });
      throw error;
    }
  };

  const startRecording = async () => {
    const camera = await captureCamera();
    const video = videoElement.current;

    // Setup video
    video.muted = true;
    video.volume = 0;
    video.srcObject = camera;

    let localRecorder = new RecordRTCPromisesHandler(camera, {
      type: "video",
      canvas: {
        width: 500,
        height: 500,
      },
    });
    localRecorder.startRecording();

    localRecorder.camera = camera;
    setRecorder(localRecorder);
  };

  const stopRecording = async () => {
    const video = videoElement.current;

    await recorder.stopRecording();
    const blob = await recorder.getBlob();
    video.src = video.srcObject = null;
    video.src = window.URL.createObjectURL(blob);

    recorder.camera.stop();
    recorder.destroy();
    setRecorder(null);
  };

  return (
    <>
      <Head>
        <title>Record Video</title>
      </Head>
      <div className="mx-auto container h-screen max-w-md">
        <H1 className="text-center py-8">Record Videos</H1>
        <div className="relative pb-1x1">
          <video
            className="absolute inset-0 w-full h-full"
            ref={videoElement}
            controls
            autoPlay
            playsInline
          ></video>
        </div>
        <div className="flex justify-between">
          <Button onClick={startRecording}>Start Recording</Button>
          <Button onClick={stopRecording}>Stop Recording</Button>
        </div>
      </div>
    </>
  );
};
