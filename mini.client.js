/* eslint-disable */

/**
 * @typedef {object} MiniCmsCollectionDefinition
 * @property {string | null} id
 * @property {string} name
 * @property {string} slug
 */

/**
 * @typedef {object} ProjectsItem
 * @property {string} name
 * @property {string} description_en
 * @property {string} description_fr
 * @property {string} tech_used
 * @property {string} status_en
 * @property {string} status_fr
 * @property {string} github_link
 */

/** @typedef {"projects"} MiniCmsCollectionSlug */

/**
 * @typedef {object} MiniCmsCollectionMap
 *   "projects": ProjectsItem;
 */

/**
 * @typedef {object} MiniCmsDefaultFields
 * @property {string} _id
 * @property {boolean} _published
 */

/**
 * @template T
 * @typedef {object} MiniCmsColllectionItemData
 * @property {T & MiniCmsDefaultFields} data
 * @property {string} id
 * @property {Date} createdAt
 * @property {Date} updatedAt
 */

/** @template {MiniCmsCollectionSlug} TSlug @typedef {MiniCmsColllectionItemData<MiniCmsCollectionMap[TSlug]>} MiniCmsCollectionItem */

/**
 * @typedef {object} MiniCmsClientConfig
 * @property {string} [baseUrl]
 * @property {string} [workspaceId]
 * @property {string} [projectId]
 */

/** @typedef {Record<string, string | number | boolean | null | undefined>} MiniCmsQueryFilters */

/**
 * @template {MiniCmsCollectionSlug} TSlug
 * @typedef {object} MiniCmsGetCollectionItemsOptions
 * @property {string} [collectionId]
 * @property {string} [workspaceId]
 * @property {string} [projectId]
 * @property {number} [page]
 * @property {number} [limit]
 * @property {string} [query]
 * @property {MiniCmsQueryFilters} [filters]
 * @property {HeadersInit} [headers]
 */

/**
 * @template {MiniCmsCollectionSlug} TSlug
 * @typedef {object} MiniCmsCollectionItemsResponse
 * @property {{ id: string, slug: string, name: string }} workspace
 * @property {{ id: string, slug: string, name: string }} project
 * @property {MiniCmsCollectionDefinition & { slug: TSlug, description?: string | null, schema?: Array<{ key: string, label: string, type: string }> }} collection
 * @property {Array<MiniCmsCollectionItem<TSlug> >} items
 * @property {{ page: number, limit: number, total: number, totalPages: number, hasMore: boolean }} pagination
 */

/** @type {MiniCmsClientConfig} */
const defaultConfig = {
  baseUrl: "https://mini-cms.lakubudavid.me",
  workspaceId: "jHlwWJEXcYz62SSJNfkoU1CthfV73agR",
  projectId: "oOWqMNozTbs5UXwZKW_Nb",
};

/** @type {MiniCmsCollectionDefinition[]} */
const collections = 
[
  {
    "id": null,
    "name": "Previous Projects",
    "slug": "projects"
  }
] ;

/** @returns {MiniCmsCollectionDefinition[]} */
export function getMiniCmsCollections() {
  return collections.slice();
}

/**
 * @param {MiniCmsClientConfig} [overrides={}]
 */
export function createMiniCmsClient(overrides = {}) {
  const runtimeConfig = { ...defaultConfig, ...overrides };
  const collections = {
    projects: { query: (options = {}) => getCollectionItems("projects", options) },
  };

  return {
    config: runtimeConfig,
    collectionDefinitions: getMiniCmsCollections(),
    collections,
    /**
     * @template {MiniCmsCollectionSlug} TSlug
     * @param {TSlug} collectionSlug
     * @param {MiniCmsGetCollectionItemsOptions<TSlug>} [options={}]
     * @returns {Promise<MiniCmsCollectionItemsResponse<TSlug>>}
     */
    getCollectionItems,
  };

  async function getCollectionItems(collectionSlug, options = {}) {
      const workspaceId = options?.workspaceId ?? runtimeConfig.workspaceId;
      const projectId = options?.projectId ?? runtimeConfig.projectId;

      if (!runtimeConfig.baseUrl || !workspaceId || !projectId || !collectionSlug) {
      throw new Error("baseUrl, workspaceId, projectId, and collectionSlug are required.");
      }

      const url = new URL('/api/collections/items', ensureTrailingSlash(runtimeConfig.baseUrl));
      url.searchParams.set('w', workspaceId);
      url.searchParams.set('p', projectId);

      if (options?.collectionId) {
        url.searchParams.set('collection_id', options.collectionId);
      } else {
        url.searchParams.set('collection_slug', collectionSlug);
      }

      if (options?.page != null) url.searchParams.set('page', String(options.page));
      if (options?.limit != null) url.searchParams.set('limit', String(options.limit));
      if (options?.query) url.searchParams.set('q', options.query);

      if (options?.filters) {
        for (const [key, value] of Object.entries(options.filters)) {
          if (value == null || value === '') continue;
          url.searchParams.set(`filter.${key}`, String(value));
        }
      }

      const response = await fetch(url.toString(), {
        headers: options?.headers ?? {},
      });

      if (!response.ok) {
        const message = await readMiniCmsError(response);
        throw new Error(message);
      }

      const payload = await response.json();

      return {
        ...payload,
        items: Array.isArray(payload?.items)
          ? payload.items.map((item) => ({
              ...item,
              createdAt: new Date(item.createdAt),
              updatedAt: new Date(item.updatedAt),
            }))
          : [],
      };
    }
}

/**
 * @param {Response} response
 * @returns {Promise<string>}
 */
async function readMiniCmsError(response) {
  try {
    const body = await response.json();
    return body?.error ?? `Request failed with status ${response.status}.`;
  } catch {
    return `Request failed with status ${response.status}.`;
  }
}

/**
 * @param {string} baseUrl
 * @returns {string}
 */
function ensureTrailingSlash(baseUrl) {
  return baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
}

export { defaultConfig as miniCmsConfig };
