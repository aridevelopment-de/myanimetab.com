<nav>
    <div class="nav_image">
        <a href="./"><img class="navbar_image" src="./icon.png" alt="myanimetab"></a>
        <a href="./">MyAnimeTab</a>
    </div>
    <div class="links">
        <a href="https://addons.mozilla.org/firefox/addon/myanimetab/">Install</a>
        <a href="https://github.com/aridevelopment-de/myanimetab">GitHub</a>
		<a href="https://aridevelopment.de/dc">Discord</a>
    </div>
</nav>
<style>
	:root {
		--nav-padding: 2em;
		--nav-color: #25635A
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
		margin-left: 1em;
	}

	@media only screen and (max-width: 590px) {
		nav {
			flex-direction: column;
			align-items: center;
			justify-content: center;
			gap: 20px;
		}

		.links {
			margin-left: unset;
			display: flex;
			gap: 20px;
		}

		.links a {
			margin-left: 0;
		}
	}
</style>