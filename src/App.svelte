<section id="landing">
	<nav>
        <div class="nav_image">
            <a href="./" class="ns"><img class="ns navbar_image" src="./icon.png" alt="myanimetab"></a>
			<a href="./" class="ns">MyAnimeTab</a>
        </div>
        <div class="links">
            <a class="ns" href="https://addons.mozilla.org/firefox/addon/myanimetab/">Install</a>
            <a class="ns" href="https://github.com/aridevelopment-de/myanimetab">GitHub</a>
        </div>
	</nav>
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
<section id="widget_list">
	<main>
		<header>
			<h1 class="pm0">It comes with a wide collection of widgets</h1>
		</header>
		<main>
			<div class="widget">
				<header>
					<p class="pm0">Clock</p>
				</header>
				<main>
					<p class="pm0">A simple yet powerful clock. It displays the current time but also enables setting alarms. Great to keep track of your pizza!</p>
				</main>
			</div>
			<div class="widget">
				<header>
					<p class="pm0">Weather</p>
				</header>
				<main>
					<p class="pm0">Want to know if you need to bring an umbrella with you? The weather widget provides you with the current weather status as well as a forecast for the next days!</p>
				</main>
			</div>
			<div class="widget">
				<header>
					<p class="pm0">Searchbar</p>
				</header>
				<main>
					<p class="pm0">Switching between Search Engines can be hard. This widget represents the solution to that! You'll be able to quickly switch the Search Engine and even get suggestions for your search!</p>
				</main>
			</div>
		</main>
	</main>
</section>
<section id="settings_preview">
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
<section id="install">
	<main>
		<header>
			<h1>Get the most out of your Startpage!</h1>
		</header>
		<main>
			<a href="https://addons.mozilla.org/firefox/addon/myanimetab/">Install MyAnimeTab Now!</a>
		</main>
	</main>
</section>
<footer>
	<p>myanimetab &copy; 2022 aridevelopment.de</p>
</footer>
<style>
	:root {
		--nav-padding: 2em;
		--section-padding: 4em;
		--nav-color: hsl(0, 0%, 18%);
		--landing-color: hsl(0, 0%, 22%);
		--widget-list-color: hsl(0, 0%, 29%);
		--widget-color: hsl(0, 0%, 100%);
		--settings-preview-color: hsl(0, 0%, 36%);
		--install-color: hsl(0, 0%, 43%);
		--install-btn-color: #1697D1;

		--descriptive-header-fs: 50px;
		--descriptive-body-fs: 20px;
	}

	:root {
		--nav-color: #25635A;
		--landing-color: #9BE8DC;
		--widget-list-color: #43635F;
		--settings-preview-color: var(--landing-color);
		--install-color: #D71673;
		--install-btn-color: #25635A;
	}

    section#landing {
        /* background-color: var(--landing-color); */
		background: linear-gradient(255deg, var(--landing-color) 50%, #6bb7ac 50%);
		width: 100%;
		height: 100vh;
    }

	*:not(nav) {
		color: var(--nav-color);
	}

    nav {
        display: flex;
		align-items: center;
        width: calc(100% - var(--section-padding) * 2);
		padding: var(--nav-padding) var(--section-padding);
		padding-right: var(--section-padding);
		background-color: var(--nav-color);
    }

	.nav_image {
		display: flex;
		align-items: center;
		gap: 16px;
	}

    .nav_image img {
        width: 50px;
        height: 50px;
		filter: drop-shadow(7px 7px 20px rgba(0, 0, 0, 0.4));
    }

	.nav_image a {
		font-size: 18px;
		padding-left: 0;
		margin-left: 0;
		color: white;
	}

    .links {
		margin-left: auto;
    }

	.links a {
		color: white;
	}
	/* end of nav */
	
	section > main {
		padding: 0 var(--section-padding);
	}

	section#landing > main {
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
	}

	.landing_text > p {
		font-size: var(--descriptive-body-fs);
		line-height: 1.4;
		max-width: 600px;
	}

	img:not(.navbar_image) {
		width: 720px;
		box-shadow: 10px 10px 20px rgba(0, 0, 0, 0.5);
	}

	section#widget_list {
		/* background-color: var(--widget-list-color); */
		background: linear-gradient(105deg, var(--widget-list-color), #60817d);
		width: 100%;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	section#widget_list > main {
		display: flex;
		flex-direction: column;
		align-items: center;
		justify-content: center;
	}

	section#widget_list > main > header {
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	section#widget_list > main > header > h1 {
		color: var(--landing-color) !important;
		font-size: var(--descriptive-header-fs);
	}

	section#widget_list > main > main {
		display: flex;
		gap: 4em;
		max-width: 80%;
		padding-top: 4em;
	}

	.widget {
		background-color: var(--widget-color);
		box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.1);
		border-radius: 4px;
		color: black;
		display: flex;
		flex-direction: column;
		padding: 2em;
		flex: 1 1;
	}

	.widget header {
		text-align: center;
	}

	.widget > header > p {
		font-weight: 500;
		font-size: 30px;
		line-height: 1.5;
	}

	.widget > main > p {
		margin-top: 16px;
		font-weight: 400;
		line-height: 1.4;
		font-size: 18px;
	}

	section#settings_preview {
		/* background-color: var(--settings-preview-color); */
		/* background: linear-gradient(255deg, var(--settings-preview-color), #6bb7ac); */
		background: linear-gradient(105deg, #6bb7ac 50%, var(--landing-color) 50%);
		width: 100%;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
	}

	section#settings_preview > main {
		display: flex;
		flex-direction: row-reverse;
		align-items: center;
		justify-content: center;
		gap: 7em;
	}
	
	section#settings_preview h1 {
		font-size: var(--descriptive-header-fs);
		font-weight: 400;
		line-height: 1.5;
	}

	section#settings_preview p {
		font-size: var(--descriptive-body-fs);
		line-height: 1.4;
		max-width: 600px;
	}

	.settings_image img {
		width: 720px;
	}

	section#install {
		/* background-color: var(--install-color); */
		background: linear-gradient(255deg, #f8428e, var(--install-color));
		width: 100%;
		height: 100vh;
		display: flex;
		align-items: center;
		justify-content: center;
		position: relative;
	}

	section#install h1 {
		font-size: 70px;
		font-weight: 400;
		line-height: 1.5;
		max-width: 600px;
		color: #9BE8DC;
		text-align: center;
	}

	section#install main > main {
		display: flex;
		align-items: center;
		justify-content: center;
	}

	section#install a {
		font-size: 25px;
		font-weight: 500;
		line-height: 1.4;
		padding: 1em;
		border-radius: 4px;
		background-color: var(--install-btn-color);
		border: none;
		cursor: pointer;
		color: #9BE8DC;
	}

	section#install a:hover {
		filter: brightness(0.9);
	}

	footer {
		background-color: black;
		width: 100%;
		display: flex;
		align-items: center;
		justify-content: flex-end;
	}

	footer p {
		padding: 1em;
		color: white;
	}

</style>