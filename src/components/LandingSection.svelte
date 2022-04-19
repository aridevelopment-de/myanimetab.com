<script>
    import Navbar from './Navbar.svelte';
</script>
<section>
	<Navbar />
	<main>
		<div class="landing_text">
			<h1 class="pm0">MyAnimeTab - A Firefox Startpage for Anime Enjoyers</h1>
			<p>MyAnimeTab is a Firefox addon that replaces the default Startpage with a customizable one.</p>
		</div>
		<div class="landing_image">
			<img src="./3.png" alt="preview">
		</div>
	</main>
</section>
<style>
    section {
		background: linear-gradient(255deg, var(--landing-color) 50%, #6bb7ac 50%);
		width: 100%;
		height: 100vh;
    }

	section > main {
		display: flex;
		align-items: center;
		justify-content: center;
		gap: 7em;
		height: calc(100% - var(--nav-padding) * 4);
	}

	.landing_text > h1 {
		font-size: var(--descriptive-header-fs);
		font-weight: 400;
		line-height: 1.5;
		color: var(--nav-color);
	}

	.landing_text > p {
		font-size: var(--descriptive-body-fs);
		line-height: 1.4;
		max-width: 600px;
		color: var(--nav-color);
	}

	.landing_image {
		display: flex;
		align-items: center;
		justify-content: center;
	}

    @media only screen and (max-width: 1280px) {
		section {
			height: fit-content;
			padding-bottom: calc(var(--nav-padding) * 2);
		}

		section > main {
			margin-top: calc(var(--nav-padding) * 2);
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			gap: 2em;
		}

		.landing_text {
			display: flex;
			flex-direction: column;
			align-items: center;
			justify-content: center;
			text-align: center;
		}
	}

	@media only screen and (max-width: 827px) {
		img {
			width: 100%;
		}
	}
</style>