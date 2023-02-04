'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const LoginPage = () => {
	const { data: session }: any = useSession();
	const router = useRouter();

	useEffect(() => {
		if (session) {
			router.push('/');
		}
	}, [session]);

	return (
		<div className="w-full h-screen flex items-center justify-center">
			<form>
				<button onClick={() => signIn()}>Bejelentkezés</button>
			</form>
		</div>
	);
};

export default LoginPage;
