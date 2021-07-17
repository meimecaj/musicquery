import { gql } from "@apollo/client";

const GetArtistAlbums = gql`
  query GetArtistAlbums($mbid: MBID!) {
    lookup {
      artist(mbid: $mbid) {
        name
        releaseGroups(type: ALBUM, first: 5) {
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

export default GetArtistAlbums;