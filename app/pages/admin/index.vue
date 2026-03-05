<script setup>
const { isLoggedIn, isOwner, token } = useAuth();
const config = useRuntimeConfig();

// Guard: If not logged in or not an owner, redirect to home
onMounted(() => {
	if (!isLoggedIn.value || !isOwner.value) {
		navigateTo('/');
	}
});

const tabs = [
	{ label: 'Hierarchy', icon: 'i-heroicons-circle-stack' },
	{ label: 'Aircraft Models', icon: 'i-heroicons-rocket-launch' },
	{ label: 'Manual Entry', icon: 'i-heroicons-plus-circle' },
	{ label: 'User Management', icon: 'i-heroicons-users' },
];

// --- Data Fetching ---

const { data: categories, refresh: refreshCats } = await useFetch(
	`${config.public.apiBase}/aircraft/categories`,
);

const { data: manufacturers, refresh: refreshMans } = await useFetch(
	`${config.public.apiBase}/aircraft/manufacturers`,
);

// Fetching Users (Requires the Owner Token)
const { data: users, refresh: refreshUsers } = await useFetch(
	`${config.public.apiBase}/users`,
	{
		headers: {
			Authorization: `Bearer ${token.value}`,
		},
	},
);

// This function refreshes everything when ANY form succeeds
const handleUpdate = () => {
	refreshCats();
	refreshMans();
	refreshUsers();
};
</script>

<template>
	<UContainer>
		<div class="mb-6">
			<h1 class="text-2xl font-bold">Admin Dashboard</h1>
			<p class="text-sm text-gray-500">System control and management.</p>
		</div>

		<UTabs :items="tabs" class="w-full">
			<template #item="{ item }">
				<!-- Tab 1: Categories & Manufacturers -->
				<div v-if="item.label === 'Hierarchy'" class="space-y-6 pt-4">
					<UCard>
						<template #header>
							<h3 class="font-bold">Categories</h3>
						</template>
						<FormsFormCategory @success="handleUpdate" />
					</UCard>

					<UCard>
						<template #header>
							<h3 class="font-bold">Manufacturers</h3>
						</template>
						<FormsFormManufacturer
							:categories="categories || []"
							@success="handleUpdate"
						/>
					</UCard>
				</div>

				<!-- Tab 2: Aircraft Models -->
				<div v-if="item.label === 'Aircraft Models'" class="pt-4">
					<UCard>
						<template #header>
							<h3 class="font-bold">Add Model</h3>
						</template>
						<FormsFormACModel
							:manufacturers="manufacturers || []"
							@success="handleUpdate"
						/>
					</UCard>
				</div>

				<!-- Tab 3: Manual Entry -->
				<div
					v-if="item.label === 'Manual Entry'"
					class="pt-4 max-w-xl mx-auto"
				>
					<UCard>
						<template #header>
							<h3 class="font-bold">Submit Record for User</h3>
						</template>
						<FormsFormSpeedRecord @success="handleUpdate" />
					</UCard>
				</div>

				<!-- Tab 4: User Management -->
				<div v-if="item.label === 'User Management'" class="pt-4">
					<UCard>
						<template #header>
							<div class="flex justify-between items-center">
								<h3 class="font-bold">Registered Users</h3>
								<UButton
									icon="i-heroicons-arrow-path"
									variant="ghost"
									size="xs"
									@click="refreshUsers"
								/>
							</div>
						</template>

						<ul
							class="divide-y divide-gray-100 dark:divide-gray-800"
						>
							<li
								v-for="u in users"
								:key="u.id"
								class="py-4 flex justify-between items-center"
							>
								<div class="flex items-center gap-3">
									<UAvatar :alt="u.full_name" size="sm" />
									<div>
										<p class="font-bold text-sm">
											{{ u.full_name }}
										</p>
										<p class="text-xs text-gray-500">
											{{ u.email }}
										</p>
									</div>
								</div>
								<div class="flex items-center gap-2">
									<UBadge
										:color="
											u.role === 'owner'
												? 'purple'
												: 'gray'
										"
										variant="subtle"
										class="capitalize"
									>
										{{ u.role }}
									</UBadge>
									<UButton
										v-if="u.role !== 'owner'"
										icon="i-heroicons-pencil"
										variant="ghost"
										color="gray"
										size="xs"
									/>
								</div>
							</li>
						</ul>
					</UCard>
				</div>
			</template>
		</UTabs>
	</UContainer>
</template>
