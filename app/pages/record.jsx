import React, { useRef, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { RecordRTCPromisesHandler } from "recordrtc";
import { Button } from "components/Button";
import { H1 } from "components/Header";
import { TextInput } from "components/TextInput";
import { useForm, Controller } from "react-hook-form";
import { Submit } from "components/Button";
import gql from "graphql-tag";
import { printGraphql } from "utils/gql";

import { useMutation } from "graphql-hooks";
import { PageWrap } from "components/PageWrap";
import { Navbar } from "components/Navbar";
import { H2 } from "components/Header";
import { PauseIcon } from "components/icons/Pause";
import { PlayIcon } from "components/icons/Play";
import { TextArea } from "components/TextInput";
import { RadioInput } from "components/TextInput";
import { handShapes, locations, movements } from "utils/sign";

import Select from "react-select";

const createVideoMutation = gql`
  mutation CreateVideoRecord(
    $file: Upload!
    $translation: String!
    $handshapes: String
    $movements: String
    $locations: String
    $dominantHand: VideoDominantHandType
  ) {
    createVideo(
      data: {
        translation: $translation
        handshapes: $handshapes
        movements: $movements
        locations: $locations
        dominantHand: $dominantHand
        file: $file
      }
    ) {
      id
    }
  }
`;

const fileNameCleanRegex = /[^\w\ ]/gi;

export default function RecordPage() {
  const videoElement = useRef(null);
  const [recorder, setRecorder] = useState(null);
  const [file, setFile] = useState(null);
  const [currentlyRecording, setCurrentlyRecording] = useState(false);
  const [cameraError, setCameraError] = useState(null);

  const router = useRouter();

  const { handleSubmit, register, errors, control } = useForm();

  const captureCamera = async () => {
    try {
      return window.navigator.mediaDevices.getUserMedia({ video: true });
    } catch (error) {
      console.log({ msg: "Failed to get camera", error });
      setCameraError(true);
      throw error;
    }
  };

  const [createVideo] = useMutation(printGraphql(createVideoMutation));

  const startRecording = async () => {
    try {
      setCameraError(false);
      const camera = await captureCamera();
      const video = videoElement.current;

      // Setup video
      video.muted = true;
      video.volume = 0;
      video.srcObject = camera;

      let localRecorder = new RecordRTCPromisesHandler(camera, {
        type: "video",
        mimeType: "video/webm;codecs=vp8",
        // canvas: {
        //   width: 500,
        //   height: 500,
        // },
      });
      localRecorder.startRecording();

      localRecorder.camera = camera;
      setRecorder(localRecorder);
      setCurrentlyRecording(true);
    } catch (error) {
      console.log({ msg: "Failed to get camera", error });
      setCameraError(true);
      throw error;
    }
  };

  const stopRecording = async () => {
    const video = videoElement.current;

    await recorder.stopRecording();
    const blob = await recorder.getBlob();
    setFile(blob);

    video.src = video.srcObject = null;
    video.src = window.URL.createObjectURL(blob);

    recorder.camera.stop();
    recorder.destroy();
    setRecorder(null);
    setCurrentlyRecording(false);
  };

  const getFilename = (translation) =>
    translation
      .replace(fileNameCleanRegex, "")
      .split(" ")
      .join("-");

  const getValueString = (arr) =>
    arr ? arr.map((item) => item.value).join(",") : "";

  const onSubmit = async (values) => {
    file.name = `${getFilename(values.translation)}.webm`;
    const { data, error } = await createVideo({
      variables: {
        file,
        translation: values.translation,
        dominantHand: values.dominantHand,
        handshapes: getValueString(values.handshapes),
        locations: getValueString(values.locations),
        movements: getValueString(values.movements),
      },
    });

    if (error) {
      console.error(error);
      throw error;
    }

    const videoId = data.createVideo.id;
    router.push(`/view/${videoId}`);
  };

  return (
    <>
      <Head>
        <title>Record Video | Auslan Community Portal</title>
      </Head>

      {/* Page */}
      <div className="min-h-screen">
        <Navbar />
        <PageWrap>
          <H1 className="py-4">Record your video</H1>

          {/* Record */}
          <div className="space-y-2 mb-4">
            <div className="relative pb-3x2">
              <video
                className="absolute inset-0 w-full h-full"
                ref={videoElement}
                controls
                autoPlay
                playsInline
              ></video>
            </div>
            {cameraError && (
              <div className="text-white bg-red-700 p-4 rounded">
                <span>
                  Failed to access camera. Please allow permissions before
                  recording.
                </span>
              </div>
            )}
            <div className="flex justify-center">
              {currentlyRecording ? (
                <Button
                  className="flex items-center space-x-2"
                  onClick={stopRecording}
                >
                  <PauseIcon className="h-6 w-6" />
                  <span>Stop Recording</span>
                </Button>
              ) : (
                <Button
                  className="flex items-center space-x-2"
                  onClick={startRecording}
                >
                  <PlayIcon className="h-6 w-6" />
                  <span>Start Recording</span>
                </Button>
              )}
            </div>
          </div>

          {/* Details */}
          <hr />
          <H2 className="my-4">Video Details</H2>
          <form
            className="flex flex-col space-y-3"
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextArea
              showLabel
              name="translation"
              ref={register({ required: true })}
              placeholder="What are you saying in this video?"
            />

            <div>
              <label className="block mb-3">What is your dominant hand?</label>
              <div className="space-y-2">
                <RadioInput
                  ref={register}
                  value="left"
                  label="Left-handed"
                  name="dominantHand"
                />
                <RadioInput
                  ref={register}
                  value="right"
                  label="Right-handed"
                  name="dominantHand"
                />
              </div>
            </div>

            <div>
              <label htmlFor="handshapes">Handshapes:</label>
              <Controller
                id="handshapes"
                as={<Select />}
                control={control}
                name="handshapes"
                placeholder="Handshapes"
                options={handShapes}
                isMulti
              />
            </div>

            <div>
              <label htmlFor="location">Locations:</label>
              <Controller
                id="location"
                as={<Select />}
                control={control}
                name="location"
                placeholder="Locations"
                options={locations}
                isMulti
              />
            </div>

            <div>
              <label htmlFor="movements">Movements:</label>
              <Controller
                as={<Select />}
                id="movements"
                control={control}
                name="movements"
                placeholder="Movements"
                options={movements}
                isMulti
              />
            </div>

            <Submit value="Submit" />
          </form>
        </PageWrap>
      </div>
    </>
  );
}
