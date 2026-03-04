<script setup>
const config = useRuntimeConfig();

const tabs = [
	{ label: 'Hierarchy', icon: 'i-heroicons-circle-stack' },
	{ label: 'Aircraft Models', icon: 'i-heroicons-rocket-launch' },
	{ label: 'Manual Entry', icon: 'i-heroicons-plus-circle' },
];

// Data Fetching at Page Level
const { data: categories, refresh: refreshCats } = await useFetch(
	`${config.public.apiBase}/aircraft/categories`,
);

const { data: manufacturers, refresh: refreshMans } = await useFetch(
	`${config.public.apiBase}/aircraft/manufacturers`,
);

// This function refreshes everything when ANY form succeeds
const handleUpdate = () => {
	refreshCats();
	refreshMans();
};
</script>

<template>
	<UContainer>
		<h1 class="text-2xl font-bold mb-6">Admin Dashboard</h1>

		<UTabs :items="tabs" class="w-full">
			<template #item="{ item }">
				<!-- Tab 1 -->
				<div v-if="item.label === 'Hierarchy'" class="space-y-6 pt-4">
					<UCard>
						<template #header
							><h3 class="font-bold">Categories</h3></template
						>
						<FormsFormCategory @success="handleUpdate" />
					</UCard>

					<UCard>
						<template #header
							><h3 class="font-bold">Manufacturers</h3></template
						>
						<!-- Passing categories as PROP -->
						<FormsFormManufacturer
							:categories="categories || []"
							@success="handleUpdate"
						/>
					</UCard>
				</div>

				<!-- Tab 2 -->
				<div v-if="item.label === 'Aircraft Models'" class="pt-4">
					<UCard>
						<template #header
							><h3 class="font-bold">Add Model</h3></template
						>
						<!-- ADD THIS PROP PASSING HERE -->
						<FormsFormACModel
							:manufacturers="manufacturers || []"
							@success="handleUpdate"
						/>
					</UCard>
				</div>

				<!-- Tab 3 -->
				<div
					v-if="item.label === 'Manual Entry'"
					class="pt-4 max-w-xl mx-auto"
				>
					<UCard>
						<FormsFormSpeedRecord @success="handleUpdate" />
					</UCard>
				</div>
			</template>
		</UTabs>
	</UContainer>
</template>
