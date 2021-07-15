import React, { useState } from "react";
import { gql, useLazyQuery } from "@apollo/client";
import SearchField from "react-search-field";
import FbImageLibrary from "react-fb-image-grid";
import SongListModal from "./components/SongListModal";

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
              mbid
              firstReleaseDate
              coverArtArchive {
                front
                back
              }
              releases {
                edges {
                  node {
                    mbid
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

const GetAlbumSongs = gql`
  query GetAlbumSongs($mbid: MBID!) {
    lookup {
      release(mbid: $mbid) {
        media {
          tracks {
            recording {
              title
            }
          }
        }
      }
    }
  }
`;

function App() {
  const [searchString, setSearchString] = useState("");
  // TODO: search string might not be needed at all in the end
  const [albums, setAlbums] = useState({});
  const [images, setImages] = useState([]);
  const [songs, setSongs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [
    loadGetArtistAlbums,
    { errorAlbum, loadingAlbum, albumData },
  ] = useLazyQuery(GetArtistAlbums, {
    onCompleted: (queriedAlbums) => {
      // TODO: see if the album state is needed whatsoever in the end?
      const albumsToBeSaved = queriedAlbums.lookup.artist.releaseGroups.edges;
      setAlbums(albumsToBeSaved);
      setImages(generateImages(albumsToBeSaved));
    },
  });

  const [
    loadGetAlbumSongs,
    { errorSongs, loadingSongs, songData },
  ] = useLazyQuery(GetAlbumSongs, {
    onCompleted: (queriedSongs) => {
      setSongs(queriedSongs.lookup.release.media);
      setModalOpen(true);
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

  if (loadingAlbum) return <p>Loading... </p>;
  if (errorAlbum) return <p>Error...</p>;

  const onChange = (value, event) => {
    setSearchString(value);
  };

  const onEnter = (value, event) => {
    loadGetArtistMBID({
      variables: { artist: value },
    });
  };

  const onSearchClick = (value) => {
    loadGetArtistMBID({
      variables: { artist: value },
    });
  };

  const generateImages = (albums) => {
    return albums
      .map((album) => {
        return {
          src: album.node.coverArtArchive.front,
          mbid: album.node.releases.edges[0].node.mbid,
        };
      })
      .filter((entity) => !!entity.src);
  };

  const loadImages = (images) => {
    return images.map((image) => image.src);
  };

  const closeModal = () => {
    setModalOpen(false);
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
        <FbImageLibrary
          images={loadImages(images)}
          onClickEach={({ src, index }) =>
            loadGetAlbumSongs({
              variables: { mbid: images[index].mbid },
            })
          }
        />
      ) : (
        ""
      )}

      {songs.length > 0 ? (
        <SongListModal
          open={modalOpen}
          songList={songs}
          close={() => closeModal}
        />
      ) : (
        ""
      )}
    </div>
  );
}

export default App;
