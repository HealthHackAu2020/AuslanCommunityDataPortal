import React, { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import { useAuth } from "providers/auth";
import { Button } from "components/Button";
import { Navbar } from "components/Navbar";
import { PageWrap } from "components/PageWrap";
import { H1 } from "components/Header";
import gql from "graphql-tag";
import { useQuery } from "graphql-hooks";
import { printGraphql } from "utils/gql";
import { Loader } from "components/icons/Loader";
import { PlayIcon } from "components/icons/Play";
import { Stars } from "components/Stars";
import { CommentIcon } from "components/icons/CaretDown";
import { StarIcon } from "components/icons/Star";
import { AutoComplete } from "components/Autocomplete";

import { useForm } from "react-hook-form";
import { handShapes, locations, movements } from "utils/sign";
import { Submit } from "components/Button";
import { TextInput } from "components/TextInput";

const videoCardFragment = gql`
  fragment VideoCardFragment on Video {
    id
    user {
      id
      name
      image {
        id
        publicUrl
      }
    }
    translation
    handshapes
    movements
    locations
    file {
      id
      publicUrl
    }
    _commentsMeta {
      count
    }
    _ratingsMeta {
      count
    }
    averageRatings {
      correctness
      clarity
    }
    createdAt
  }
`;

const getLatestVideos = gql`
  query getLatestVideos(
    $translationSearch: String
    $handshapeSearch: String
    $movementSearch: String
    $locationSearch: String
    $skipCount: Int
  ) {
    allVideos(
      where: {
        AND: [
          { translation_contains_i: $translationSearch }
          { handshapes_contains_i: $handshapeSearch }
          { movements_contains_i: $movementSearch }
          { locations_contains_i: $locationSearch }
        ]
      }
      sortBy: [id_DESC]
      first: 6
      skip: $skipCount
    ) {
      ...VideoCardFragment
    }
    _allVideosMeta(
      where: {
        AND: [
          { translation_contains_i: $translationSearch }
          { handshapes_contains_i: $handshapeSearch }
          { movements_contains_i: $movementSearch }
          { locations_contains_i: $locationSearch }
        ]
      }
    ) {
      count
    }
  }
  ${videoCardFragment}
`;

// use options.updateData to append the new page of posts to our current list of posts
const updateData = (prevData, data) => {
  const currentIds = prevData.allVideos.map((vid) => vid.id);
  const newVids = data.allVideos.filter((vid) => !currentIds.includes(vid.id));
  return {
    ...data,
    allVideos: [...prevData.allVideos, ...newVids],
  };
};

export default function Home() {
  const { logoutUser } = useAuth();

  const { handleSubmit, register, control } = useForm();
  const [skipCount, setSkipCount] = useState(0);
  const [showSearch, setShowSearch] = useState(false);
  const [translationSearch, setTranslationSearch] = useState();
  const [handshapeSearch, setHandshapeSearch] = useState();
  const [locationSearch, setLocationSearch] = useState();
  const [movementSearch, setMovementSearch] = useState();
  const { data, error, loading, refetch } = useQuery(
    printGraphql(getLatestVideos),
    {
      variables: {
        skipCount,
        translationSearch,
        handshapeSearch,
        locationSearch,
        movementSearch,
      },
      updateData,
    }
  );

  const searchSubmit = async (values) => {
    console.log({ values });
    const translationSearch = values.translation || undefined;
    const handshapeSearch = values.handshapes?.value || undefined;
    const locationSearch = values.locations?.value || undefined;
    const movementSearch = values.movements?.value || undefined;

    await refetch({
      // skipCache: true,
      variables: {
        translationSearch,
        handshapeSearch,
        locationSearch,
        movementSearch,
      },
      updateData: (_, data) => data,
    });
  };

  const toggleSearch = () => {
    setShowSearch(!showSearch);
  };

  if (error) {
    return (
      <PageWrap>
        <div>There was an error loading videos... Please try again later.</div>
      </PageWrap>
    );
  }

  if (!data) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader className="h-20 w-20" />
      </div>
    );
  }

  const { allVideos, _allVideosMeta } = data;
  const areMoreVideos = allVideos.length < _allVideosMeta.count;

  return (
    <>
      <Head>
        <title>Auslan Community Portal</title>
      </Head>

      <>
        <div className="min-h-screen max-w-screen">
          <Navbar searchCallback={toggleSearch} />

          {/* Search */}
          {showSearch && (
            <div className="bg-gray-200">
              <div className="mx-auto container p-4">
                <H1 className="mb-4">Search Videos</H1>
                <form
                  className="flex flex-col space-y-2"
                  onSubmit={handleSubmit(searchSubmit)}
                >
                  <TextInput
                    ref={register}
                    name="translation"
                    placeholder="Translation"
                    isRect
                    showLabel
                  />
                  <div className="flex flex-col space-y-2 mb-4">
                    <div>
                      <label htmlFor="handshapes">Handshapes:</label>
                      <AutoComplete
                        id="handshapes"
                        control={control}
                        name="handshapes"
                        isClearable
                        placeholder="Handshapes"
                        options={handShapes}
                      />
                    </div>

                    <div>
                      <label htmlFor="locations">Locations:</label>
                      <AutoComplete
                        id="locations"
                        control={control}
                        name="locations"
                        isClearable
                        placeholder="Locations"
                        options={locations}
                      />
                    </div>

                    <div>
                      <label htmlFor="movements">Movements:</label>
                      <AutoComplete
                        id="movements"
                        control={control}
                        name="movements"
                        placeholder="Movements"
                        isClearable
                        options={movements}
                      />
                    </div>
                  </div>

                  <div className="flex justify-center mb-4 ">
                    <Submit loading={loading} value="Filter Videos" />
                  </div>
                </form>
              </div>
            </div>
          )}

          <PageWrap className="flex flex-col">
            <H1 className="mb-8">Latest Videos</H1>
            <div className="mb-4 flex flex-wrap flex-col space-y-8 md:flex-row md:space-y-0">
              {allVideos.map((video) => (
                <Link key={video.id} href={`/view/${video.id}`}>
                  <a className="block w-full md:p-2 md:w-1/2 lg:w-1/3 outline-none focus:shadow-outline">
                    <VideoCard video={video} />
                  </a>
                </Link>
              ))}
            </div>
            {areMoreVideos && (
              <div className="flex w-full justify-center">
                <Button onClick={() => setSkipCount(allVideos.length)}>
                  Load More Videos
                </Button>
              </div>
            )}
          </PageWrap>
        </div>
      </>
    </>
  );
}

