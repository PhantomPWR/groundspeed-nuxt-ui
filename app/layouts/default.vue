<template>
	<div class="min-h-screen bg-gray-50">
		<header class="bg-white border-b p-4">
			<UContainer class="flex justify-between items-center">
				<NuxtLink to="/" class="font-black text-xl tracking-tighter">
					GROUNDSPEED
				</NuxtLink>
				<nav class="flex gap-4">
					<UButton to="/" variant="ghost" color="gray">Home</UButton>
					<UButton to="/user" variant="ghost" color="gray"
						>User Portal</UButton
					>
					<UButton
						to="/admin"
						variant="ghost"
						color="gray"
						icon="i-heroicons-cog-6-tooth"
					/>
				</nav>
			</UContainer>
		</header>

		<main class="py-10">
			<slot />
		</main>
	</div>
</template>
