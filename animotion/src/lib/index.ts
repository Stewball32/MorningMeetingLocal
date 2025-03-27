
const slideStyleArray = [
	"relative",
	"aspect-[15/9]",
	"max-w-full",
	"rounded-r-3xl",
	"overflow-hidden",
	// Mobile
	"w-[295px]",
	"ml-5",
	// Small
	"sm:w-[585px]",
	"sm:ml-11",
	// Medium
	"md:w-[700px]",
	"md:ml-12",
	// Large
	"lg:w-[940px]",
	"lg:ml-18",
	// Extra Large
	"xl:w-[1170px]",
	"xl:ml-22",
	// 2 Extra Large
	"2xl:w-[1400px]",
	"2xl:ml-24",
]

export const slideStyle = " " + slideStyleArray.join(" ") + " "

// Blue-500 but in hex
export let bgHexColor = "3B82F6"