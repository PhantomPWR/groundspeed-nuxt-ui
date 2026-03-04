<script setup>
const config = useRuntimeConfig();
const emit = defineEmits(['success']);

// Receive manufacturers from the parent admin page
const props = defineProps({
	manufacturers: {
		type: Array,
		required: true,
	},
});

const state = reactive({
	name: '',
	manufacturerId: undefined,
	passengers: '',
	max_takeoff_weight: '',
	max_landing_weight: '',
	max_fuel_capacity: '',
	max_range: '',
	max_ceiling: '',
	max_cruising_speed: '',
	thrust_power: '',
	image: null,
});

const loading = ref(false);

async function onSubmit() {
	if (!state.name || !state.manufacturerId) return alert('Fields required');

	loading.value = true;
	const fd = new FormData();
	fd.append('name', state.name);
	fd.append('manufacturer_id', state.manufacturerId);

	// Append technical specs
	const specs = [
		'passengers',
		'max_takeoff_weight',
		'max_landing_weight',
		'max_fuel_capacity',
		'max_range',
		'max_ceiling',
		'max_cruising_speed',
		'thrust_power',
	];
	specs.forEach((s) => {
		if (state[s]) fd.append(s, state[s]);
	});

	if (state.image) fd.append('image', state.image);

	try {
		await $fetch(`${config.public.apiBase}/aircraft/models`, {
			method: 'POST',
			body: fd,
		});
		state.name = '';
		state.image = null;
		emit('success'); // Tell parent to refresh
		alert('Model added!');
	} catch (e) {
		alert('Error creating aircraft model');
	} finally {
		loading.value = false;
	}
}
</script>

<template>
	<UForm :state="state" @submit="onSubmit" class="space-y-4">
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<UFormGroup label="Model Name *" required>
				<UInput v-model="state.name" placeholder="e.g. 737-800" />
			</UFormGroup>
			<UFormGroup label="Manufacturer *" required>
				<!-- Use props.manufacturers here -->
				<USelect
					v-model="state.manufacturerId"
					:options="props.manufacturers"
					option-attribute="name"
					value-attribute="id"
					placeholder="Select Manufacturer"
				/>
			</UFormGroup>
		</div>
		<!-- ... rest of your inputs and technical specs grid ... -->

		<UButton type="submit" :loading="loading" block color="black">
			Save Aircraft Model
		</UButton>
	</UForm>
</template>
