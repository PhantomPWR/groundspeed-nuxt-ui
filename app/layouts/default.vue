<script setup>
const config = useRuntimeConfig();
const { isLoggedIn, user, isOwner, logout } = useAuth();

// 1. Fetch Categories and Manufacturers for the Global Nav
const { data: categories } = await useFetch(
	`${config.public.apiBase}/aircraft/categories`,
);
const { data: manufacturers } = await useFetch(
	`${config.public.apiBase}/aircraft/manufacturers`,
);

const getMansByCategory = (catId) => {
	return manufacturers.value?.filter((m) => m.category_id === catId) || [];
};

// 2. Define dropdown items for the User Menu
const userMenuItems = [
	[
		{
			label: user.value?.email || 'My Account',
			slot: 'account',
			disabled: true,
		},
	],
	[
		{
			label: 'User Dashboard',
			icon: 'i-heroicons-presentation-chart-line',
			to: '/user',
		},
	],
	[
		{
			label: 'Sign out',
			icon: 'i-heroicons-arrow-left-on-rectangle',
			click: logout,
		},
	],
];
</script>

<template>
	<div class="min-h-screen bg-gray-50 flex flex-col">
		<!-- Main Header -->
		<header
			class="bg-white border-b sticky top-0 z-50 shadow-sm h-16 flex items-center"
		>
			<UContainer class="flex justify-between items-center w-full">
				<div class="flex items-center gap-8">
					<!-- Logo -->
					<NuxtLink
						to="/"
						class="font-black text-2xl tracking-tighter italic text-primary"
					>
						GSR
					</NuxtLink>

					<!-- Dynamic Navigation (Desktop Only) -->
					<nav class="hidden lg:flex items-center gap-1">
						<template v-for="cat in categories" :key="cat.id">
							<UPopover mode="hover">
								<UButton
									variant="ghost"
									color="gray"
									class="text-xs uppercase font-black tracking-widest"
								>
									{{ cat.name }}
								</UButton>

								<template #panel>
									<div
										class="p-4 w-64 bg-white shadow-xl grid grid-cols-1 gap-2"
									>
										<p
											class="text-[10px] uppercase text-gray-400 font-bold mb-1 border-b pb-1"
										>
											Manufacturers
										</p>
										<NuxtLink
											v-for="man in getMansByCategory(
												cat.id,
											)"
											:key="man.id"
											:to="`/manufacturer/${man.id}`"
											class="text-sm font-bold hover:text-primary transition-colors flex items-center gap-2 py-1"
										>
											<UAvatar
												v-if="man.logo_url"
												:src="`${config.public.apiBase}/${man.logo_url}`"
												size="3xs"
											/>
											{{ man.name }}
										</NuxtLink>
										<p
											v-if="
												getMansByCategory(cat.id)
													.length === 0
											"
											class="text-xs italic text-gray-400 py-2"
										>
											No manufacturers found
										</p>
									</div>
								</template>
							</UPopover>
						</template>
					</nav>
				</div>

				<!-- Right Side: Auth Logic -->
				<div class="flex items-center gap-2">
					<!-- State: GUEST -->
					<template v-if="!isLoggedIn">
						<UButton
							to="/auth/login"
							variant="ghost"
							color="gray"
							size="sm"
						>
							Login
						</UButton>
						<UButton to="/auth/register" color="black" size="sm">
							Join
						</UButton>
					</template>

					<!-- State: LOGGED IN -->
					<template v-else>
						<!-- Show Admin Icon ONLY to Owner -->
						<UButton
							v-if="isOwner"
							to="/admin"
							variant="ghost"
							color="primary"
							icon="i-heroicons-shield-check"
						/>

						<UButton
							to="/user"
							variant="soft"
							color="primary"
							size="sm"
							class="hidden sm:flex"
						>
							Submit Record
						</UButton>

						<!-- User Profile Dropdown -->
						<UDropdown
							:items="userMenuItems"
							:popper="{ placement: 'bottom-end' }"
						>
							<UAvatar
								:alt="user?.full_name || 'User'"
								size="sm"
								class="cursor-pointer ring-2 ring-transparent hover:ring-primary transition-all"
							/>

							<!-- Custom slot to show email in dropdown -->
							<template #account="{ item }">
								<div class="text-left">
									<p
										class="text-[10px] uppercase text-gray-400 font-bold"
									>
										Pilot
									</p>
									<p
										class="truncate font-medium text-gray-900 dark:text-white"
									>
										{{ item.label }}
									</p>
								</div>
							</template>
						</UDropdown>
					</template>
				</div>
			</UContainer>
		</header>

		<!-- Page Content -->
		<main class="flex-1 py-10">
			<slot />
		</main>

		<!-- Simple Footer -->
		<footer class="bg-white border-t py-10">
			<UContainer class="text-center text-xs text-gray-400">
				<p>
					&copy; {{ new Date().getFullYear() }} Groundspeed Records
					Registry
				</p>
			</UContainer>
		</footer>
	</div>
</template>
