export interface GalleryImage {
	src: string;
	alt: string;
}

export interface GalleryCollection {
	title: string;
	location: string;
	year: string;
	description: string;
	images: GalleryImage[];
}

export const galleryCollections: GalleryCollection[] = [
	{
		title: "BrodieNation",
		location: "Carnation, WA",
		year: "Summer archive",
		description: "A little gem of a micro music festival, built around big-hearted people and loud guitars.",
		images: [
			{
				src: "https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1400&q=85",
				alt: "Crowd gathered under colorful concert lights",
			},
			{
				src: "https://images.unsplash.com/photo-1524368535928-5b5e00ddc76b?auto=format&fit=crop&w=1000&q=85",
				alt: "Musician performing on stage",
			},
			{
				src: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1000&q=85",
				alt: "Audience watching a live performance",
			},
		],
	},
	{
		title: "Summer Sessions",
		location: "Snoqualmie Valley",
		year: "Live, outside",
		description: "Long evenings, local voices, and the kind of shows that make a town feel smaller.",
		images: [
			{
				src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1400&q=85",
				alt: "Festival crowd with hands raised",
			},
			{
				src: "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?auto=format&fit=crop&w=1000&q=85",
				alt: "People enjoying an outdoor music festival",
			},
			{
				src: "https://images.unsplash.com/photo-1521337581100-8ca9a73a5f79?auto=format&fit=crop&w=1000&q=85",
				alt: "Singer performing into a microphone",
			},
		],
	},
	{
		title: "The Room",
		location: "North Bend & beyond",
		year: "Selected nights",
		description: "The close-up moments: the first note, the last encore, and everything in between.",
		images: [
			{
				src: "https://images.unsplash.com/photo-1540039155733-5bb30b53aa14?auto=format&fit=crop&w=1400&q=85",
				alt: "Performer lit by a warm spotlight",
			},
			{
				src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=1000&q=85",
				alt: "Close view of a live band performing",
			},
			{
				src: "https://images.unsplash.com/photo-1524650359799-842906ca1c06?auto=format&fit=crop&w=1000&q=85",
				alt: "Crowd and stage lights at a concert",
			},
		],
	},
];
