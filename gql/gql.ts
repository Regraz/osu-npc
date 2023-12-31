/* eslint-disable */
import * as types from './graphql';
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';

/**
 * Map of all GraphQL operations in the project.
 *
 * This map has several performance disadvantages:
 * 1. It is not tree-shakeable, so it will include all operations in the project.
 * 2. It is not minifiable, so the string of a GraphQL query will be multiple times inside the bundle.
 * 3. It does not support dead code elimination, so it will add unused operations.
 *
 * Therefore it is highly recommended to use the babel or swc plugin for production.
 */
const documents = {
    "\n  query queryAuthState {\n    me {\n      id\n      name\n      avatar\n      role\n      disabled\n      voteSlots\n    }\n  }\n": types.QueryAuthStateDocument,
    "\n  mutation logout {\n    logout {\n      id\n      name\n      avatar\n      role\n      disabled\n      voteSlots\n    }\n  }\n": types.LogoutDocument,
    "\n  query findUser($name: String!) {\n    user(name: $name) {\n      id\n      name\n      avatar\n      role\n      disabled\n      votes {\n        song {\n          title\n        }\n      }\n      nominatedSongs {\n        title\n      }\n    }\n  }\n": types.FindUserDocument,
    "\n  mutation banUser($userId: ID!) {\n    banUser(userId: $userId) {\n      id\n      name\n      disabled\n    }\n  }\n": types.BanUserDocument,
    "\n  mutation unbanUser($userId: ID!) {\n    unbanUser(userId: $userId) {\n      id\n      name\n      disabled\n    }\n  }\n": types.UnbanUserDocument,
    "\n  mutation giveUserRole($userId: ID!, $role: UserRole!) {\n    giveUserRole(userId: $userId, role: $role) {\n      id\n      name\n      role\n    }\n  }\n": types.GiveUserRoleDocument,
    "\n  mutation removeUserRole($userId: ID!, $role: UserRole!) {\n    removeUserRole(userId: $userId, role: $role) {\n      id\n      name\n      role\n    }\n  }\n": types.RemoveUserRoleDocument,
    "\n  query fetchSongs{\n    songs {\n      id\n      title\n      artist\n      url\n      votes {\n        user {\n          id\n          name\n        }\n      }\n    }\n  }\n": types.FetchSongsDocument,
    "\n  mutation voteSong($songId: ID!) {\n    voteSong(songId: $songId) {\n      song {\n        id\n        title\n        artist\n        url\n        votes {\n          user {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n": types.VoteSongDocument,
    "\n  mutation unvoteSong($songId: ID!) {\n    unvoteSong(songId: $songId) {\n      song {\n        id\n        title\n        artist\n        url\n        votes {\n          user {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n": types.UnvoteSongDocument,
    "\n  mutation nominateAndVote(\n    $artist: String!\n    $title: String!\n    $url: String!\n  ) {\n    nominateAndVoteSong(\n      songArtist: $artist\n      songTitle: $title\n      songUrl: $url\n    ) {\n      song {\n        id\n        title\n        artist\n        url\n        votes {\n          user {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n": types.NominateAndVoteDocument,
    "\n  mutation removeSongAdmin($songIds: [ID!]!) {\n    removeSong(songIds: $songIds) {\n      id\n      title\n      artist\n      url\n      votes {\n        user {\n          id\n          name\n        }\n      }\n    }\n  }\n": types.RemoveSongAdminDocument,
};

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 *
 *
 * @example
 * ```ts
 * const query = graphql(`query GetUser($id: ID!) { user(id: $id) { name } }`);
 * ```
 *
 * The query argument is unknown!
 * Please regenerate the types.
 */
export function graphql(source: string): unknown;

