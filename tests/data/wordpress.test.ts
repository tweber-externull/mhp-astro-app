import { afterEach, describe, expect, it, vi } from "vitest";
import { wpquery } from "../../src/data/wordpress";

describe("wpquery", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("sends the GraphQL query and returns response data", async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			new Response(JSON.stringify({ data: { posts: [{ id: 1 }] } }), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			}),
		);
		vi.stubGlobal("fetch", fetchMock);

		const result = await wpquery({
			query: "query Posts { posts { id } }",
			variables: { limit: 1 },
		});

		expect(result).toEqual({ posts: [{ id: 1 }] });
		expect(fetchMock).toHaveBeenCalledWith(
			"https://admin.morganhenleypresents.com/graphql",
			{
				method: "post",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					query: "query Posts { posts { id } }",
					variables: { limit: 1 },
				}),
			},
		);
	});

	it("returns an empty object when the request fails", async () => {
		const fetchMock = vi.fn().mockResolvedValue(
			new Response("Unavailable", { status: 503 }),
		);
		vi.stubGlobal("fetch", fetchMock);
		vi.spyOn(console, "error").mockImplementation(() => {});

		await expect(wpquery({ query: "query Posts { posts { id } }" })).resolves
			.toEqual({});
	});
});
