// nuxt.config.ts
export default defineNuxtConfig({
	// Tells Nuxt 4 to use the modern folder structure
	future: {
		compatibilityVersion: 4,
	},

	// Removes the warning from your terminal
	compatibilityDate: '2025-07-15',

	// Register the UI module
	modules: ['@nuxt/ui'],

	devtools: { enabled: true },

	runtimeConfig: {
		public: {
			apiBase: 'http://localhost:8000',
		},
	},
});
