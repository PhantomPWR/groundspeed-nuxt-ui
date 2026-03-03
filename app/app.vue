<script setup>
const config = useRuntimeConfig();

// 1. Form State
const state = reactive({
	pilot_name: '',
	groundspeed: undefined,
	categoryId: undefined,
	manufacturerId: undefined,
	modelId: undefined,
	description: '',
	photo: null,
});

// 2. Data Fetching

// Fetch Categories (Runs once on load)
const { data: categories } = await useFetch(
	`${config.public.apiBase}/categories`,
);

// Fetch Manufacturers - Dependent on categoryId
const { data: manufacturers, refresh: refreshManufacturers } = await useFetch(
	`${config.public.apiBase}/manufacturers`,
	{
		// Use a function for the query so it's re-evaluated
		query: computed(() => ({ category_id: state.categoryId })),
		// This 'key' ensures Nuxt tracks this specific request uniquely
		key: `manufacturers-${state.categoryId}`,
		// Only fetch if we actually have a categoryId
		watch: false, // We will trigger this manually for better control
		immediate: false,
	},
);

// Fetch Models - Dependent on manufacturerId
const { data: models, refresh: refreshModels } = await useFetch(
	`${config.public.apiBase}/models`,
	{
		query: computed(() => ({ manufacturer_id: state.manufacturerId })),
		key: `models-${state.manufacturerId}`,
		watch: false,
		immediate: false,
	},
);

// 3. Manual Watchers for total control
watch(
	() => state.categoryId,
	(newVal) => {
		state.manufacturerId = undefined;
		state.modelId = undefined;
		if (newVal) refreshManufacturers(); // Manually trigger the fetch
	},
);

watch(
	() => state.manufacturerId,
	(newVal) => {
		state.modelId = undefined;
		if (newVal) refreshModels(); // Manually trigger the fetch
	},
);

// 4. File selection
const onFileChange = (e) => {
	state.photo = e.target.files[0];
};

// 5. Submit logic
const loading = ref(false);
async function onSubmit() {
	// 1. Check the names carefully:
	// It should be modelId (not model_id) to match your state object
	if (
		!state.pilot_name ||
		!state.groundspeed ||
		!state.modelId ||
		!state.photo
	) {
		console.log('Validation failed. Current state:', state); // This helps you debug!
		return alert('Please fill in all fields and upload a photo.');
	}

	loading.value = true;
	const formData = new FormData();

	// 2. Mapping the frontend (camelCase) to the backend (snake_case)
	formData.append('pilot_name', state.pilot_name);
	formData.append('groundspeed', state.groundspeed);
	formData.append('model_id', state.modelId); // Sending 'modelId' as 'model_id'
	formData.append('description', state.description || '');
	formData.append('photo', state.photo);

	try {
		await $fetch(`${config.public.apiBase}/records`, {
			method: 'POST',
			body: formData,
		});
		alert('Record submitted successfully!');

		// Reset form
		Object.assign(state, {
			pilot_name: '',
			groundspeed: undefined,
			categoryId: undefined,
			manufacturerId: undefined,
			modelId: undefined,
			photo: null,
		});
	} catch (err) {
		console.error('Submission Error Details:', err.response?._data || err);
		alert('Error submitting record.');
	} finally {
		loading.value = false;
	}
}
</script>

<template>
	<UContainer class="py-10 max-w-xl">
		<UCard>
			<template #header>
				<h1 class="text-xl font-bold">Submit Groundspeed Record</h1>
			</template>

			<UForm :state="state" @submit="onSubmit" class="space-y-4">
				<UFormGroup label="Pilot Name" name="pilot_name">
					<UInput
						v-model="state.pilot_name"
						placeholder="Capt. Joe Citizen"
					/>
				</UFormGroup>

				<UFormGroup label="Groundspeed (Knots)" name="groundspeed">
					<UInput
						v-model="state.groundspeed"
						type="number"
						placeholder="540"
					/>
				</UFormGroup>

				<UFormGroup label="Category">
					<USelect
						v-model="state.categoryId"
						:options="categories"
						option-attribute="name"
						value-attribute="id"
						placeholder="Select Category"
					/>
				</UFormGroup>

				<UFormGroup label="Manufacturer" v-if="state.categoryId">
					<USelect
						v-model="state.manufacturerId"
						:options="manufacturers || []"
						option-attribute="name"
						value-attribute="id"
						placeholder="Select Manufacturer"
					/>
				</UFormGroup>

				<UFormGroup label="Aircraft Model" v-if="state.manufacturerId">
					<USelect
						v-model="state.modelId"
						:options="models || []"
						option-attribute="name"
						value-attribute="id"
						placeholder="Select Model"
					/>
				</UFormGroup>

				<UFormGroup label="Proof Photo">
					<input
						type="file"
						@change="onFileChange"
						class="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
					/>
				</UFormGroup>

				<UButton type="submit" block :loading="loading">
					Submit Record
				</UButton>
			</UForm>
		</UCard>
	</UContainer>
</template>
