<script lang="ts">
	interface BannerProps {
		width?: number;
		height?: number;
		colors?: string[];
		shapes?: 'triangles' | 'burgees' | 'circles' | 'crosses' | 'pentagons';
		numberOfShapes?: number;
		class?: string;
	}

	let {
		width = 1000,
		height = 300,
		colors = [
			'rgb(241,152,197)',
			'rgb(242,184,126)',
			'rgb(250,231,127)',
			'rgb(143,221,239)',
			'rgb(221,178,213)',
			'rgb(205,234,157)'
		],
		shapes = 'triangles' as keyof typeof paths,
		numberOfShapes = 10,
		class: svgClass = ''
	} = $props();

	const manualShapeScale = 0.88;
	const hWratio = Math.min(manualShapeScale, height / width);

	const BaseShapeWidth = width * 0.1;
	const baseShapeHeight = width * 0.14;
	const baseStrokeWidth = width * 0.01;
	const baseStringX = 0;
	const baseStringY = 0;
	const baseStringStart: [number, number] = [baseStringX, baseStringY];
	const baseStringEnd: [number, number] = [width - baseStringX, baseStringY];

	const bezierWidth = width * 0.5;
	const bezierHeight = height * 0.9;

	//–– your existing reactive scale for triangles & string ––
	let shapeScale = $state(1);
	let outlineWidth = $state(baseStrokeWidth);
	let stringX = $state(baseStringX);
	let stringY = $state(baseStringY);

	$effect(() => {
		const d = stringPath(baseStringStart, baseStringEnd, false);
		const tmp = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		tmp.setAttribute('d', d);
		const total = tmp.getTotalLength();
		const segLen = numberOfShapes > 0 ? total / numberOfShapes : total;

		shapeScale = Math.min(1, segLen / BaseShapeWidth);
		outlineWidth = baseStrokeWidth * shapeScale * 2.4;
		stringX = baseStringX + (baseShapeHeight + outlineWidth) * hWratio * shapeScale;
		stringY = baseStringY + outlineWidth;
	});

	const baseShadowOffset = 10;
	const baseShadowBlur = 10;
	let shadowOffset = $state(baseShadowOffset);
	let shadowBlur = $state(baseShadowBlur);
	$effect(() => {
		shadowOffset = baseShadowOffset * shapeScale;
		shadowBlur = baseShadowBlur * shapeScale;
	});

	let stringStart: [number, number] = $derived([stringX, stringY]);
	const stringBezier = [bezierWidth, bezierHeight];
	let stringEnd: [number, number] = $derived([width - stringX, stringY]);

	let viewWidth = width;
	let viewHeight = $derived(
		(stringY + bezierHeight) / 2 + shapeScale * (baseShapeHeight + outlineWidth)
	);

	let viewBox = $derived(`0 0 ${viewWidth} ${viewHeight}`);

	function stringPath(start: [number, number], end: [number, number], withCurves = true): string {
		const [x1, y1] = start;
		const [x2, y2] = end;
		const e = width * 0.0002; // rounded endpoints
		const startPt = `${x1} ${y1}`;
		const c1 = `${x1 - e} ${y1 - e} ${x1 - e} ${y1 - e} ${x1} ${y1}`;
		const midQ = `${stringBezier.join(' ')}`;
		const endPt = `${x2} ${y2}`;
		const c2 = `${x2 + e} ${y2 - e} ${x2 + e} ${y2 - e} ${x2} ${y2}`;

		return withCurves
			? `M ${startPt} C ${c1} Q ${midQ} ${endPt} C ${c2}`
			: `M ${startPt} Q ${midQ} ${endPt}`;
	}

	const shapeAnchorCoords = (
		start: [number, number],
		end: [number, number]
	): [number, number, number][] => {
		const d = stringPath(start, end, false);
		const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
		path.setAttribute('d', d);

		const total = path.getTotalLength();
		const delta = 0.01;
		const pts: [number, number, number][] = [];

		for (let i = 0; i < numberOfShapes; i++) {
			const t = numberOfShapes === 1 ? 0.5 : (i + 0.5) / numberOfShapes;
			const L = t * total;
			const { x, y } = path.getPointAtLength(L);

			const p1 = path.getPointAtLength(Math.max(0, L - delta));
			const p2 = path.getPointAtLength(Math.min(total, L + delta));
			const angle = (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;

			pts.push([x, y, angle]);
		}
		return pts;
	};

	let drawnShapeScale = $derived(shapeScale * manualShapeScale);

	const trianglePath = (x: number, y: number) => {
		const w = BaseShapeWidth * drawnShapeScale;
		const h = baseShapeHeight * drawnShapeScale;

		return `
    M ${x} ${y}
    L ${x - w / 2} ${y}
    L ${x}       ${y + h}
    L ${x + w / 2} ${y}
    Z
  `;
	};

	const burgeePath = (x: number, y: number) => {
		const w = BaseShapeWidth * drawnShapeScale;
		const h = baseShapeHeight * drawnShapeScale;
		return `
    M ${x} ${y}
    L ${x - w * 0.45} ${y}
    L ${x - w * 0.5} ${y + h}
    L ${x} ${y + h * 0.7}
    L ${x + w * 0.5} ${y + h}
    L ${x + w * 0.45} ${y}
    Z
  `;
	};

	const crossPath = (x: number, y: number) => {
		const r = BaseShapeWidth * drawnShapeScale; // radius for cross

		return `
    M ${x} ${y}
    L ${x - r} ${y + r}
    A ${r} ${r} 0 0 1 ${x + r} ${y + r}
    Z
  `;
	};

	const semiCircleFlagPath = (x: number, y: number) => {
		const radius = (BaseShapeWidth * drawnShapeScale) / 2;

		return `
    M ${x + radius} ${y}
    A ${radius} ${radius} 0 0 1 ${x - radius} ${y}
    L ${x + radius} ${y}
    Z
  `;
	};

	const pentagonPath = (x: number, y: number) => {
		// baseShapeWidth should be 80, baseShapeHeight should be 100 for this to match the original SVG
		const w = BaseShapeWidth * drawnShapeScale;
		const h = baseShapeHeight * drawnShapeScale;

		// compute left/right top corners
		// const leftX = x - w / 2;
		// const rightX = x + w / 2;

		return `
    M ${x - 0.3 * w}      ${y}
    L ${x - 0.45 * w} ${y + 0.5 * h}
    L ${x}          ${y + h}
    L ${x + 0.45 * w} ${y + 0.5 * h}
    L ${x + 0.3 * w} ${y}
    Z
  `;
	};

	const paths = {
		triangles: trianglePath,
		burgees: burgeePath,
		crosses: crossPath,
		circles: semiCircleFlagPath,
		pentagons: pentagonPath
	};

	const shapePath = paths[shapes] ?? trianglePath;
</script>

<svg
	class={svgClass}
	{viewBox}
	width={viewWidth}
	height={viewHeight}
	fill="green"
	xmlns="http://www.w3.org/2000/svg"
>
	<defs>
		<filter id="accentShadow" x="-50%" y="-50%" width="200%" height="200%">
			<feDropShadow
				dx={shadowOffset}
				dy={shadowOffset}
				stdDeviation={shadowBlur}
				flood-color="rgb(55,45,49)"
				flood-opacity="0.5"
			/>
		</filter>

		<filter id="accentOutline" x="-50%" y="-50%" width="200%" height="200%">
			<!-- 1) expand the shape’s alpha outward by `radius` px -->
			<feMorphology in="SourceAlpha" operator="dilate" radius={shadowOffset} result="dilated" />

			<!-- 2) flood that dilated mask with your shadow color -->
			<feFlood flood-color="rgb(55,45,49)" flood-opacity="0.5" result="flooded" />

			<!-- 3) keep only the flooded area inside the dilated mask -->
			<feComposite in="flooded" in2="dilated" operator="in" result="outline" />

			<!-- 4) draw the outline under the original graphic -->
			<feMerge>
				<feMergeNode in="outline" />
				<feMergeNode in="SourceGraphic" />
			</feMerge>
		</filter>
	</defs>

	<!-- wrap _all_ your outlines + fills in the shadow filter -->
	<g filter="url(#accentShadow)" stroke-linejoin="round">
		<!-- outlines -->
		<path
			d={stringPath(stringStart, stringEnd)}
			fill="none"
			stroke="#fff"
			stroke-width={outlineWidth}
		/>
		{#each shapeAnchorCoords(stringStart, stringEnd) as [x, y, angle], i}
			<path
				d={shapePath(x, y)}
				fill="none"
				stroke="#fff"
				stroke-width={outlineWidth}
				transform={`rotate(${angle}, ${x}, ${y})`}
			/>
		{/each}

		<!-- actual string + triangles -->
		<path
			d={stringPath(stringStart, stringEnd)}
			fill="none"
			stroke="black"
			stroke-width={baseStrokeWidth * shapeScale}
		/>
		{#each shapeAnchorCoords(stringStart, stringEnd) as [x, y, angle], i}
			<path
				d={shapePath(x, y)}
				fill={colors[i % colors.length]}
				stroke="none"
				transform={`rotate(${angle}, ${x}, ${y})`}
			/>
		{/each}
	</g>
</svg>
