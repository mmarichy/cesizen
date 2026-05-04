import Link from "next/link";
import {
	LogIn,
	Shield,
	ShieldCheck,
	Sparkles,
	UserPlus,
} from "lucide-react";

type AuthPageLayoutProps = {
	active: "register" | "login";
	children: React.ReactNode;
};

export function AuthPageLayout({
	active,
	children,
}: AuthPageLayoutProps) {
	const features = [
		{
			icon: Shield,
			text: "Plateforme officielle du Ministère de la Santé",
		},
		{
			icon: Sparkles,
			text: "Contenus validés par des professionnels",
		},
		{
			icon: ShieldCheck,
			text: "Confidentialité garantie - Conformité RGPD",
		},
	];

	return (
		<div className="bg-linear-to-br from-emerald-400 via-emerald-500 to-teal-700">
			<div className="mx-auto flex max-w-7xl flex-col gap-10 px-4 py-10 md:px-8 lg:flex-row lg:items-center lg:gap-12 lg:px-12 lg:py-14">
				{/* Colonne gauche */}
				<div className="flex flex-1 flex-col justify-center gap-8 lg:max-w-xl lg:py-8">

					<div className="space-y-4">
						<h1 className="text-3xl font-bold leading-tight text-slate-800 md:text-4xl lg:text-[2.5rem]">
							Prenez soin de votre santé
							mentale
						</h1>
						<p className="max-w-lg text-bold leading-relaxed text-slate-800 md:text-lg">
							Rejoignez CESIZen pour accéder à des ressources exclusives, des exercices
							de détente.
						</p>
					</div>

					<ul className="flex flex-col gap-3">
						{features.map(
							({
								icon: Icon,
								text,
							}) => (
								<li
									key={text}
									className="flex items-center gap-3 rounded-2xl bg-white/10 px-4 py-3 backdrop-blur-sm">
									<span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-white">
										<Icon
											className="size-5 text-emerald-600"
											aria-hidden
										/>
									</span>
									<span className="text-sm font-bold text-slate-800 md:text-[16px]">
										{text}
									</span>
								</li>
							),
						)}
					</ul>
				</div>

				{/* Carte droite */}
				<div className="flex w-full flex-1 justify-center lg:justify-end lg:py-8">
					<div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl shadow-black/10 md:p-8">
						<div className="mb-8 flex rounded-2xl bg-emerald-50 p-1">
							<Link
								href="/auth/register"
								className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors md:py-3 md:text-[0.9375rem] ${
									active === "register"
										? "bg-emerald-600 text-white shadow-md"
										: "text-emerald-600 hover:text-emerald-600"
								}`}>
								<UserPlus
									className="size-4 shrink-0"
									aria-hidden
								/>
								Inscription
							</Link>
							<Link
								href="/auth/login"
								className={`flex flex-1 items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-colors md:py-3 md:text-[0.9375rem] ${
									active === "login"
										? "bg-emerald-600 text-white shadow-md"
										: "text-emerald-600 hover:text-emerald-600"
								}`}>
								<LogIn
									className="size-4 shrink-0"
									aria-hidden
								/>
								Connexion
							</Link>
						</div>

						{children}
					</div>
				</div>
			</div>
		</div>
	);
}
