import { gql } from 'urql';

export const CREAT_CERTIFICATES = gql`
  mutation (
    $userId: ID!
    $name: String!
    $issuer: String!
    $origirinalDate: DateTime!
    $expirationDate: DateTime!
    $certUrl: String!
    $blockchainId: String
  ) {
    createCert(
      userId: $userId
      name: $name
      issuer: $issuer
      origirinalDate: $origirinalDate
      expirationDate: $expirationDate
      certUrl: $certUrl
      isPubic: true
      isVerified: false
      blockchainId: $blockchainId
    ) {
      id
      issuer
      name
      blockchainId
      # certUrl
      # createdAt
      # origirinalDate
      # expirationDate
      # isPubic
    }
  }
`;

export const GET_LIST_CERTIFICATES = gql`
  query ($page: Int, $limit: Int, $userId: ID, $issuer: ID) {
    Certs(page: $page, limit: $limit, userId: $userId, issuer: $issuer) {
      count
      pages
      rows {
        id
        issuer
        name
        blockchainId
        # certUrl
        # createdAt
        # origirinalDate
        # expirationDate
        isPubic
        isVerified
      }
    }
  }
`;
export const UPDATE_CERTIFICATES = gql`
  mutation ($ids: [ID!]!, $isVerified: Boolean, $blockchainId: String) {
    updateCert(ids: $ids, isVerified: $isVerified, blockchainId: $blockchainId) {
      ok
    }
  }
`;
