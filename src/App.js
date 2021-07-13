import React, { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import SearchField from "react-search-field";

const GetArtistMBID = gql`
  query GetArtistMBID($artist: String!) {
    search {
      artists(query: $artist, first: 1) {
        edges {
          node {
            id
            mbid
            name
            disambiguation
          }
        }
      }
    }
  }
`;

const GetArtistAlbums = gql`
  query NirvanaAlbumSingles($mbid: MBID!) {
    lookup {
      artist(mbid: $mbid) {
        name
        releaseGroups(type: ALBUM) {
          edges {
            node {
              title
              firstReleaseDate
            }
          }
        }
      }
    }
  }
`;

function App() {
  const [searchString, setSearchString] = useState("");

  const [ loadGetArtistAlbums, { errorAlbum, loadingAlbum, albumData } ] = useLazyQuery(GetArtistAlbums, {
    onCompleted: (dataa) => console.log(dataa)
  });

  const [loadGetArtistMBID, { error, loading, data }] = useLazyQuery(
    GetArtistMBID,
    {
      onCompleted: (data) => loadGetArtistAlbums({ variables: { mbid: data.search.artists.edges[0].node.mbid } }),
    }
  );

  if (loading) return <p>LOADING</p>;
  if (error) return <p>ERROR JQJ</p>;

  const onChange = (value, event) => {
    setSearchString(value);
  };

  const onEnter = (value, event) => {
    console.log(searchString);
  };

  const onSearchClick = (value) => {
    loadGetArtistMBID({
      variables: { artist: value },
    });
  };

  return (
    <div>
      <SearchField
        placeholder="Search item"
        onChange={onChange}
        onEnter={onEnter}
        onSearchClick={onSearchClick}
      />
    </div>
  );
}

export default App;
