import { gql } from 'urql';

export const LOGIN_USER_GQL = gql`
  mutation ($email: String!, $password: String!) {
    signInByEmail(email: $email, password: $password) {
      accessToken
    }
  }
`;

export const SIGN_UP_USER_GQL = gql`
  mutation ($email: String!, $fullName: String!, $password: String!, $roleId: String!) {
    signUp(email: $email, fullName: $fullName, password: $password, roleId: $roleId) {
      ok
    }
  }
`;

export const GET_LIST_ROLES = gql`
  query {
    roles {
      rows {
        id
        name
        code
      }
    }
  }
`;

export const GET_USER_DETAIL = gql`
  query ($id: ID!) {
    user(id: $id) {
      id
      roleObj {
        name
        code
      }
      profile {
        userId
        nickname
        statusMessage
        photoUrl
        backgroundUrl
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_PROFILE = gql`
  query {
    me {
      id
      weight
      roleObj {
        name
        code
      }
      profile {
        userId
        nickname
        statusMessage
        photoUrl
        backgroundUrl
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_LIST_USER = gql`
  query ($page: Int, $limit: Int, $outputRoleCode: String) {
    users(page: $page, limit: $limit, outputRoleCode: $outputRoleCode) {
      count
      pages
      rows {
        id
        roleId
        isVerified
        createdAt
        weight
        roleObj {
          name
          code
        }
        emailCredentials {
          id
          email
        }
        profile {
          userId
          nickname
          statusMessage
          photoUrl
          backgroundUrl
          createdAt
          updatedAt
        }
      }
    }
  }
`;

export const UPDATE_STATUS_USERS = gql`
  mutation ($ids: [ID!]!, $isVerified: Boolean, $weight: Int) {
    updateUser(ids: $ids, isVerified: $isVerified, weight: $weight) {
      ok
    }
  }
`;
