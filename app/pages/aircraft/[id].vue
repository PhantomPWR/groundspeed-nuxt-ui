<script setup>
const route = useRoute();
const config = useRuntimeConfig();

// 1. Fetch the specific Aircraft Model data
const { data: aircraft, error } = await useFetch(
	`${config.public.apiBase}/aircraft/models/${route.params.id}`,
);

// 2. Fetch only the records for THIS specific aircraft
// (We'll need to update the backend for this filtering in a moment)
const { data: records } = await useFetch(`${config.public.apiBase}/records/`, {
	query: { model_id: route.params.id },
});

const formatDate = (dateStr) => {
	if (!dateStr) return 'Date Unknown';
	const options = { day: 'numeric', month: 'long', year: 'numeric' };
	return new Date(dateStr).toLocaleDateString('en-GB', options);
};
</script>

<template>
	<UContainer v-if="aircraft">
		<!-- Hero Section: Tech Photo & Title -->
		<div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center mb-12">
			<div class="rounded-2xl overflow-hidden border shadow-xl bg-white">
				<img
					v-if="aircraft.image_url"
					:src="`${config.public.apiBase}/${aircraft.image_url}`"
					class="w-full h-80 object-cover"
				/>
				<div
					v-else
					class="h-80 bg-gray-100 flex items-center justify-center italic text-gray-400"
				>
					No technical photo available
				</div>
			</div>

			<div>
				<h1 class="text-5xl font-black tracking-tighter uppercase mb-2">
					{{ aircraft.name }}
				</h1>
				<p class="text-xl text-gray-500 mb-6">
					Technical Specifications
				</p>

				<!-- Technical Specs Grid -->
				<div class="grid grid-cols-2 gap-y-4 border-t pt-6">
					<div>
						<p class="text-xs uppercase text-gray-400">
							Passengers
						</p>
						<p class="font-bold">{{ aircraft.passengers }}</p>
					</div>
					<div>
						<p class="text-xs uppercase text-gray-400">Range</p>
						<p class="font-bold">{{ aircraft.max_range }}</p>
					</div>
					<div>
						<p class="text-xs uppercase text-gray-400">MTOW</p>
						<p class="font-bold">
							{{ aircraft.max_takeoff_weight }}
						</p>
					</div>
					<div>
						<p class="text-xs uppercase text-gray-400">Cruise</p>
						<p class="font-bold">
							{{ aircraft.max_cruising_speed }}
						</p>
					</div>
				</div>
			</div>
		</div>

		<!-- Records Table for this Aircraft -->
		<section>
			<h2 class="text-2xl font-bold mb-6">
				Groundspeed Records for this Model
			</h2>
			<div class="bg-white rounded-xl border divide-y overflow-hidden">
				<div
					v-for="r in records"
					:key="r.id"
					class="p-4 flex justify-between items-center hover:bg-gray-50"
				>
					<div class="flex items-center gap-6">
						<span class="text-3xl font-black"
							>{{ r.groundspeed
							}}<span class="text-sm">kt</span></span
						>
						<div>
							<p class="font-bold text-sm">
								{{ r.pilot_name || 'Anonymous' }}
							</p>
							<p class="text-xs text-gray-500">
								{{ r.airline || 'Private' }}
							</p>
						</div>
					</div>
					<div class="text-right">
						<p class="text-xs text-gray-400 uppercase font-bold">
							{{ formatDate(r.flight_date) }}
						</p>
						<UButton
							:to="`${config.public.apiBase}/${r.photo_url}`"
							target="_blank"
							variant="link"
							size="xs"
							label="View Proof"
						/>
					</div>
				</div>
			</div>
		</section>
	</UContainer>

	<UContainer v-else-if="error">
		<UAlert title="Aircraft not found" color="red" variant="outline" />
	</UContainer>
</template>
