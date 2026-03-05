<script setup>
const route = useRoute();
const config = useRuntimeConfig();

// 1. Fetch Manufacturer Details
const { data: manufacturer } = await useFetch(
	`${config.public.apiBase}/aircraft/manufacturers/${route.params.id}`,
);

// 2. Fetch Models for this Manufacturer
const { data: models } = await useFetch(
	`${config.public.apiBase}/aircraft/models`,
	{ query: { manufacturer_id: route.params.id } },
);
</script>

<template>
	<UContainer v-if="manufacturer">
		<div class="flex items-center gap-4 mb-8">
			<UAvatar
				v-if="manufacturer.logo_url"
				:src="`${config.public.apiBase}/${manufacturer.logo_url}`"
				size="xl"
			/>
			<h1 class="text-4xl font-black uppercase tracking-tighter">
				{{ manufacturer.name }}
			</h1>
		</div>

		<div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
			<NuxtLink
				v-for="model in models"
				:key="model.id"
				:to="`/aircraft/${model.id}`"
			>
				<UCard
					class="hover:border-primary cursor-pointer transition-colors"
				>
					<img
						v-if="model.image_url"
						:src="`${config.public.apiBase}/${model.image_url}`"
						class="w-full h-32 object-cover rounded mb-2"
					/>
					<p class="font-bold text-center uppercase">
						{{ model.name }}
					</p>
				</UCard>
			</NuxtLink>
		</div>

		<div
			v-if="models?.length === 0"
			class="text-center py-20 bg-white border rounded-xl"
		>
			<p class="text-gray-400 italic">
				No aircraft models registered for this manufacturer.
			</p>
		</div>
	</UContainer>
</template>
