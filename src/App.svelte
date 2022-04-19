<script>
	import LandingSection from "./components/LandingSection.svelte";
	import WidgetListSection from "./components/WidgetListSection.svelte";
	import SettingsPreviewSection from "./components/SettingsPreviewSection.svelte";
	import InstallSection from "./components/InstallSection.svelte";
</script>
<LandingSection />
<WidgetListSection />
<SettingsPreviewSection />
<InstallSection />
<footer>
	<p>myanimetab &copy; 2022 aridevelopment.de</p>
</footer>
<style>
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