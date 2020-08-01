import React from "react";
import { SWRConfig } from "swr";
import { GraphQLClient, ClientContext } from "graphql-hooks";
import { useContext } from "react";

const GQL_ENDPOINT = `/admin/api`;

export const useData = () => useContext(ClientContext);

export const DataProvider = ({ children }) => {
  const client = new GraphQLClient({
    url: GQL_ENDPOINT,
  });

  const fetcher = async (query, variables) => {
    const response = await client.request(
      { query, variables },
      {
        skipCache: true,
      }
    );
    return response.data;
  };

  return (
    <ClientContext.Provider value={client}>
      <SWRConfig
        value={{
          fetcher,
        }}
      >
        {children}
      </SWRConfig>
    </ClientContext.Provider>
  );
};
