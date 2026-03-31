/* eslint-disable */

export const workspaceId = "jHlwWJEXcYz62SSJNfkoU1CthfV73agR" as const;

export type CollectionSlug =
  | "projects";

export type ProjectsItem = {
  name: string;
  description_en: string;
  description_fr: string;
  tech_used: string;
  status_en: string;
  status_fr: string;
  github_link: string;
};

export type CollectionMap = {
  "projects": ProjectsItem;
};

type _DefaultFields = {
  _id: string;
  _published: boolean;
};

export type CollectionItemData<T> = {
  data: T & _DefaultFields;
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type CollectionItem<T extends CollectionSlug> = CollectionItemData<CollectionMap[T]>;

