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
    "\n  query fetchSongs{\n    songs {\n      id\n      title\n      artist\n      url\n      votes {\n        user {\n          id\n          name\n        }\n      }\n    }\n  }\n": types.FetchSongsDocument,
    "\n  mutation voteSong($songId: ID!) {\n    voteSong(songId: $songId) {\n      song {\n        id\n        title\n        artist\n        url\n        votes {\n          user {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n": types.VoteSongDocument,
    "\n  mutation unvoteSong($songId: ID!) {\n    unvoteSong(songId: $songId) {\n      song {\n        id\n        title\n        artist\n        url\n        votes {\n          user {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n": types.UnvoteSongDocument,
    "\n  mutation nominateAndVote(\n    $artist: String!\n    $title: String!\n    $url: String!\n  ) {\n    nominateAndVoteSong(\n      songArtist: $artist\n      songTitle: $title\n      songUrl: $url\n    ) {\n      song {\n        id\n        title\n        artist\n        url\n        votes {\n          user {\n            id\n            name\n          }\n        }\n      }\n    }\n  }\n": types.NominateAndVoteDocument,
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

export function graphql(source: string) {
  return (documents as any)[source] ?? {};
}

export type DocumentType<TDocumentNode extends DocumentNode<any, any>> = TDocumentNode extends DocumentNode<  infer TType,  any>  ? TType  : never;