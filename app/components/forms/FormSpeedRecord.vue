<script setup>
const config = useRuntimeConfig();
const emit = defineEmits(['success']);

const state = reactive({
	groundspeed: undefined,
	modelId: undefined,
	pilot_name: '',
	airline: '',
	flight_date: '',
	description: '',
	photo: null,
	categoryId: undefined,
	manufacturerId: undefined,
});

// Fetching data for the dropdowns
const { data: categories } = await useFetch(
	`${config.public.apiBase}/aircraft/categories`,
);
const { data: manufacturers, refresh: refreshMan } = await useFetch(
	`${config.public.apiBase}/aircraft/manufacturers`,
	{
		query: computed(() => ({ category_id: state.categoryId })),
		watch: [() => state.categoryId],
		immediate: false,
	},
);
const { data: models, refresh: refreshModels } = await useFetch(
	`${config.public.apiBase}/aircraft/models`,
	{
		query: computed(() => ({ manufacturer_id: state.manufacturerId })),
		watch: [() => state.manufacturerId],
		immediate: false,
	},
);

// Reset children when parent changes
watch(
	() => state.categoryId,
	() => {
		state.manufacturerId = undefined;
		state.modelId = undefined;
		if (state.categoryId) refreshMan();
	},
);

watch(
	() => state.manufacturerId,
	() => {
		state.modelId = undefined;
		if (state.manufacturerId) refreshModels();
	},
);

const loading = ref(false);
async function onSubmit() {
	if (!state.groundspeed || !state.modelId || !state.photo) {
		return alert('Photo, Speed, and Aircraft are required.');
	}

	loading.value = true;
	const fd = new FormData();
	fd.append('groundspeed', state.groundspeed);
	fd.append('model_id', state.modelId);
	fd.append('photo', state.photo);
	if (state.pilot_name) fd.append('pilot_name', state.pilot_name);
	if (state.airline) fd.append('airline', state.airline);
	if (state.flight_date) fd.append('flight_date', state.flight_date);
	if (state.description) fd.append('description', state.description);

	try {
		await $fetch(`${config.public.apiBase}/records/`, {
			method: 'POST',
			body: fd,
		});
		alert('Record submitted!');
		emit('success');
		// Reset local state
		Object.assign(state, { groundspeed: undefined, photo: null });
	} catch (e) {
		alert('Error submitting record.');
	} finally {
		loading.value = false;
	}
}
</script>

<template>
	<UForm :state="state" @submit="onSubmit" class="space-y-4">
		<div class="grid grid-cols-2 gap-4">
			<UFormGroup label="Speed (kt) *" required>
				<UInput v-model="state.groundspeed" type="number" />
			</UFormGroup>
			<UFormGroup label="Flight Date">
				<UInput v-model="state.flight_date" type="date" />
			</UFormGroup>
		</div>

		<div class="grid grid-cols-2 gap-4">
			<UFormGroup label="Pilot Name">
				<UInput v-model="state.pilot_name" placeholder="Optional" />
			</UFormGroup>
			<UFormGroup label="Airline">
				<UInput v-model="state.airline" placeholder="Optional" />
			</UFormGroup>
		</div>

		<UFormGroup label="Aircraft Selection *" required>
			<div class="grid grid-cols-1 gap-2">
				<USelect
					v-model="state.categoryId"
					:options="categories || []"
					option-attribute="name"
					value-attribute="id"
					placeholder="Select Category"
				/>

				<USelect
					v-if="state.categoryId"
					v-model="state.manufacturerId"
					:options="manufacturers || []"
					option-attribute="name"
					value-attribute="id"
					placeholder="Select Manufacturer"
				/>

				<USelect
					v-if="state.manufacturerId"
					v-model="state.modelId"
					:options="models || []"
					option-attribute="name"
					value-attribute="id"
					placeholder="Select Model"
				/>
			</div>
		</UFormGroup>

		<UFormGroup label="Notes">
			<UTextarea
				v-model="state.description"
				placeholder="Optional notes"
			/>
		</UFormGroup>

		<UFormGroup label="Proof Photo *" required>
			<input
				type="file"
				@change="(e) => (state.photo = e.target.files[0])"
			/>
		</UFormGroup>

		<UButton type="submit" block :loading="loading">Submit Record</UButton>
	</UForm>
</template>
