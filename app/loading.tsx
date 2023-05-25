import FullPageLoader from './components/loaders/full-page/full-page-loader';

export default function Loading() {
	return (
		<div className="flex h-screen w-full items-center justify-center">
			<FullPageLoader />
		</div>
	);
}
