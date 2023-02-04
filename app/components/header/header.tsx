import Link from 'next/link';
import React from 'react';

const Header = () => {
	return (
		<header className="w-full p-4 fixed top-0 left-0 z-50 bg-teal-500">
			<nav className="w-full flex justify-evenly items-center text-white">
				<Link href="/">Home1</Link>
				<Link href="/">Home2</Link>
				<Link href="/">Home3</Link>
			</nav>
		</header>
	);
};

export default Header;
