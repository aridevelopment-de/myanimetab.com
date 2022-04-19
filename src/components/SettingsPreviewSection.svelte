<section>
	<main>
		<header>
			<h1 class="pm0">And lets you customize everything to your preferences</h1>
			<p>MyAnimeTab features an easy-to-use settings page. You can install widgets, set their location and most importantly, import your own images.</p>
		</header>
		<div class="settings_image">
			<img src="./2.png" alt="preview">
		</div>
	</main>
</section>
<style>
	section {
		background: linear-gradient(105deg, #6bb7ac 50%, var(--landing-color) 50%);
		width: 100%;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	main {
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
		justify-content: center;
		gap: 7em;
	}
	
	h1 {
		font-size: var(--descriptive-header-fs);
		font-weight: 400;
		line-height: 1.5;
		color: var(--nav-color);
	}

	p {
		font-size: var(--descriptive-body-fs);
		line-height: 1.4;
		max-width: 600px;
		color: var(--nav-color);
	}

	@media only screen and (min-width: 1700px) {
		main {
			gap: 12em;
		}
	}

	@media only screen and (max-width: 1280px) {
		section {
			height: 100vh;
			padding-bottom: var(--nav-padding);
		}

		main {
			margin-top: calc(var(--nav-padding) * 2);
			flex-direction: column;
			align-items: center;
			justify-content: flex-start;
			gap: 2em;
		}

		header {
			display: flex;
			flex-direction: column;
			justify-content: center;
			align-items: center;
		}

		h1 {
			text-align: center;
		}

		p {
			text-align: center;
		}
	}

	@media only screen and (max-width: 827px) {
		img {
			width: 100%;
		}
	}
</style>