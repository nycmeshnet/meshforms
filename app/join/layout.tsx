import { Header } from "@/components/Header/Header";
import { Footer } from "@/components/Footer/Footer";

export default function JoinLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	return <>

		<Header/>
		<section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
			<div className="inline-block max-w-lg text-center justify-center">
				{children}
			</div>
		</section>
		<Footer/>
	</>
}
