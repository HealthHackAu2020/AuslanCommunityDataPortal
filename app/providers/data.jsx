import React, { useContext, useState } from "react";
import { SWRConfig } from "swr";
import { GraphQLClient } from "graphql-request";
import { GraphQLClient as HkGQLClient, ClientContext } from "graphql-hooks";

// Data Context
export const DataContext = React.createContext(null);

// Data Hook
export const useData = () => useContext(DataContext);

const GQL_ENDPOINT = `/admin/api`;

export const DataProvider = ({ children }) => {
  // Initialise the Data Providers
  const [client, setClient] = useState(new GraphQLClient(GQL_ENDPOINT));

  const hkClient = new HkGQLClient({
    url: GQL_ENDPOINT,
  });

  const fetcher = async (...args) => client.request(...args);

  const updateClientWithToken = (token) => {
    const authHeader = token
      ? {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      : undefined;

    if (token) {
      hkClient.setHeader("Authorization", `Bearer ${token}`);
    } else {
      hkClient.removeHeader("Authorization");
    }

    const newClient = new GraphQLClient(GQL_ENDPOINT, authHeader);
    setClient(newClient);
  };

  return (
    <ClientContext.Provider value={hkClient}>
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
    </ClientContext.Provider>
  );
};