/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query queryAuthState {\n    me {\n      id\n      name\n      avatar\n      role\n      disabled\n      voteSlots\n    }\n  }\n"): (typeof documents)["\n  query queryAuthState {\n    me {\n      id\n      name\n      avatar\n      role\n      disabled\n      voteSlots\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation logout {\n    logout {\n      id\n      name\n      avatar\n      role\n      disabled\n      voteSlots\n    }\n  }\n"): (typeof documents)["\n  mutation logout {\n    logout {\n      id\n      name\n      avatar\n      role\n      disabled\n      voteSlots\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query findUser($name: String!) {\n    user(name: $name) {\n      id\n      name\n      avatar\n      role\n      disabled\n      votes {\n        song {\n          title\n        }\n      }\n      nominatedSongs {\n        title\n      }\n    }\n  }\n"): (typeof documents)["\n  query findUser($name: String!) {\n    user(name: $name) {\n      id\n      name\n      avatar\n      role\n      disabled\n      votes {\n        song {\n          title\n        }\n      }\n      nominatedSongs {\n        title\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation banUser($userId: ID!) {\n    banUser(userId: $userId) {\n      id\n      name\n      disabled\n    }\n  }\n"): (typeof documents)["\n  mutation banUser($userId: ID!) {\n    banUser(userId: $userId) {\n      id\n      name\n      disabled\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation unbanUser($userId: ID!) {\n    unbanUser(userId: $userId) {\n      id\n      name\n      disabled\n    }\n  }\n"): (typeof documents)["\n  mutation unbanUser($userId: ID!) {\n    unbanUser(userId: $userId) {\n      id\n      name\n      disabled\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation giveUserRole($userId: ID!, $role: UserRole!) {\n    giveUserRole(userId: $userId, role: $role) {\n      id\n      name\n      role\n    }\n  }\n"): (typeof documents)["\n  mutation giveUserRole($userId: ID!, $role: UserRole!) {\n    giveUserRole(userId: $userId, role: $role) {\n      id\n      name\n      role\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation removeUserRole($userId: ID!, $role: UserRole!) {\n    removeUserRole(userId: $userId, role: $role) {\n      id\n      name\n      role\n    }\n  }\n"): (typeof documents)["\n  mutation removeUserRole($userId: ID!, $role: UserRole!) {\n    removeUserRole(userId: $userId, role: $role) {\n      id\n      name\n      role\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  query fetchSongs{\n    songs {\n      id\n      title\n      artist\n      url\n      votes {\n        user {\n          id\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  query fetchSongs{\n    songs {\n      id\n      title\n      artist\n      url\n      votes {\n        user {\n          id\n          name\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation voteSong($songId: ID!) {\n    voteSong(songId: $songId) {\n      song {\n        id\n        title\n        artist\n        url\n        votes {\n          user {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation voteSong($songId: ID!) {\n    voteSong(songId: $songId) {\n      song {\n        id\n        title\n        artist\n        url\n        votes {\n          user {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation unvoteSong($songId: ID!) {\n    unvoteSong(songId: $songId) {\n      song {\n        id\n        title\n        artist\n        url\n        votes {\n          user {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation unvoteSong($songId: ID!) {\n    unvoteSong(songId: $songId) {\n      song {\n        id\n        title\n        artist\n        url\n        votes {\n          user {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation nominateAndVote(\n    $artist: String!\n    $title: String!\n    $url: String!\n  ) {\n    nominateAndVoteSong(\n      songArtist: $artist\n      songTitle: $title\n      songUrl: $url\n    ) {\n      song {\n        id\n        title\n        artist\n        url\n        votes {\n          user {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation nominateAndVote(\n    $artist: String!\n    $title: String!\n    $url: String!\n  ) {\n    nominateAndVoteSong(\n      songArtist: $artist\n      songTitle: $title\n      songUrl: $url\n    ) {\n      song {\n        id\n        title\n        artist\n        url\n        votes {\n          user {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n"];
/**
 * The graphql function is used to parse GraphQL queries into a document that can be used by GraphQL clients.
 */
export function graphql(source: "\n  mutation removeSongAdmin($songIds: [ID!]!) {\n    removeSong(songIds: $songIds) {\n      id\n      title\n      artist\n      url\n      votes {\n        user {\n          id\n          name\n        }\n      }\n    }\n  }\n"): (typeof documents)["\n  mutation removeSongAdmin($songIds: [ID!]!) {\n    removeSong(songIds: $songIds) {\n      id\n      title\n      artist\n      url\n      votes {\n        user {\n          id\n          name\n        }\n      }\n    }\n  }\n"];

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;