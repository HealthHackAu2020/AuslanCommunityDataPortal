import React, { useEffect, useContext } from "react";
import useSWR from "swr";
import gql from "graphql-tag";
import { useRouter } from "next/router";
import { printGraphql } from "utils/gql";
import { Loader } from "components/icons/Loader";
import { useData } from "./data";

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
  const client = useData();
  const router = useRouter();

  const updateClientWithToken = (token) => {
    if (token) {
      client.setHeader("Authorization", `Bearer ${token}`);
    } else {
      client.removeHeader("Authorization");
    }
  };

  const { data, error, mutate: mutateUser } = useSWR(
    printGraphql(getAuthenticatedUserQuery)
  );

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

  const authenticateUser = async (email, password) => {
    try {
      const response = await client.request({
        query: printGraphql(authenticateUserMutation),
        variables: {
          email,
          password,
        },
      });
      const token = response.data.authenticateUserWithPassword.token;
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

  const isLoginPage = () => router.pathname === "/login";

  if (error || (data && data.authenticatedUser === null)) {
    logoutUser();
    return;
  }

  if (!data && !isLoginPage()) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <Loader className="h-20 w-20" />
      </div>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        user: data && data.authenticatedUser,
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
