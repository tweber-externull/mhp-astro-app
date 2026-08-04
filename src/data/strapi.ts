interface StrapiQueryParams {
  endpoint: string;
  query?: Record<string, any>;
  method?: "GET" | "POST" | "PUT" | "DELETE";
}

const STRAPI_URL = import.meta.env.STRAPI_URL || "http://localhost:1337";
const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN;

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
