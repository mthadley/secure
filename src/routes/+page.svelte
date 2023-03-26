<script>
	let count = 0;

	count.toString();
</script>

<h1>Welcome to SvelteKit</h1>
<p>Visit <a href="https://kit.svelte.dev">kit.svelte.dev</a> to read the documentation</p>

<div class:danger={count > 5}>{count}</div>

<button on:click={() => count++}>increment</button>

<style>
	.danger {
		color: red;
	}
</style>
