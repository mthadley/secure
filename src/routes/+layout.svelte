<header>
	<h1>Secret</h1>
</header>

<main>
	<slot />
</main>

<footer>
	<a href="/">Encrypt</a>
</footer>

<style>
	:global(body) {
		background-color: #e5e5e5;
		color: #444;
		font-size: 16px;
		margin: 0 auto;
		max-width: 400px;
		display: flex;
		flex-direction: column;
		min-height: 100vh;

		font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto,
			Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
			'Segoe UI Symbol';
	}

	h1 {
		text-align: center;
		margin-bottom: 48px;
	}

	main {
		flex-grow: 1;
	}

	footer {
		color: #bbb;
		font-size: 12px;
		text-align: center;
		padding: 20px;
	}

	footer a {
		text-decoration: none;
	}
</style>
