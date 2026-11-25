import { afterEach, describe, expect, it, vi } from "vitest";
import { wpquery } from "./wordpress";

describe("WordPress client", () => {
	afterEach(() => {
		vi.restoreAllMocks();
	});

	it("posts a GraphQL query and returns its data", async () => {
		const fetchMock = vi
			.spyOn(globalThis, "fetch")
			.mockResolvedValue(
				new Response(JSON.stringify({ data: { pages: [] } }), { status: 200 }),
			);

		await expect(
			wpquery({ query: "query Pages", variables: { first: 5 } }),
		).resolves.toEqual({ pages: [] });
		expect(fetchMock).toHaveBeenCalledWith(
			"https://admin.morganhenleypresents.com/graphql",
			expect.objectContaining({
				method: "post",
				body: JSON.stringify({
					query: "query Pages",
					variables: { first: 5 },
				}),
			}),
		);
	});

	it("returns an empty object when the request fails", async () => {
		vi.spyOn(globalThis, "fetch").mockResolvedValue(
			new Response("Unavailable", { status: 500 }),
		);
		vi.spyOn(console, "error").mockImplementation(() => {});

		await expect(wpquery({ query: "query Pages" })).resolves.toEqual({});
	});
});
