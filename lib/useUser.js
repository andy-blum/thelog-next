import { gql, useMutation, useQuery } from '@apollo/client';

/**
 * Get current user with useUser()
 */
export const CURRENT_USER = gql`
  query {
    authenticatedItem {
      ... on User {
        id
        email
        name
        team {
          id
          espn_id
          name
        }
      }
    }
  }
`;

export function useUser() {
  const { data } = useQuery(CURRENT_USER, {
    fetchPolicy: 'no-cache',
  });
  return data?.authenticatedItem;
}


/**
 * Get login function with useLoginFunction()
 */
export const BEGIN_SESSION = gql`
mutation BEGIN_SESSION (
  $identity: String!,
  $secret: String!
) {
  authenticateUserWithPassword(
    email: $identity,
    password: $secret
  ) {
    ... on UserAuthenticationWithPasswordSuccess {
      item {
        id
        name,
        team {
          name
        }
      }
    }
    ... on UserAuthenticationWithPasswordFailure {
      message
    }
  }
}
`;

export function useLoginFunction() {
  const mutation = useMutation(BEGIN_SESSION, {
    fetchPolicy: 'no-cache',
    refetchQueries: [CURRENT_USER],
    onCompleted: (data) => {console.log('COMPLETED: ', data)},
    onError: (data) => {console.log('ERROR: ', data)},
  });

  return mutation;
}

/**
 * Get logout function with useLogoutFunction()
 */
export const END_SESSION = gql`
  mutation {
    endSession
  }
`

export function useLogoutFunction() {
  const mutation = useMutation(END_SESSION, {
    refetchQueries: [CURRENT_USER],
    onCompleted: (data) => {console.log('COMPLETED: ', data)},
    onError: (data) => {console.log('ERROR: ', data)},
  });

  return mutation;
}