function timeDifference(previous, current = new Date()) {
  var msPerMinute = 60 * 1000;
  var msPerHour = msPerMinute * 60;
  var msPerDay = msPerHour * 24;
  var msPerMonth = msPerDay * 30;
  var msPerYear = msPerDay * 365;

  var elapsed = current - previous;

  if (elapsed < msPerMinute) {
    return Math.round(elapsed / 1000) + " seconds ago";
  } else if (elapsed < msPerHour) {
    return Math.round(elapsed / msPerMinute) + " minutes ago";
  } else if (elapsed < msPerDay) {
    return Math.round(elapsed / msPerHour) + " hours ago";
  } else if (elapsed < msPerMonth) {
    return "approximately " + Math.round(elapsed / msPerDay) + " days ago";
  } else if (elapsed < msPerYear) {
    return "approximately " + Math.round(elapsed / msPerMonth) + " months ago";
  } else {
    return "approximately " + Math.round(elapsed / msPerYear) + " years ago";
  }
}

const VideoCard = ({ video }) => {
  const handshapes = video.handshapes.split(",").filter((item) => item.trim());
  const locations = video.locations.split(",").filter((item) => item.trim());
  const movements = video.movements.split(",").filter((item) => item.trim());

  return (
    <div className="border shadow rounded text-left overflow-hidden">
      {/* Video */}
      <div className="relative pb-3x2 bg-black text-white">
        <video
          src={video.file.publicUrl}
          className="absolute inset-0 w-full h-full"
        ></video>
        <div className="absolute inset-0 w-full h-full bg-black opacity-50"></div>
        <div className="absolute inset-0 flex items-center justify-center">
          <PlayIcon className="h-20 w-20" />
        </div>
        <div className="absolute inset-x-0 bottom-0 flex items-center p-3 justify-between font-thin text-sm">
          <span>{video.user.name}</span>
          <span>uploaded {timeDifference(new Date(video.createdAt))}</span>
        </div>
      </div>

      <div className="p-2">
        {/* Wording */}
        <div className="mb-2">
          <div className="mb-2">
            <span className="font-semibold">{video.translation}</span>
          </div>
          <div className="inline-flex flex-wrap space-x-1 text-sm">
            <div className="flex space-x-1 my-1">
              {handshapes.map((word) => (
                <span className="bg-red-200 p-1 rounded capitalize" key={word}>
                  {word.split("_").join(" ")}
                </span>
              ))}
            </div>
            <div className="inline-flex space-x-1 my-1">
              {locations.map((word) => (
                <span className="bg-blue-200 p-1 rounded capitalize" key={word}>
                  {word.split("_").join(" ")}
                </span>
              ))}
            </div>
            <div className="inline-flex space-x-1 my-1">
              {movements.map((word) => (
                <span
                  className="bg-purple-200 p-1 rounded capitalize"
                  key={word}
                >
                  {word.split("_").join(" ")}
                </span>
              ))}
            </div>
          </div>
        </div>

        <hr />
        {/* Rating */}
        <div className="flex">
          <div className="flex flex-col items-start p-4 w-1/2">
            <span>Correctness</span>
            <Stars rating={video.averageRatings.correctness} />
          </div>
          <div className="flex flex-col items-start p-4 w/1-2">
            <span>Clarity</span>
            <Stars rating={video.averageRatings.clarity} />
          </div>
        </div>

        {/* Counts */}
        <div className="p-2 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CommentIcon className="h-6 w-6" />
            <span>{video._commentsMeta.count} comments</span>
          </div>
          <div className="flex items-center space-x-2">
            <StarIcon className="h-6 w-6" />
            <span>{video._ratingsMeta.count} ratings</span>
          </div>
        </div>
      </div>
    </div>
  );
};
