import { afterEach, describe, expect, it, vi } from "vitest";
import {
	getEvents,
	getFeaturedGalleries,
	strapiGraphQL,
	strapiQuery,
} from "./strapi";

describe("Strapi client", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("builds API URLs and returns JSON responses", async () => {
		const response = { data: [{ id: 1 }], meta: { pagination: {} } };
		const fetchMock = vi
			.spyOn(globalThis, "fetch")
			.mockResolvedValue(new Response(JSON.stringify(response), { status: 200 }));

		await expect(
			strapiQuery({
				endpoint: "/events",
				query: { "filters[name][$eq]": "Summer Show" },
			}),
		).resolves.toEqual(response);
		expect(fetchMock).toHaveBeenCalledWith(
			"http://localhost:1337/api/events?filters%5Bname%5D%5B%24eq%5D=Summer+Show",
			expect.objectContaining({ method: "GET" }),
		);
	});

	it("returns an empty response when the REST request fails", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response("Unavailable", { status: 503, statusText: "Unavailable" }),
		);
		vi.spyOn(console, "error").mockImplementation(() => {});

		await expect(strapiQuery({ endpoint: "/events" })).resolves.toEqual({
			data: [],
			meta: {},
		});
	});

	it("returns event data from the common events query", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(JSON.stringify({ data: [{ id: 1 }] }), { status: 200 }),
		);

		await expect(getEvents()).resolves.toEqual([{ id: 1 }]);
	});

	it("normalizes populated featured galleries and media URLs", async () => {
		const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response(
				JSON.stringify({
					data: [
						{
							id: 2,
							title: "BrodieNation",
							images: [
								{
									id: 8,
									name: "stage.jpg",
									url: "/uploads/stage.jpg",
									alternativeText: "BrodieNation on stage",
									formats: {
										medium: { url: "/uploads/medium-stage.jpg" },
										thumbnail: { url: "/uploads/thumb-stage.jpg" },
									},
								},
							],
						},
					],
				}),
				{ status: 200 },
			),
		);

		await expect(getFeaturedGalleries()).resolves.toEqual([
			{
				title: "BrodieNation",
				images: [
					{
						id: 8,
						name: "stage.jpg",
						alt: "BrodieNation on stage",
						url: "http://localhost:1337/uploads/stage.jpg",
						thumbnailUrl: "http://localhost:1337/uploads/medium-stage.jpg",
					},
				],
			},
		]);
		expect(fetchMock).toHaveBeenCalledWith(
			"http://localhost:1337/api/featured-galleries?populate=*&sort=createdAt%3Aasc",
			expect.objectContaining({ method: "GET" }),
		);
	});

	it("posts GraphQL queries and returns data", async () => {
		const fetchMock = vi
			.spyOn(globalThis, "fetch")
			.mockResolvedValue(
				new Response(JSON.stringify({ data: { events: [] } }), { status: 200 }),
			);

		await expect(
			strapiGraphQL({ query: "query Events", variables: { limit: 10 } }),
		).resolves.toEqual({ events: [] });
		expect(fetchMock).toHaveBeenCalledWith(
			"http://localhost:1337/graphql",
			expect.objectContaining({
				method: "POST",
				body: JSON.stringify({
					query: "query Events",
					variables: { limit: 10 },
				}),
			}),
		);
	});

	it("returns an empty GraphQL data object for HTTP failures", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response("Unavailable", { status: 500, statusText: "Server Error" }),
		);
		vi.spyOn(console, "error").mockImplementation(() => {});

		await expect(strapiGraphQL({ query: "query Events" })).resolves.toEqual({
			data: {},
		});
	});
});
