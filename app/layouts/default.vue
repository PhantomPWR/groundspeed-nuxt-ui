<script setup>
const config = useRuntimeConfig();

// Fetch Categories and Manufacturers for the Global Nav
const { data: categories } = await useFetch(
	`${config.public.apiBase}/aircraft/categories`,
);
const { data: manufacturers } = await useFetch(
	`${config.public.apiBase}/aircraft/manufacturers`,
);

// Helper to group manufacturers by Category ID
const getMansByCategory = (catId) => {
	return manufacturers.value?.filter((m) => m.category_id === catId) || [];
};
</script>

<template>
	<div class="min-h-screen bg-gray-50 flex flex-col">
		<!-- Navbar -->
		<header class="bg-white border-b sticky top-0 z-50 shadow-sm">
			<UContainer class="flex justify-between items-center h-16">
				<div class="flex items-center gap-8">
					<NuxtLink
						to="/"
						class="font-black text-2xl tracking-tighter"
					>
						GSR<span class="text-primary text-xs uppercase ml-1"
							>Beta</span
						>
					</NuxtLink>

					<!-- Dynamic Category Navigation -->
					<nav class="hidden md:flex items-center gap-1">
						<template v-for="cat in categories" :key="cat.id">
							<UPopover mode="hover">
								<UButton
									variant="ghost"
									color="gray"
									class="text-xs uppercase font-black"
								>
									{{ cat.name }}
								</UButton>

								<template #panel>
									<div
										class="p-4 w-64 bg-white shadow-xl grid grid-cols-1 gap-2"
									>
										<p
											class="text-[10px] uppercase text-gray-400 font-bold mb-1"
										>
											Manufacturers
										</p>
										<NuxtLink
											v-for="man in getMansByCategory(
												cat.id,
											)"
											:key="man.id"
											:to="`/manufacturer/${man.id}`"
											class="text-sm font-bold hover:text-primary transition-colors flex items-center gap-2"
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
											class="text-xs italic text-gray-400"
										>
											No manufacturers yet
										</p>
									</div>
								</template>
							</UPopover>
						</template>
					</nav>
				</div>

				<!-- Right Side Nav -->
				<div class="flex gap-2">
					<UButton to="/user" variant="soft" color="gray" size="sm">
						Submit Record
					</UButton>
					<UButton
						to="/admin"
						variant="ghost"
						color="gray"
						icon="i-heroicons-cog-6-tooth"
					/>
				</div>
			</UContainer>
		</header>

		<!-- Page Body -->
		<main class="flex-1 py-10">
			<slot />
		</main>

		<!-- Footer -->
		<footer class="bg-white border-t py-10 mt-20">
			<UContainer class="text-center text-xs text-gray-400">
				<p>
					&copy; {{ new Date().getFullYear() }} Groundspeed Records
					Registry
				</p>
			</UContainer>
		</footer>
	</div>
</template>
