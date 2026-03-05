<script setup>
const config = useRuntimeConfig();

const state = reactive({
	email: '',
	full_name: '',
	password: '',
});

const loading = ref(false);

async function onSubmit() {
	loading.value = true;
	try {
		await $fetch(`${config.public.apiBase}/auth/register`, {
			method: 'POST',
			body: state,
		});
		alert('Registration successful! Please log in.');
		navigateTo('/auth/login');
	} catch (e) {
		alert(e.response?._data?.detail || 'Registration failed');
	} finally {
		loading.value = false;
	}
}
</script>

<template>
	<UContainer class="max-w-sm py-20">
		<UCard>
			<template #header>
				<h1 class="font-bold text-xl uppercase tracking-tight">
					Join the Registry
				</h1>
			</template>

			<UForm :state="state" @submit="onSubmit" class="space-y-4">
				<UFormGroup label="Full Name">
					<UInput
						v-model="state.full_name"
						placeholder="Capt. John Doe"
					/>
				</UFormGroup>

				<UFormGroup label="Email Address">
					<UInput
						v-model="state.email"
						type="email"
						placeholder="pilot@example.com"
					/>
				</UFormGroup>

				<UFormGroup label="Password">
					<UInput v-model="state.password" type="password" />
				</UFormGroup>

				<UButton type="submit" block color="black" :loading="loading">
					Register Account
				</UButton>
			</UForm>

			<template #footer>
				<p class="text-center text-xs text-gray-500">
					Already have an account?
					<NuxtLink to="/auth/login" class="text-primary font-bold"
						>Login</NuxtLink
					>
				</p>
			</template>
		</UCard>
	</UContainer>
</template>
