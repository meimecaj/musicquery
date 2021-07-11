import React from "react";
import { gql, useQuery } from "@apollo/client";

const TEST = gql`
  query GetSpecificSong {
    lookup {
      releaseGroup(mbid: "99599db8-0e36-4a93-b0e8-350e9d7502a9") {
        title
      }
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(TEST);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error...</p>;

  return (
    <div>
      <p>{data.lookup.releaseGroup.title}</p>
    </div>
  );
}

export default App;
