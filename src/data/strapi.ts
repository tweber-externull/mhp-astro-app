interface StrapiQueryParams {
	endpoint: string;
	query?: Record<string, string | number | boolean>;
	method?: "GET" | "POST" | "PUT" | "DELETE";
}

const STRAPI_URL = (
	import.meta.env.STRAPI_URL || "http://localhost:1337"
).replace(/\/+$/, "");
const STRAPI_API_TOKEN = import.meta.env.STRAPI_API_TOKEN;

function getHeaders() {
	const headers: Record<string, string> = {
		"Content-Type": "application/json",
	};

	if (STRAPI_API_TOKEN) {
		headers.Authorization = "Bearer " + STRAPI_API_TOKEN;
	}

	return headers;
}

export async function strapiQuery({
	endpoint,
	query = {},
	method = "GET",
}: StrapiQueryParams) {
	const queryString = new URLSearchParams(
		Object.entries(query).map(([key, value]) => [key, String(value)]),
	).toString();
	const url = `${STRAPI_URL}/api${endpoint}${
		queryString ? `?${queryString}` : ""
	}`;

	try {
		const res = await fetch(url, {
			method,
			headers: getHeaders(),
		});

		if (!res.ok) {
			const errorText = await res.text();
			console.error(`Strapi API Error: ${res.status} ${res.statusText}`);
			console.error(`URL: ${url}`);
			console.error(`Response: ${errorText}`);
			return { data: [], meta: {} };
		}

		return await res.json();
	} catch (error) {
		console.error("Strapi connection error:", error);
		console.error(`Attempted URL: ${url}`);
		console.error("Make sure Strapi is running and the content type exists");
		return { data: [], meta: {} };
	}
}

interface StrapiGraphQLParams {
	query: string;
	variables?: Record<string, unknown>;
}

export async function strapiGraphQL({
	query,
	variables = {},
}: StrapiGraphQLParams) {
	const res = await fetch(`${STRAPI_URL}/graphql`, {
		method: "POST",
		headers: getHeaders(),
		body: JSON.stringify({ query, variables }),
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

export async function getEvents() {
	const response = await strapiQuery({
		endpoint: "/events",
	});
	console.log("Events response:", response);
	return response.data || [];
}

export function getVenues() {
	return strapiQuery({ endpoint: "/venues" });
}

export function getArtists() {
	return strapiQuery({ endpoint: "/artists" });
}
