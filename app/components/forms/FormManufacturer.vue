<script setup>
const config = useRuntimeConfig();
const emit = defineEmits(['success']);

// Receive categories from parent (admin/index.vue)
const props = defineProps({
	categories: {
		type: Array,
		required: true,
	},
});

const state = reactive({
	name: '',
	categoryId: undefined,
	logo: null,
});

const loading = ref(false);

async function onSubmit() {
	if (!state.name || !state.categoryId) {
		return alert('Manufacturer Name and Category are required.');
	}

	loading.value = true;
	const fd = new FormData();
	fd.append('name', state.name);
	fd.append('category_id', state.categoryId);

	if (state.logo) {
		fd.append('logo', state.logo);
	}

	try {
		await $fetch(`${config.public.apiBase}/aircraft/manufacturers`, {
			method: 'POST',
			body: fd,
		});

		// Reset local form state
		state.name = '';
		state.logo = null;

		// Trigger parent refresh and show success
		emit('success');
		alert('Manufacturer added successfully!');
	} catch (e) {
		const msg = e.response?._data?.detail || 'Error creating manufacturer';
		alert(msg);
	} finally {
		loading.value = false;
	}
}
</script>

<template>
	<UForm :state="state" @submit="onSubmit" class="space-y-4">
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			<UFormGroup label="Manufacturer Name *" required>
				<UInput
					v-model="state.name"
					placeholder="e.g. Boeing"
					icon="i-heroicons-building-office"
				/>
			</UFormGroup>

			<UFormGroup label="Category *" required>
				<USelect
					v-model="state.categoryId"
					:options="props.categories"
					option-attribute="name"
					value-attribute="id"
					placeholder="Select Parent Category"
				/>
			</UFormGroup>
		</div>

		<UFormGroup label="Manufacturer Logo (Optional)">
			<div class="flex items-center gap-4">
				<input
					type="file"
					accept="image/*"
					@change="(e) => (state.logo = e.target.files[0])"
					class="text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
				/>
			</div>
		</UFormGroup>

		<div class="flex justify-end pt-2">
			<UButton
				type="submit"
				:loading="loading"
				color="black"
				icon="i-heroicons-plus-circle"
				label="Add Manufacturer"
			/>
		</div>
	</UForm>
</template>
