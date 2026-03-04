<script setup>
const config = useRuntimeConfig();
const emit = defineEmits(['success']);

const state = reactive({ name: '' });
const loading = ref(false);

async function onSubmit() {
	if (!state.name) return alert('Name is required');
	loading.value = true;
	try {
		await $fetch(`${config.public.apiBase}/aircraft/categories`, {
			method: 'POST',
			body: state,
		});
		state.name = '';
		emit('success');
		alert('Category added successfully!');
	} catch (e) {
		// Look for the detailed error message from FastAPI
		const msg = e.response?._data?.detail || 'Error creating category';
		alert(msg);
	} finally {
		loading.value = false;
	}
}
</script>

<template>
	<UForm :state="state" @submit="onSubmit" class="flex items-end gap-2">
		<UFormGroup label="New Category" class="flex-1">
			<UInput v-model="state.name" placeholder="e.g. Commercial" />
		</UFormGroup>
		<UButton type="submit" :loading="loading" icon="i-heroicons-plus" />
	</UForm>
</template>
