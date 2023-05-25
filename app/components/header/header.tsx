import React from 'react';

interface HeaderProps {
	onContactsClick: any;
	onLogoutClick: any;
}

const Header = ({
	onContactsClick = null,
	onLogoutClick = null
}: HeaderProps) => {
	return (
		<header className="w-full h-10 flex items-center justify-end absolute top-0 left-0 bg-emerald-500 shadow-md shadow-neutral-400 z-40">
			<nav className="w-full mr-20 flex justify-end items-center gap-10">
				<button
					className="text-white hover:text-emerald-800 transition-colors"
					onClick={() => onContactsClick()}
				>
					Kontaktok
				</button>
				<button
					className="text-white hover:text-emerald-800 transition-colors"
					onClick={() => onLogoutClick()}
				>
					Kijelentkezés
				</button>
			</nav>
		</header>
	);
};

export default Header;
