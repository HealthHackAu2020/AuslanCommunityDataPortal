import React from "react";
import Head from "next/head";
import { useAuth } from "providers/auth";
import { Button, Submit } from "components/Button";
import { useQuery, useMutation } from "graphql-hooks";
import gql from "graphql-tag";
import { printGraphql } from "../utils/gql";
import { TextInput } from "../components/TextInput";
import { useForm } from "react-hook-form";

const getAuthenticatedUserQuery = gql`
  query GetAuthenticatedUser {
    authenticatedUser {
      id
      name
      email
      isAdmin
      profile
      image {
        id
        publicUrl
      }
    }
  }
`;

const updateNameMutation = gql`
  mutation UpdateUser(
    $id: ID!
    $name: String
    $profile: String
    $email: String
    $password: String
  ) {
    updateUser(
      id: $id
      data: {
        name: $name
        profile: $profile
        email: $email
        password: $password
      }
    ) {
      id
      name
    }
  }
`;

const deleteProfilePicMutation = gql`
  mutation DeleteProfilePic($id: ID!) {
    updateUser(id: $id, data: { image: null }) {
      id
      name
      email
    }
  }
`;

const updateFileMutation = gql`
  mutation UpdateFile($id: ID!, $image: Upload) {
    updateUser(id: $id, data: { image: $image }) {
      id
      name
    }
  }
`;

export default function Profile() {
  const { logoutUser } = useAuth();
  const { data, error, loading, refetch } = useQuery(
    printGraphql(getAuthenticatedUserQuery)
  );

  const [updateName] = useMutation(printGraphql(updateNameMutation));
  const [deleteProfilePic] = useMutation(
    printGraphql(deleteProfilePicMutation)
  );
  const [updateProfilePic] = useMutation(printGraphql(updateFileMutation));

  const { register, handleSubmit, errors, setError } = useForm();

  const onSubmit = async ({ email, password, name, profile }) => {
    try {
      console.log("name:" + name + "id:" + data.authenticatedUser.id);
      // Call auth hook
      updateName({
        variables: {
          id: data.authenticatedUser.id,
          name: name,
          profile: profile,
          email: email,
          password: password,
        },
      });
    } catch (error) {}
  };

  const onDeleteProfile = async () => {
    try {
      // Call auth hook
      await deleteProfilePic({ variables: { id: data.authenticatedUser.id } });
      await refetch();
    } catch (error) {}
  };

  console.log({ data, error, loading });

  if (error) {
    return <div>There was and error</div>;
  }

  if (loading) {
    return <div>Loading ...</div>;
  }

  const onChange = async (e) => {
    console.log(e.target.files);

    let fileObj = e.target.files[0]; //URL.createObjectURL(e.target.files[0]);
    await updateProfilePic({
      variables: { id: data.authenticatedUser.id, image: fileObj },
    });

    await refetch();
  };

  let showProfilePic;
  if (data.authenticatedUser.image) {
    showProfilePic = (
      <>
        <img
          src={data.authenticatedUser.image.publicUrl}
          alt="Your Profile Picture"
          width="160"
          height="210"
        />
        <input type="file" onChange={onChange} />
        <Button onClick={() => onDeleteProfile()}>Delete</Button>
      </>
    );
  } else {
    showProfilePic = (
      <>
        <img src="" alt="Your Profile Picture" width="160" height="210" />
        <input type="file" onChange={onChange} />
      </>
    );
  }

  return (
    <>
      <Head>
        <title>Your Profile</title>
      </Head>

      <div className="mx-auto container flex flex-col min-h-screen items-center justify-center">
        <div className="w-full">
          {/* Logo and Header */}
          <div className="flex flex-col items-center">
            {/*<SignHello className="w-40 mb-4" />*/}
            <span className="text-xl font-bold">Profile Page:</span>
          </div>
          {/* Update Profile */}
          <div className="flex flex-col items-center">{showProfilePic}</div>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="my-4 px-4 flex flex-col items-center space-y-2"
          >
            Name:{" "}
            <TextInput
              name="name"
              className="justify-center"
              placeholder={data.authenticatedUser.name}
              defaultValue={data.authenticatedUser.name}
              ref={register({ required: true })}
              errors={{ "This field is required": errors.email }}
            />
            Description:{" "}
            <TextInput
              name="profile"
              placeholder={data.authenticatedUser.profile}
              defaultValue={data.authenticatedUser.profile}
              ref={register({ required: true })}
              errors={{ "This field is required": errors.email }}
            />
            Email:{" "}
            <TextInput
              name="email"
              placeholder={data.authenticatedUser.email}
              defaultValue={data.authenticatedUser.email}
              ref={register({ required: true })}
              errors={{ "This field is required": errors.email }}
            />
            Password:{" "}
            <TextInput
              name="password"
              type="password"
              placeholder={data.authenticatedUser.password}
              defaultValue={data.authenticatedUser.password}
              ref={register({ required: true })}
              errors={{
                "That username and password are invalid":
                  errors.password && errors.password.type === "manual",
                "This field is required": errors.password,
              }}
            />
            <Submit value="Save" />
          </form>
        </div>
      </div>
    </>
  );
}
