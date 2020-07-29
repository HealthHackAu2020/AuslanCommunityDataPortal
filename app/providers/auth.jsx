import React, { useContext, useEffect, useState } from "react";
import useSWR from "swr";
import { useData } from "./data";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { printGraphql } from "utils/gql";

// Auth Context
export const AuthContext = React.createContext(null);

// Auth Hook
export const useAuth = () => useContext(AuthContext);

// Constants
const LOCALSTORAGE_KEY = "auth_token";

// GQL Queries

const getAuthenticatedUserQuery = gql`
  query GetAuthenticatedUser {
    authenticatedUser {
      id
      name
      email
      isAdmin
      image {
        id
        publicUrl
      }
    }
  }
`;

const authenticateUserMutation = gql`
  mutation AuthenticateUser($email: String, $password: String) {
    authenticateUserWithPassword(email: $email, password: $password) {
      token
    }
  }
`;

export const AuthProvider = ({ children }) => {
  const { client, updateClientWithToken } = useData();
  const router = useRouter();

  /**
   * Initialise auth check
   *
   * - Check if local token
   * - If so, update client, and use local token to get current user.
   * - If successful, set user, and log in.
   * - If unsuccessful, redirect to login page, unless already login page.
   */
  useEffect(() => {
    const setup = async () => {
      const localToken = window.localStorage.getItem(LOCALSTORAGE_KEY);
      if (!localToken) {
        logoutUser();
        return;
      }
      updateClientWithToken(localToken);
      try {
        await mutateUser();
      } catch (error) {
        logoutUser();
      }
    };
    setup();
  }, []);

  const { data: user, error, mutate: mutateUser } = useSWR(
    printGraphql(getAuthenticatedUserQuery)
  );

  const authenticateUser = async (email, password) => {
    try {
      const response = await client.request(
        printGraphql(authenticateUserMutation),
        {
          email,
          password,
        }
      );
      const token = response.authenticateUserWithPassword.token;
      updateClientWithToken(token);
      window.localStorage.setItem(LOCALSTORAGE_KEY, token);
      await mutateUser();
      router.push("/");
    } catch (error) {
      logoutUser();
      throw error;
    }
  };

  const logoutUser = () => {
    window.localStorage.clear();
    updateClientWithToken(null);
    mutateUser(null, false);
    const loginPage = "/login";
    if (router.pathname !== loginPage) {
      router.replace(loginPage);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user: user && user.authenticatedUser,
        error,
        authenticateUser,
        logoutUser,
        mutateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
