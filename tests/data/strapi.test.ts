import { afterEach, describe, expect, it, vi } from "vitest";
import {
	getArtists,
	getEvents,
	getVenues,
	strapiGraphQL,
	strapiQuery,
} from "../../src/data/strapi";

describe("strapiQuery", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("builds the API URL and returns JSON for a successful request", async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ data: [{ id: 1 }] }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			}),
		);
		vi.stubGlobal("fetch", fetchMock);

		const result = await strapiQuery({
			endpoint: "/events",
			query: { "filters[status][$eq]": "published" },
		});

		expect(result).toEqual({ data: [{ id: 1 }] });
		expect(fetchMock).toHaveBeenCalledWith(
			"http://localhost:1337/api/events?filters%5Bstatus%5D%5B%24eq%5D=published",
			{
				method: "GET",
				headers: { "Content-Type": "application/json" },
			},
		);
	});

	it("supports non-GET methods", async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ data: { id: 1 } }), { status: 200 }),
		);
		vi.stubGlobal("fetch", fetchMock);

		await strapiQuery({
			endpoint: "/events",
			method: "POST",
			query: { title: "Show" },
		});

		expect(fetchMock).toHaveBeenCalledWith(
			"http://localhost:1337/api/events?title=Show",
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
			},
		);
	});

	it("returns an empty Strapi response for HTTP and connection failures", async () => {
		const errorMock = vi.spyOn(console, "error").mockImplementation(() => {});
		const fetchMock = vi
			.fn()
			.mockResolvedValue(new Response("Bad request", { status: 400 }));
		vi.stubGlobal("fetch", fetchMock);

		await expect(strapiQuery({ endpoint: "/events" })).resolves.toEqual({
			data: [],
			meta: {},
		});

		fetchMock.mockRejectedValueOnce(new Error("offline"));
		await expect(strapiQuery({ endpoint: "/events" })).resolves.toEqual({
			data: [],
			meta: {},
		});
		expect(errorMock).toHaveBeenCalled();
	});
});

describe("strapiGraphQL", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("posts a GraphQL query and returns its data", async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ data: { events: [] } }), { status: 200 }),
		);
		vi.stubGlobal("fetch", fetchMock);

		const result = await strapiGraphQL({
			query: "query Events { events { data { id } } }",
			variables: { limit: 10 },
		});

		expect(result).toEqual({ events: [] });
		expect(fetchMock).toHaveBeenCalledWith("http://localhost:1337/graphql", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				query: "query Events { events { data { id } } }",
				variables: { limit: 10 },
			}),
		});
	});

	it("returns an empty data object for an HTTP failure", async () => {
		vi.stubGlobal(
			"fetch",
			vi.fn().mockResolvedValue(new Response("Unavailable", { status: 503 })),
		);
		vi.spyOn(console, "error").mockImplementation(() => {});

		await expect(
			strapiGraphQL({ query: "query Events { events { data { id } } }" }),
		).resolves.toEqual({ data: {} });
	});
});

describe("Strapi query helpers", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("request the corresponding collection endpoints", async () => {
		const fetchMock = vi
			.fn()
			.mockImplementation(() =>
				Promise.resolve(
					new Response(JSON.stringify({ data: [] }), { status: 200 }),
				),
			);
		vi.stubGlobal("fetch", fetchMock);

		await getEvents();
		await getVenues();
		await getArtists();

		expect(fetchMock.mock.calls.map(([url]) => url)).toEqual([
			"http://localhost:1337/api/events",
			"http://localhost:1337/api/venues",
			"http://localhost:1337/api/artists",
		]);
	});
});
