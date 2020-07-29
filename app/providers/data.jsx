import React, { useContext, useEffect, useState } from "react";
import { SWRConfig } from "swr";
import { GraphQLClient } from "graphql-request";

// Data Context
export const DataContext = React.createContext(null);

// Data Hook
export const useData = () => useContext(DataContext);

const GQL_ENDPOINT = `/admin/api`;

export const DataProvider = ({ children }) => {
  // Initialise the Data Providers
  const [client, setClient] = useState(new GraphQLClient(GQL_ENDPOINT));

  const fetcher = async (...args) => client.request(...args);

  const updateClientWithToken = (token) => {
    const newClient = new GraphQLClient(GQL_ENDPOINT, {
      headers: {
        Authorization: token ? `Bearer ${token}` : undefined,
      },
    });
    setClient(newClient);
  };

  return (
    <DataContext.Provider
      value={{
        client,
        updateClientWithToken,
      }}
    >
      <SWRConfig
        value={{
          fetcher,
        }}
      >
        {children}
      </SWRConfig>
    </DataContext.Provider>
  );
};
