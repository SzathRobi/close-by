import Header from './components/header/header';
import './globals.css';
import ProvidersWrapper from './provider-wrapper';

export default function RootLayout({
	children
}: {
	children: React.ReactNode;
}) {
	return (
		<html lang="hu">
			{/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
			<head>
				<link
					href="https://api.mapbox.com/mapbox-gl-js/v2.6.1/mapbox-gl.css"
					rel="stylesheet"
				/>
			</head>
			<body>
				<ProvidersWrapper>
					{/* <Header /> */}
					{children}
				</ProvidersWrapper>
			</body>
		</html>
	);
}
