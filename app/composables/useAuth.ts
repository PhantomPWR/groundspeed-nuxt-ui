export const useAuth = () => {
	const config = useRuntimeConfig();
	const token = useCookie('auth_token', { maxAge: 60 * 60 * 24 });
	const user = useCookie<any>('auth_user');

	const isLoggedIn = computed(() => !!token.value);
	const isOwner = computed(() => user.value?.role === 'owner');

	const login = async (credentials: URLSearchParams) => {
		try {
			// 1. Get the token
			const data: any = await $fetch(
				`${config.public.apiBase}/auth/token`,
				{
					method: 'POST',
					body: credentials,
					headers: {
						'Content-Type': 'application/x-www-form-urlencoded',
					},
				},
			);

			// 2. Store the token immediately
			token.value = data.access_token;

			// 3. Fetch the user details using the new token
			const userDetails = await $fetch(
				`${config.public.apiBase}/auth/my_account`,
				{
					headers: {
						Authorization: `Bearer ${data.access_token}`,
					},
				},
			);

			// 4. Store user details
			user.value = userDetails;
			return true;
		} catch (e) {
			console.error('Login Error:', e);
			return false;
		}
	};

	const logout = () => {
		token.value = null;
		user.value = null;
		navigateTo('/');
	};

	return { token, user, isLoggedIn, isOwner, login, logout };
};
