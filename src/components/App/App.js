import React, { useState } from "react";
import { useLazyQuery } from "@apollo/client";
import SearchField from "react-search-field";
import FbImageLibrary from "react-fb-image-grid";
import SongListModal from "../SongListModal/SongListModal";
import GetAlbumSongs from "../../queries/GetAlbumSongs";
import GetArtistAlbums from "../../queries/GetArtistAlbums";
import GetArtistMBID from "../../queries/GetArtistMBID";
import "./app.css";

function App() {
  const [albums, setAlbums] = useState({});
  const [images, setImages] = useState([]);
  const [songs, setSongs] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);

  const [loadGetArtistAlbums, { errorAlbum, loadingAlbum }] = useLazyQuery(
    GetArtistAlbums,
    {
      onCompleted: (queriedAlbums) => {
        const albumsToBeSaved = queriedAlbums.lookup.artist.releaseGroups.edges;
        setAlbums(albumsToBeSaved);
        setImages(generateImages(albumsToBeSaved));
      },
    }
  );

  const [loadGetAlbumSongs, { errorSongs, loadingSongs }] = useLazyQuery(
    GetAlbumSongs,
    {
      onCompleted: (queriedSongs) => {
        setSongs(queriedSongs.lookup.release.media);
        setModalOpen(true);
      },
    }
  );

  const [loadGetArtistMBID, { error, loading }] = useLazyQuery(GetArtistMBID, {
    onCompleted: (data) =>
      loadGetArtistAlbums({
        variables: { mbid: data.search.artists.edges[0].node.mbid },
      }),
  });

  if (loadingAlbum || loading || loadingSongs) return <h1>Loading... </h1>;
  if (errorAlbum || error || errorSongs) return <h1>Error...</h1>;

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
    <div className="wrapper">
      <SearchField
        onEnter={onEnter}
        onSearchClick={onSearchClick}
        classNames="search"
        placeholder="Type the artist/band name"
      />
      <div className="grid-wrapper">
        {albums.length > 0 ? (
          <FbImageLibrary
            images={loadImages(images)}
            renderOverlay={() => "See song list"}
            onClickEach={({ src, index }) =>
              loadGetAlbumSongs({
                variables: { mbid: images[index].mbid },
              })
            }
          />
        ) : (
          ""
        )}
      </div>
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
