<script setup>
const { login } = useAuth();
const state = reactive({ email: '', password: '' });
const loading = ref(false);

async function onSubmit() {
	loading.value = true;

	// 1. Use URLSearchParams instead of FormData
	// This ensures the content-type is 'application/x-www-form-urlencoded'
	const params = new URLSearchParams();
	params.append('username', state.email);
	params.append('password', state.password);

	// 2. Pass the params to your login composable
	const success = await login(params);

	if (success) {
		navigateTo('/user');
	} else {
		alert('Invalid email or password.');
	}
	loading.value = false;
}
</script>

<template>
	<UContainer class="max-w-sm py-20">
		<UCard>
			<template #header>
				<h1 class="font-bold text-xl uppercase tracking-tight">
					Login
				</h1>
			</template>

			<UForm :state="state" @submit="onSubmit" class="space-y-4">
				<UFormGroup label="Email">
					<UInput v-model="state.email" icon="i-heroicons-envelope" />
				</UFormGroup>

				<UFormGroup label="Password">
					<UInput
						v-model="state.password"
						type="password"
						icon="i-heroicons-lock-closed"
					/>
				</UFormGroup>

				<UButton type="submit" block :loading="loading" color="black">
					Sign In
				</UButton>
			</UForm>

			<template #footer>
				<p class="text-center text-xs text-gray-500">
					New here?
					<NuxtLink to="/auth/register" class="text-primary font-bold"
						>Create an account</NuxtLink
					>
				</p>
			</template>
		</UCard>
	</UContainer>
</template>
