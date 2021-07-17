import { gql } from "@apollo/client";

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

export default GetAlbumSongs;