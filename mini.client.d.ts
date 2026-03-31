export type CollectionSlug = MiniCmsCollectionSlug;

export type MiniCmsCollectionDefinition = {
  id: string | null;
  name: string;
  slug: string;
};

export type MiniCmsCollectionSlug = "projects";

export type ProjectsItem = {
  name: string;
  description_en: string;
  description_fr: string;
  tech_used: string;
  status_en: string;
  status_fr: string;
  github_link: string;
};

export type MiniCmsCollectionMap = {
  "projects": ProjectsItem;
};

type _DefaultFields = {
  _id: string;
  _published: boolean;
};

export type MiniCmsColllectionItemData<T> = {
  data: T & _DefaultFields;
  id: string;
  createdAt: Date;
  updatedAt: Date;
};

export type MiniCmsCollectionItem<T extends MiniCmsCollectionSlug> = MiniCmsColllectionItemData<MiniCmsCollectionMap[T]>;

export type MiniCmsClientConfig = {
  baseUrl?: string;
  workspaceId?: string;
  projectId?: string;
};

export type MiniCmsQueryFilters = Record<string, string | number | boolean | null | undefined>;

export type MiniCmsGetCollectionItemsOptions<TSlug extends MiniCmsCollectionSlug = MiniCmsCollectionSlug> = {
  collectionId?: string;
  workspaceId?: string;
  projectId?: string;
  page?: number;
  limit?: number;
  query?: string;
  filters?: MiniCmsQueryFilters;
  headers?: HeadersInit;
};

export type MiniCmsCollectionItemsResponse<TSlug extends MiniCmsCollectionSlug = MiniCmsCollectionSlug> = {
  workspace: { id: string; slug: string; name: string; };
  project: { id: string; slug: string; name: string; };
  collection: MiniCmsCollectionDefinition & { slug: TSlug; description?: string | null; schema?: Array<{ key: string; label: string; type: string; }>; };
  items: Array<MiniCmsCollectionItem<TSlug> & { order: number; }>;
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
};

export declare const miniCmsConfig: {
  baseUrl: "https://mini-cms.lakubudavid.me";
  workspaceId: "jHlwWJEXcYz62SSJNfkoU1CthfV73agR";
  projectId: "oOWqMNozTbs5UXwZKW_Nb";
};

export declare function getMiniCmsCollections(): MiniCmsCollectionDefinition[];

export declare function createMiniCmsClient(overrides?: MiniCmsClientConfig): {
  config: { baseUrl?: string; workspaceId?: string; projectId?: string; };
  collectionDefinitions: MiniCmsCollectionDefinition[];
  collections: {
  projects: { query(options?: MiniCmsGetCollectionItemsOptions<"projects">): Promise<MiniCmsCollectionItemsResponse<"projects">>; };
  };
  getCollectionItems<TSlug extends MiniCmsCollectionSlug>(collectionSlug: TSlug, options?: MiniCmsGetCollectionItemsOptions<TSlug>): Promise<MiniCmsCollectionItemsResponse<TSlug>>;
};
