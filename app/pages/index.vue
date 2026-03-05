<script setup>
const config = useRuntimeConfig();

// 1. Fetch the latest records from the API
const {
	data: records,
	pending,
	error,
} = await useFetch(`${config.public.apiBase}/records/`);

// 2. Helper to format date for display: "18 August 2007"
const formatDate = (dateStr) => {
	if (!dateStr) return 'Date Unknown';
	const options = { day: 'numeric', month: 'long', year: 'numeric' };
	return new Date(dateStr).toLocaleDateString('en-GB', options);
};
</script>

<template>
	<UContainer>
		<!-- Header Section -->
		<div class="mb-10 border-b pb-6">
			<h1 class="text-4xl font-black tracking-tighter">LATEST RECORDS</h1>
			<p class="text-gray-500">
				The most recent groundspeed achievements from our pilot
				community.
			</p>
		</div>

		<!-- Loading State -->
		<div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 gap-6">
			<USkeleton v-for="n in 4" :key="n" class="h-48 w-full" />
		</div>

		<!-- Error State -->
		<UAlert
			v-else-if="error"
			icon="i-heroicons-exclamation-triangle"
			color="red"
			variant="outline"
			title="Connection Error"
			description="Unable to load records. Please ensure the API is running."
		/>

		<!-- Records Feed -->
		<div
			v-else-if="records && records.length > 0"
			class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
		>
			<!-- Inside your v-for="record in records" loop -->
			<NuxtLink
				v-for="record in records"
				:key="record.id"
				:to="`/aircraft/${record.aircraft_model.id}`"
				class="block group"
			>
				<UCard
					:ui="{ body: { padding: 'p-0' } }"
					class="overflow-hidden hover:ring-2 hover:ring-primary transition-all"
				>
					<!-- Record Photo -->
					<img
						:src="`${config.public.apiBase}/${record.photo_url}`"
						class="w-full h-48 object-cover"
						alt="Groundspeed Proof"
					/>

					<div class="p-4">
						<div class="flex justify-between items-start mb-2">
							<div>
								<p class="text-3xl font-black leading-none">
									{{ record.groundspeed
									}}<span class="text-sm ml-1">kt</span>
								</p>

								<!-- NEW: Nested Aircraft Info -->
								<p class="text-sm font-bold text-primary mt-1">
									{{
										record.aircraft_model.manufacturer.name
									}}
									{{ record.aircraft_model.name }}
								</p>
							</div>

							<UBadge color="gray" variant="subtle">
								{{ formatDate(record.flight_date) }}
							</UBadge>
						</div>

						<div class="space-y-1">
							<p class="text-sm font-bold text-gray-700">
								{{ record.airline || 'Private Operator' }}
							</p>
							<p class="text-xs text-gray-500 italic">
								Pilot: {{ record.pilot_name || 'Anonymous' }}
							</p>
						</div>

						<div
							v-if="record.description"
							class="mt-4 pt-4 border-t"
						>
							<p class="text-xs text-gray-600 line-clamp-2">
								{{ record.description }}
							</p>
						</div>
					</div>
				</UCard>
			</NuxtLink>
		</div>

		<!-- Empty State -->
		<div
			v-else
			class="text-center py-20 bg-gray-50 rounded-xl border-2 border-dashed"
		>
			<UIcon
				name="i-heroicons-camera"
				class="w-12 h-12 text-gray-300 mb-2"
			/>
			<p class="text-gray-500 italic">
				No records have been submitted yet.
			</p>
			<UButton to="/user" variant="link" class="mt-2"
				>Be the first to submit</UButton
			>
		</div>
	</UContainer>
</template>
