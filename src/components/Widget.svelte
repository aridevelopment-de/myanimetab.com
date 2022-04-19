<script>
    export let name;
    export let description;
</script>
<div>
    <header>
        <p class="pm0">{name}</p>
    </header>
    <main>
        <p class="pm0">{description}</p>
    </main>
</div>
<style>
    div {
		background-color: var(--widget-color);
		box-shadow: 10px 10px 10px rgba(0, 0, 0, 0.1);
		border-radius: 4px;
		color: black;
		display: flex;
		flex-direction: column;
		padding: 2em;
		flex: 1 1;
	}

	header {
		text-align: center;
	}

	header > p {
		font-weight: 500;
		font-size: 30px;
		line-height: 1.5;
	}

	main > p {
		margin-top: 16px;
		font-weight: 400;
		line-height: 1.4;
		font-size: 18px;
	}

	@media only screen and (max-width: 905px) {
		p {
			text-align: center;
		}
	}
</style>