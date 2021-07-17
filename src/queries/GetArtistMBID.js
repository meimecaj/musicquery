import { gql } from "@apollo/client";

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

export default GetArtistMBID;