<script>
	import Widget from './Widget.svelte';
</script>
<section>
	<main>
		<header>
			<h1 class="pm0">It comes with a wide collection of widgets</h1>
		</header>
		<div class="widget_list">
			<Widget
				name="Clock"
				description="A simple yet powerful clock. It displays the current time but also enables setting alarms. Great to keep track of your pizza!"
			/>
			<Widget
				name="Weather"
				description="Want to know if you need to bring an umbrella with you? The weather widget provides you with the current weather status as well as a forecast for the next days!"
			/>
			<Widget
				name="Searchbar"
				description="Switching between Search Engines can be hard. This widget represents the solution to that! You'll be able to quickly switch the Search Engine and even get suggestions for your search!"
			/>
		</div>
	</main>
</section>
<style>
	section {
		background: linear-gradient(105deg, var(--widget-list-color), #60817d);
		width: 100%;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	header {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	h1 {
		text-align: center;
		color: var(--landing-color);
		font-size: var(--descriptive-header-fs);
	}

	.widget_list {
		display: flex;
		gap: 4em;
		max-width: 80%;
		padding-top: 4em;
	}

	@media only screen and (max-width: 1220px) {
		.widget_list {
			gap: 2em;
			max-width: 100%;
		}
	}

	@media only screen and (max-width: 905px) {
		section {
			height: fit-content;
			padding: calc(var(--nav-padding) * 2) 0;
		}

		.widget_list {
			flex-direction: column;
			gap: 2em;
		}
	}
</style>