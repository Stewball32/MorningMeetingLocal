<script lang="ts">
	interface SquiggleProps {
		class?: string;
		type?: 'n' | 'w';
	}

	let { class: svgClass = '', type = 'n' }: SquiggleProps = $props();
</script>
