import { useRouter } from "next/router";
import Head from "next/head";
import { Navbar } from "components/Navbar";
import { PageWrap } from "components/PageWrap";
import gql from "graphql-tag";
import { useQuery, useMutation } from "graphql-hooks";
import { printGraphql } from "utils/gql";
import { H1, H2 } from "components/Header";
import { useForm, Controller } from "react-hook-form";
import { TextArea } from "components/TextInput";
import { Submit } from "components/Button";
import { Stars, StarInput } from "components/Stars";
import { useAuth } from "providers/auth";

const getVideoDataQuery = gql`
  query ViewVideo($id: ID!) {
    Video(where: { id: $id }) {
      id
      translation
      movements
      handshapes
      locations
      dominantHand
      user {
        id
        name
        image {
          id
          publicUrl
        }
      }
      file {
        id
        publicUrl
      }
      ratings {
        id
        user {
          id
        }
      }
      comments(sortBy: [id_DESC]) {
        id
        user {
          id
          name
          image {
            id
            publicUrl
          }
        }
        text
      }
      averageRatings {
        correctness
        clarity
      }
    }
  }
`;
const addCommentMutation = gql`
  mutation CreateComment($text: String!, $video: ID!) {
    createComment(data: { video: { connect: { id: $video } }, text: $text }) {
      id
    }
  }
`;
const addRatingMutation = gql`
  mutation CreateRating($correctness: Int, $clarity: Int, $video: ID!) {
    createRating(
      data: {
        correctness: $correctness
        clarity: $clarity
        video: { connect: { id: $video } }
      }
    ) {
      id
    }
  }
`;

export default function ViewVideoPage() {
  const router = useRouter();
  const { user } = useAuth();
  const id = router.query.id;

  const { data, error, refetch } = useQuery(printGraphql(getVideoDataQuery), {
    variables: { id },
  });

  const [addComment] = useMutation(printGraphql(addCommentMutation));
  const [addRating] = useMutation(printGraphql(addRatingMutation));

  const {
    handleSubmit: hsComment,
    register: regComment,
    reset: resetComment,
  } = useForm();
  const { handleSubmit: hsRating, control, reset: resetRating } = useForm();
  const onSubmitComment = async ({ comment }) => {
    await addComment({
      variables: {
        text: comment,
        video: id,
      },
    });
    resetComment();
    await refetch();
  };

  const onSubmitRating = async (values) => {
    await addRating({
      variables: {
        clarity: values.clarity,
        correctness: values.correctness,
        video: id,
      },
    });
    resetRating();
    await refetch();
  };

  if (error) {
    return (
      <>
        <PageWrap>
          <span>Unable to find video.</span>
        </PageWrap>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <PageWrap>
          <span>Loading...</span>
        </PageWrap>
      </>
    );
  }

  const video = data.Video;

  const isOwnerOrHasRated =
    video.user.id === user.id ||
    data.Video.ratings.some((rating) => rating.user.id === user.id);

  return (
    <>
      <Head>
        <title>{video.translation} | Auslan Community Portal</title>
      </Head>

      <div className="min-h-screen">
        <Navbar />
        <PageWrap>
          <div className="relative pb-3x2 mb-6">
            <video
              className="absolute inset-0 w-full h-full"
              src={video.file.publicUrl}
              controls
              muted
            ></video>
          </div>

          {/* Translation and User */}
          <div className="flex flex-col space-y-1 mb-8">
            <H2 className="mb-4">Video Details</H2>
            <p>What does this video mean?</p>
            <p className="p-4 bg-gray-200 rounded">{video.translation}</p>
            <div className="flex items-center space-x-2">
              <span>Video by:</span>
              <span className="text-purple-700">{data.Video.user.name}</span>
            </div>
          </div>

          {/* Ratings */}
          <div className="mb-8">
            <H2 className="mb-4">Ratings ({video.ratings.length})</H2>
            <div className="flex space-x-8">
              <div className="space-y-1">
                <span>Correctness</span>
                <Stars rating={data.Video.averageRatings.correctness} />
              </div>
              <div className="space-y-1">
                <span>Clarity</span>
                <Stars rating={data.Video.averageRatings.clarity} />
              </div>
            </div>
          </div>

          {/* Metadata */}
          <div className="space-y-2 mb-8">
            <H2 className="mb-4">Metadata</H2>
            <div className="space-x-4">
              <span className="font-semibold">Dominant Hand:</span>
              <span>{data.Video.dominantHand}</span>
            </div>
            <div className="space-x-4">
              <span className="font-semibold">Handshapes:</span>
              <span>{data.Video.handshapes}</span>
            </div>
            <div className="space-x-4">
              <span className="font-semibold">Locations:</span>
              <span>{data.Video.locations}</span>
            </div>
            <div className="space-x-4">
              <span className="font-semibold">Movements:</span>
              <span>{data.Video.movements}</span>
            </div>
          </div>

          {/* Rating */}
          {!isOwnerOrHasRated && (
            <div>
              <H2 className="mb-4">Rate this video:</H2>
              <form
                className="flex flex-col items-center space-y-4"
                onSubmit={hsRating(onSubmitRating)}
              >
                <div className="w-full">
                  <label className="mb-3" htmlFor="correctness">
                    Rate the video correctness:
                  </label>
                  <Controller
                    as={<StarInput />}
                    id="correctness"
                    control={control}
                    rules={{ required: true }}
                    name="correctness"
                  />
                </div>
                <div className="w-full">
                  <label className="mb-3" htmlFor="clarity">
                    Rate the video clarity:
                  </label>
                  <Controller
                    as={<StarInput />}
                    id="clarity"
                    rules={{ required: true }}
                    control={control}
                    name="clarity"
                  />
                </div>
                <Submit value="Post rating" />
              </form>
            </div>
          )}

          {/* Comments */}
          <hr className="my-4" />
          <form
            className="flex flex-col space-y-4 items-center mb-8"
            onSubmit={hsComment(onSubmitComment)}
          >
            <TextArea
              ref={regComment({ required: true })}
              name="comment"
              placeholder="Write a comment"
            />
            <Submit value="Post comment" />
          </form>

          <div className="">
            <H2 className="mb-2">Comments ({video.comments.length})</H2>
            <div className="flex flex-col space-y-4 divide-y-2">
              {data.Video.comments.map((comment) => (
                <div className="flex flex-col pt-4" key={comment.id}>
                  <span className="font-semibold">{comment.user.name}:</span>
                  <span>{comment.text}</span>
                </div>
              ))}
              {video.comments.length === 0 && (
                <div className="p-8 flex items-center justify-center bg-gray-200">
                  <span className="text-gray-600">No comments yet...</span>
                </div>
              )}
            </div>
          </div>
        </PageWrap>
      </div>
    </>
  );
}
