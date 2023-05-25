'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FaGoogle } from 'react-icons/fa';

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
				<button
					className="py-2 px-4 rounded border border-gray-500 flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors"
					onClick={() => signIn()}
				>
					Bejelentkezés google fiókkal
					<FaGoogle />
				</button>
			</form>
		</div>
	);
};

export default LoginPage;
