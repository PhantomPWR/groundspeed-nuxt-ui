<template>
	<UContainer class="max-w-xl">
		<UCard>
			<template #header>
				<h1 class="text-xl font-bold">Submit a New Record</h1>
				<p class="text-sm text-gray-500">
					Share your groundspeed achievement with the community.
				</p>
			</template>

			<!-- Nuxt auto-imports components from components/forms/ -->
			<FormsFormSpeedRecord @success="navigateTo('/')" />
		</UCard>
	</UContainer>
</template>
