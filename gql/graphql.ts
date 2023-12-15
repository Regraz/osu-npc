/* eslint-disable */
import type { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** A date-time string at UTC, such as 2007-12-03T10:15:30Z, compliant with the `date-time` format outlined in section 5.6 of the RFC 3339 profile of the ISO 8601 standard for representation of dates and times using the Gregorian calendar. */
  Date: { input: Date | string; output: Date | string; }
};

export type Mutation = {
  logout?: Maybe<User>;
  nominateAndVoteSong?: Maybe<Vote>;
  unvoteSong?: Maybe<Vote>;
  voteSong?: Maybe<Vote>;
};


export type MutationNominateAndVoteSongArgs = {
  songArtist: Scalars['String']['input'];
  songTitle: Scalars['String']['input'];
  songUrl: Scalars['String']['input'];
};


export type MutationUnvoteSongArgs = {
  songId: Scalars['ID']['input'];
};


export type MutationVoteSongArgs = {
  songId: Scalars['ID']['input'];
};

export type Query = {
  me?: Maybe<User>;
  songs: Array<Song>;
};

export type Song = {
  artist: Scalars['String']['output'];
  categories: Array<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  nominatedBy?: Maybe<User>;
  title: Scalars['String']['output'];
  url: Scalars['String']['output'];
  votes: Array<Vote>;
};

export type User = {
  avatar?: Maybe<Scalars['String']['output']>;
  disabled?: Maybe<Scalars['Boolean']['output']>;
  id: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  role: Array<UserRole>;
  voteSlots?: Maybe<Scalars['Int']['output']>;
  votes: Array<Vote>;
};

export enum UserRole {
  Contestant = 'contestant',
  Judge = 'judge',
  Staff = 'staff'
}

export type Vote = {
  createAt: Scalars['Date']['output'];
  song: Song;
  user: User;
};

export type QueryAuthStateQueryVariables = Exact<{ [key: string]: never; }>;


export type QueryAuthStateQuery = { me?: { id: string, name?: string | null, avatar?: string | null, role: Array<UserRole>, disabled?: boolean | null, voteSlots?: number | null } | null };

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = { logout?: { id: string, name?: string | null, avatar?: string | null, role: Array<UserRole>, disabled?: boolean | null, voteSlots?: number | null } | null };

export type FetchSongsQueryVariables = Exact<{ [key: string]: never; }>;


export type FetchSongsQuery = { songs: Array<{ id: string, title: string, artist: string, url: string, votes: Array<{ user: { id: string, name?: string | null } }> }> };

export type VoteSongMutationVariables = Exact<{
  songId: Scalars['ID']['input'];
}>;


export type VoteSongMutation = { voteSong?: { song: { id: string, title: string, artist: string, url: string, votes: Array<{ user: { id: string, name?: string | null } }> } } | null };

export type UnvoteSongMutationVariables = Exact<{
  songId: Scalars['ID']['input'];
}>;


export type UnvoteSongMutation = { unvoteSong?: { song: { id: string, title: string, artist: string, url: string, votes: Array<{ user: { id: string, name?: string | null } }> } } | null };

export type NominateAndVoteMutationVariables = Exact<{
  artist: Scalars['String']['input'];
  title: Scalars['String']['input'];
  url: Scalars['String']['input'];
}>;


export type NominateAndVoteMutation = { nominateAndVoteSong?: { song: { id: string, title: string, artist: string, url: string, votes: Array<{ user: { id: string, name?: string | null } }> } } | null };


export const QueryAuthStateDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"queryAuthState"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"me"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"disabled"}},{"kind":"Field","name":{"kind":"Name","value":"voteSlots"}}]}}]}}]} as unknown as DocumentNode<QueryAuthStateQuery, QueryAuthStateQueryVariables>;
export const LogoutDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"logout"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}},{"kind":"Field","name":{"kind":"Name","value":"avatar"}},{"kind":"Field","name":{"kind":"Name","value":"role"}},{"kind":"Field","name":{"kind":"Name","value":"disabled"}},{"kind":"Field","name":{"kind":"Name","value":"voteSlots"}}]}}]}}]} as unknown as DocumentNode<LogoutMutation, LogoutMutationVariables>;
export const FetchSongsDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"query","name":{"kind":"Name","value":"fetchSongs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"songs"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"artist"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"votes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]} as unknown as DocumentNode<FetchSongsQuery, FetchSongsQueryVariables>;
export const VoteSongDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"voteSong"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"songId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"voteSong"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"songId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"songId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"song"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"artist"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"votes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<VoteSongMutation, VoteSongMutationVariables>;
export const UnvoteSongDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"unvoteSong"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"songId"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"ID"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"unvoteSong"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"songId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"songId"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"song"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"artist"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"votes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<UnvoteSongMutation, UnvoteSongMutationVariables>;
export const NominateAndVoteDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"nominateAndVote"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"artist"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"title"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"url"}},"type":{"kind":"NonNullType","type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"nominateAndVoteSong"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"songArtist"},"value":{"kind":"Variable","name":{"kind":"Name","value":"artist"}}},{"kind":"Argument","name":{"kind":"Name","value":"songTitle"},"value":{"kind":"Variable","name":{"kind":"Name","value":"title"}}},{"kind":"Argument","name":{"kind":"Name","value":"songUrl"},"value":{"kind":"Variable","name":{"kind":"Name","value":"url"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"song"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"title"}},{"kind":"Field","name":{"kind":"Name","value":"artist"}},{"kind":"Field","name":{"kind":"Name","value":"url"}},{"kind":"Field","name":{"kind":"Name","value":"votes"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"user"},"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}},{"kind":"Field","name":{"kind":"Name","value":"name"}}]}}]}}]}}]}}]}}]} as unknown as DocumentNode<NominateAndVoteMutation, NominateAndVoteMutationVariables>;