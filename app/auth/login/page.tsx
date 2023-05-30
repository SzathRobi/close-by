'use client';

import { useSession, signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { FaGoogle } from 'react-icons/fa';

const LoginPage = () => {
	const { data: session }: any = useSession();
	const router = useRouter();

	useEffect(() => {
		signIn();
		// if (session) {
		// 	router.push('/');
		// }
	}, []);

	return (
		<div className="flex h-screen w-full items-center justify-center">
			<form>
				<button
					className="flex items-center justify-center gap-2 rounded border border-gray-500 py-2 px-4 transition-colors hover:bg-gray-200"
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
