import React, { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import SearchField from "react-search-field";
import FbImageLibrary from "react-fb-image-grid";

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
  query GetArtistAlbums($mbid: MBID!) {
    lookup {
      artist(mbid: $mbid) {
        name
        releaseGroups(type: ALBUM) {
          edges {
            node {
              title
              firstReleaseDate
              coverArtArchive {
                front
                back
              }
            }
          }
        }
      }
    }
  }
`;

function App() {
  const [searchString, setSearchString] = useState("");
  const [albums, setAlbums] = useState({});

  const [
    loadGetArtistAlbums,
    { errorAlbum, loadingAlbum, albumData },
  ] = useLazyQuery(GetArtistAlbums, {
    onCompleted: (queriedAlbums) => {
      setAlbums(queriedAlbums.lookup.artist.releaseGroups.edges);
      console.log(queriedAlbums.lookup.artist.releaseGroups.edges);
    },
  });

  const [loadGetArtistMBID, { error, loading, data }] = useLazyQuery(
    GetArtistMBID,
    {
      onCompleted: (data) =>
        loadGetArtistAlbums({
          variables: { mbid: data.search.artists.edges[0].node.mbid },
        }),
    }
  );

  if (loading) return <p>Loading... </p>;
  if (error) return <p>Error...</p>;

  const onChange = (value, event) => {
    setSearchString(value);
  };

  const onEnter = (value, event) => {
    console.log(searchString);
  };

  const onSearchClick = (value) => {
    // TODO: clear state before each search
    loadGetArtistMBID({
      variables: { artist: value },
    });
  };

  const generateImage = (albums) => {
    return albums
      .map((album) => {
        return album.node.coverArtArchive.front;
      })
      .filter((url) => !!url);
  };

  return (
    <div>
      <SearchField
        placeholder="Search item"
        onChange={onChange}
        onEnter={onEnter}
        onSearchClick={onSearchClick}
      />

      {albums.length > 0 ? (
        <FbImageLibrary images={generateImage(albums)} />
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
