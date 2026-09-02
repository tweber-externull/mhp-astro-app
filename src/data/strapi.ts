interface StrapiQueryParams {
  endpoint: string;
  query?: Record<string, any>;
  method?: "GET" | "POST" | "PUT" | "DELETE";
}

const STRAPI_URL = (
  import.meta.env.STRAPI_URL || "http://localhost:1337"
).replace(/\/+$/, "");
const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN;

export interface FeaturedGalleryImage {
  id: number;
  name: string;
  alt: string;
  url: string;
  thumbnailUrl: string;
}

export interface FeaturedGallery {
  title: string;
  images: FeaturedGalleryImage[];
}

export async function strapiQuery({
  endpoint,
  query = {},
  method = "GET",
}: StrapiQueryParams) {
  const queryString = new URLSearchParams(query).toString();
  const url = `${STRAPI_URL}/api${endpoint}${
    queryString ? `?${queryString}` : ""
  }`;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (STRAPI_API_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  try {
    const res = await fetch(url, {
      method,
      headers,
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error(`Strapi API Error: ${res.status} ${res.statusText}`);
      console.error(`URL: ${url}`);
      console.error(`Response: ${errorText}`);
      return { data: [], meta: {} };
    }

    const json = await res.json();
    return json;
  } catch (error) {
    console.error(`Strapi connection error:`, error);
    console.error(`Attempted URL: ${url}`);
    console.error(`Make sure Strapi is running and the content type exists`);
    return { data: [], meta: {} };
  }
}

// GraphQL query function for Strapi GraphQL plugin
interface StrapiGraphQLParams {
  query: string;
  variables?: Record<string, any>;
}

export async function strapiGraphQL({
  query,
  variables = {},
}: StrapiGraphQLParams) {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (STRAPI_API_TOKEN) {
    headers["Authorization"] = `Bearer ${STRAPI_API_TOKEN}`;
  }

  const res = await fetch(`${STRAPI_URL}/graphql`, {
    method: "POST",
    headers,
    body: JSON.stringify({
      query,
      variables,
    }),
  });

  if (!res.ok) {
    console.error(`Strapi GraphQL Error: ${res.status} ${res.statusText}`);
    return { data: {} };
  }

  const { data, errors } = await res.json();

  if (errors) {
    console.error("GraphQL Errors:", errors);
  }

  return data || {};
}

// Helper functions for common queries
export async function getEvents() {
  const response = await strapiQuery({
    endpoint: "/events",
    query: {},
  });
  console.log("Events response:", response);
  return response.data || [];
}

export async function getVenues() {
  return strapiQuery({
    endpoint: "/venues",
  });
}

export async function getArtists() {
  return strapiQuery({
    endpoint: "/artists",
  });
}

function getMediaUrl(url: string) {
  if (url.startsWith("http://") || url.startsWith("https://")) {
    return url;
  }

  return `${STRAPI_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function getFeaturedGalleries(): Promise<FeaturedGallery[]> {
  const response = await strapiQuery({
    endpoint: "/featured-galleries",
    query: {
      "populate[images]": "*",
      sort: "createdAt:asc",
    },
  });

  const records = Array.isArray(response.data) ? response.data : [];
  const galleries: FeaturedGallery[] = [];

  for (const record of records) {
    const galleryData = record?.attributes || record;
    const title =
      typeof galleryData?.title === "string"
        ? galleryData.title
        : "Featured Gallery";
    const rawImages = galleryData?.images?.data || galleryData?.images || [];
    const images: FeaturedGalleryImage[] = [];

    for (const rawImage of rawImages) {
      const file = rawImage?.attributes || rawImage;
      if (!file || typeof file.url !== "string") {
        continue;
      }

      const thumbnailUrl =
        typeof file.formats?.thumbnail?.url === "string"
          ? file.formats.thumbnail.url
          : file.url;

      images.push({
        id: Number(file.id || rawImage.id),
        name:
          typeof file.name === "string" ? file.name : "Featured gallery image",
        alt:
          typeof file.alternativeText === "string" && file.alternativeText
            ? file.alternativeText
            : typeof file.caption === "string" && file.caption
              ? file.caption
              : typeof file.name === "string"
                ? file.name
                : "Featured gallery image",
        url: getMediaUrl(file.url),
        thumbnailUrl: getMediaUrl(thumbnailUrl),
      });
    }

    if (images.length === 0) {
      continue;
    }

    galleries.push({
      title,
      images,
    });
  }

  return galleries;
}
