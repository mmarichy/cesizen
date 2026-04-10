export type ArticleCategoryColor =
	| "purple"
	| "green"
	| "blue"
	| "orange"
	| "yellow"
	| "red";

export type Article = {
	id: number;
	title: string;
	category: {
		label: string;
		color: ArticleCategoryColor;
	};
	smallDescription: string;
	description: string;
	author: string;
	date: string;
};

export const categories: {
	label: string;
	color: ArticleCategoryColor;
}[] = [
	{
		label: "Santé Mentale",
		color: "purple",
	},
	{
		label: "Bien-être",
		color: "green",
	},
	{ label: "Thérapies", color: "blue" },
	{
		label: "Activité physique",
		color: "orange",
	},
	{
		label: "Nutrition",
		color: "yellow",
	},
	{
		label: "Développement personnel",
		color: "red",
	},
];

/** Fond des pilules de filtre / chips lorsque la catégorie est sélectionnée (texte blanc). */
export const categoryPillActiveColor: Record<
	ArticleCategoryColor,
	string
> = {
	purple: "#9333ea",
	green: "#16a34a",
	blue: "#2563eb",
	orange: "#ea580c",
	yellow: "#ca8a04",
	red: "#dc2626",
};

export const articles: Article[] = [
	{
		id: 1,
		title:
			"Comprendre le stress et ses effets",
		category: { ...categories[2] }, // Thérapies
		smallDescription:
			"Mieux comprendre le stress pour l’apprivoiser au quotidien.",
		description:
			"Le stress est une réponse naturelle du corps face à des situations perçues comme menaçantes. Il se manifeste par des réactions physiologiques et psychologiques pouvant impacter la santé. Comprendre ses mécanismes permet de mieux le gérer au quotidien.",
		author: "Dr. Claire Moreau",
		date: "1 avril 2026",
	},
	{
		id: 2,
		title:
			"Développer son bien-être au quotidien",
		category: { ...categories[5] }, // Développement personnel
		smallDescription:
			"Petites habitudes pour équilibrer corps et esprit.",
		description:
			"Le bien-être résulte d’un équilibre entre le corps et l’esprit. Adopter de petites habitudes comme la gratitude, l’activité physique ou la respiration profonde améliore rapidement la qualité de vie.",
		author: "Camille Dufour",
		date: "1 avril 2026",
	},
	{
		id: 3,
		title:
			"Découvrir la thérapie cognitive et comportementale",
		category: { ...categories[0] }, // Santé Mentale
		smallDescription:
			"TCC : agir sur les pensées et comportements face à l’anxiété et la dépression.",
		description:
			"La thérapie cognitive et comportementale (TCC) est une approche efficace pour traiter l’anxiété et la dépression. Elle repose sur l’identification et la modification des schémas de pensée négatifs.",
		author: "Dr. Antoine Girard",
		date: "1 avril 2026",
	},
	{
		id: 4,
		title:
			"L’importance de l’activité physique pour le moral",
		category: { ...categories[1] }, // Bien-être
		smallDescription:
			"Endorphines et mouvement doux pour humeur et forme.",
		description:
			"L’exercice régulier libère des endorphines qui favorisent une humeur positive. Marcher, danser ou nager peut suffire à renforcer le bien-être mental et physique.",
		author: "Sophie Bernard",
		date: "1 avril 2026",
	},
	{
		id: 5,
		title:
			"Nutrition : Les aliments pour booster la santé mentale",
		category: { ...categories[4] }, // Nutrition
		smallDescription:
			"Aliments judicieux et assiette équilibrée contre stress et fatigue.",
		description:
			"Certains aliments comme les noix, poissons gras et légumes verts contribuent à une bonne santé mentale. Une alimentation équilibrée est un allié précieux contre le stress et la fatigue.",
		author: "Dr. Lucas Martin",
		date: "1 avril 2026",
	},
	{
		id: 6,
		title:
			"Développement personnel : Apprendre à se connaître",
		category: { ...categories[3] }, // Activité physique
		smallDescription:
			"Journal, méditation : des pistes pour mieux se connaître.",
		description:
			"Le développement personnel invite à explorer ses forces et faiblesses. Des outils simples comme le journal ou la méditation favorisent une meilleure connaissance de soi.",
		author: "Julie Petit",
		date: "1 avril 2026",
	},
	{
		id: 7,
		title:
			"Les bases de la méditation de pleine conscience",
		category: { ...categories[2] }, // Thérapies
		smallDescription:
			"Dix minutes par jour pour calme, focus et humeur.",
		description:
			"La méditation de pleine conscience aide à stabiliser l’humeur, se concentrer et réduire le stress. La pratiquer 10 minutes par jour suffit pour ressentir ses bienfaits.",
		author: "Dr. Clara Vasseur",
		date: "2 avril 2026",
	},
	{
		id: 8,
		title:
			"Routines matinales pour plus de productivité",
		category: { ...categories[4] }, // Nutrition
		smallDescription:
			"Rituels du matin qui préparent une journée productive.",
		description:
			"Intégrer une routine matinale axée sur le bien-être, comme le yoga ou la gratitude, prépare positivement la journée et augmente la productivité.",
		author: "Alexandre Chevalier",
		date: "2 avril 2026",
	},
	{
		id: 9,
		title:
			"Comment fonctionnent les thérapies brèves",
		category: { ...categories[0] }, // Santé Mentale
		smallDescription:
			"Thérapie courte, axée sur vos ressources, pour un blocage précis.",
		description:
			"Les thérapies brèves proposent des solutions rapides et concrètes pour surmonter des blocages spécifiques, en axant le travail sur les ressources de la personne.",
		author: "Dr. Sylvie Lemoine",
		date: "2 avril 2026",
	},
	{
		id: 10,
		title:
			"L’activité physique adaptée à chaque âge",
		category: { ...categories[1] }, // Bien-être
		smallDescription:
			"Marche, gym douce ou collectif : bouger à tout âge.",
		description:
			"L’exercice s’ajuste à l’âge : marche, renforcement doux, sports collectifs… À chaque profil sa solution pour un moral au top.",
		author: "Yann Bonnet",
		date: "2 avril 2026",
	},
	{
		id: 11,
		title:
			"L'importance des oméga-3 pour le cerveau",
		category: { ...categories[3] }, // Activité physique
		smallDescription:
			"Oméga-3 : mémoire, humeur et cerveau.",
		description:
			"Les oméga-3 présents dans les poissons et certaines huiles améliorent la mémoire, l’humeur et la santé cérébrale.",
		author: "Dr. Pauline Vidal",
		date: "2 avril 2026",
	},
	{
		id: 12,
		title:
			"S’épanouir grâce au développement personnel",
		category: { ...categories[5] }, // Développement personnel
		smallDescription:
			"Valeurs et objectifs clairs pour avancer sereinement.",
		description:
			"Identifier ses valeurs et ses objectifs de vie permet de mieux orienter ses choix et d’avancer sereinement.",
		author: "Adrien Robert",
		date: "2 avril 2026",
	},
	{
		id: 13,
		title:
			"Techniques anti-stress pour tous les jours",
		category: { ...categories[4] }, // Nutrition
		smallDescription:
			"Respiration et petits rituels pour rester zen.",
		description:
			"Respiration, visualisation et petits rituels : des techniques simples pour rester zen au quotidien.",
		author: "Dr. Claire Moreau",
		date: "3 avril 2026",
	},
	{
		id: 14,
		title:
			"Prendre soin de son sommeil",
		category: { ...categories[2] }, // Thérapies
		smallDescription:
			"Des gestes simples pour retrouver des nuits réparatrices, vitalité et concentration.",
		description:
			"Un bon sommeil assure vitalité et concentration. Découvrez des conseils pour retrouver des nuits réparatrices.",
		author: "Camille Dufour",
		date: "3 avril 2026",
	},
	{
		id: 15,
		title:
			"Thérapie familiale : renouer le dialogue",
		category: { ...categories[0] }, // Santé Mentale
		smallDescription:
			"Mieux communiquer et apaiser les tensions en famille.",
		description:
			"La thérapie familiale favorise la communication et résout les tensions pour le bien-être de tous les membres.",
		author: "Dr. Antoine Girard",
		date: "3 avril 2026",
	},
	{
		id: 16,
		title:
			"Sports collectifs : booster le moral par le groupe",
		category: { ...categories[1] }, // Bien-être
		smallDescription:
			"L’esprit d’équipe pour motivation et soutien.",
		description:
			"Faire partie d’une équipe apporte soutien social et motivation, essentiels au moral.",
		author: "Sophie Bernard",
		date: "3 avril 2026",
	},
	{
		id: 17,
		title:
			"Petits-déjeuners sains pour démarrer la journée",
		category: { ...categories[5] }, // Développement personnel
		smallDescription:
			"Petit-déj riche en fibres et protéines pour tenir la journée.",
		description:
			"Un petit-déjeuner équilibré, riche en fibres et en protéines, favorise la concentration et l’énergie.",
		author: "Dr. Lucas Martin",
		date: "3 avril 2026",
	},
	{
		id: 18,
		title:
			"S’affirmer : dire non en confiance",
		category: { ...categories[4] }, // Nutrition
		smallDescription:
			"Poser ses limites avec assertivité protège équilibre et estime de soi.",
		description:
			"Savoir poser ses limites est essentiel pour préserver son équilibre et son estime de soi.",
		author: "Julie Petit",
		date: "3 avril 2026",
	},
	{
		id: 19,
		title:
			"Gestion des émotions au quotidien",
		category: { ...categories[2] }, // Thérapies
		smallDescription:
			"Accueillir ses émotions pour mieux les réguler.",
		description:
			"Identifier et accueillir ses émotions permet de les réguler plus facilement.",
		author: "Dr. Claire Moreau",
		date: "4 avril 2026",
	},
	{
		id: 20,
		title: "Marcher pour son bien-être",
		category: { ...categories[3] }, // Activité physique
		smallDescription:
			"Marche quotidienne : mental apaisé, corps entretenu.",
		description:
			"La marche quotidienne apaise le mental et améliore la santé physique, même sans grande intensité.",
		author: "Camille Dufour",
		date: "4 avril 2026",
	},
	{
		id: 21,
		title:
			"L’art-thérapie, une voie créative",
		category: { ...categories[0] }, // Santé Mentale
		smallDescription:
			"La création ouvre un espace d’expression et de soin émotionnel pour tous.",
		description:
			"La créativité offre un espace d’expression et de réparation émotionnelle, accessible à tous.",
		author: "Dr. Antoine Girard",
		date: "4 avril 2026",
	},
	{
		id: 22,
		title:
			"Cardio-training : bon pour le corps et le moral",
		category: { ...categories[2] }, // Thérapies
		smallDescription:
			"Cardio pour hormones du bien-être et moins d’anxiété.",
		description:
			"Le cardio-training relâche des hormones de bien-être et diminue l’anxiété.",
		author: "Sophie Bernard",
		date: "4 avril 2026",
	},
	{
		id: 23,
		title:
			"Booster l’immunité grâce à la nutrition",
		category: { ...categories[1] }, // Bien-être
		smallDescription:
			"Vitamines, minéraux et variété alimentaire : des atouts pour rester en forme.",
		description:
			"Vitamines, minéraux, alimentation variée : nos meilleures alliées pour rester en forme.",
		author: "Dr. Lucas Martin",
		date: "4 avril 2026",
	},
	{
		id: 24,
		title:
			"La gratitude au cœur du bonheur",
		category: { ...categories[0] }, // Santé Mentale
		smallDescription:
			"Gratitude au quotidien : mieux se sentir et liens renforcés.",
		description:
			"Exprimer la gratitude chaque jour améliore la satisfaction personnelle et les relations.",
		author: "Julie Petit",
		date: "4 avril 2026",
	},
	{
		id: 25,
		title:
			"Prévenir le burn-out au travail",
		category: { ...categories[3] }, // Activité physique
		smallDescription:
			"Repérer les signes avant l’épuisement au travail.",
		description:
			"Reconnaître les signes du burn-out est crucial pour mieux l’éviter et agir rapidement.",
		author: "Dr. Claire Moreau",
		date: "5 avril 2026",
	},
	{
		id: 26,
		title:
			"Se relaxer grâce aux exercices de respiration",
		category: { ...categories[5] }, // Développement personnel
		smallDescription:
			"Respirer quelques minutes pour se détendre vite.",
		description:
			"Essayez différentes techniques de respiration pour apaiser l’esprit en quelques minutes.",
		author: "Camille Dufour",
		date: "5 avril 2026",
	},
	{
		id: 27,
		title:
			"EMDR : la thérapie des traumatismes",
		category: { ...categories[4] }, // Nutrition
		smallDescription:
			"Stimulation bilatérale pour apaiser des souvenirs traumatiques.",
		description:
			"L’EMDR est reconnue pour traiter les souvenirs douloureux grâce à la stimulation alternée des hémisphères cérébraux.",
		author: "Dr. Antoine Girard",
		date: "5 avril 2026",
	},
	{
		id: 28,
		title:
			"Yoga : relier le corps et l’esprit",
		category: { ...categories[2] }, // Thérapies
		smallDescription:
			"Étirements, force douce, apaisement : le yoga relie corps et mental en peu de temps.",
		description:
			"Le yoga assouplit, muscle et apaise. 20 minutes par jour suffisent pour constater les premiers effets.",
		author: "Sophie Bernard",
		date: "5 avril 2026",
	},
	{
		id: 29,
		title:
			"Les super-aliments en pratique",
		category: { ...categories[1] }, // Bien-être
		smallDescription:
			"Aliments « super » au menu pour énergie et humeur.",
		description:
			"Baies, graines, légumes colorés : intégrez-les à vos menus pour booster vitalité et humeur.",
		author: "Dr. Lucas Martin",
		date: "5 avril 2026",
	},
	{
		id: 30,
		title:
			"Se fixer des objectifs réalisables",
		category: { ...categories[0] }, // Santé Mentale
		smallDescription:
			"Objectifs découpés en étapes, plus simples à atteindre.",
		description:
			"Définir des objectifs étape par étape rend leur atteinte plus facile et gratifiante.",
		author: "Julie Petit",
		date: "5 avril 2026",
	},
	{
		id: 31,
		title:
			"Comprendre l’anxiété chez l’adulte",
		category: { ...categories[5] }, // Développement personnel
		smallDescription:
			"Comprendre l’anxiété à l’âge adulte pour choisir des stratégies utiles.",
		description:
			"L’anxiété touche de nombreux adultes et peut être gérée avec des méthodes adaptées.",
		author: "Dr. Claire Moreau",
		date: "6 avril 2026",
	},
	{
		id: 32,
		title:
			"L’importance de l’hydratation sur le bien-être",
		category: { ...categories[4] }, // Nutrition
		smallDescription:
			"Bien s’hydrater pour humeur, concentration et énergie.",
		description:
			"Boire suffisamment d’eau influe sur l’humeur, la concentration et l’énergie.",
		author: "Camille Dufour",
		date: "6 avril 2026",
	},
	{
		id: 33,
		title: "Comprendre l’hypnothérapie",
		category: { ...categories[3] }, // Activité physique
		smallDescription:
			"Hypnose pour explorer l’inconscient et changer une habitude.",
		description:
			"L’hypnose thérapeutique permet d’explorer l’inconscient pour modifier des comportements gênants.",
		author: "Dr. Antoine Girard",
		date: "6 avril 2026",
	},
	{
		id: 34,
		title:
			"Bouger au quotidien même sans sport",
		category: { ...categories[2] }, // Thérapies
		smallDescription:
			"Jardinage, ménage, marches courtes : l’activité du quotidien compte pour la forme.",
		description:
			"Jardinage, ménage, balade : toutes ces petites activités quotidiennes maintiennent en forme.",
		author: "Sophie Bernard",
		date: "6 avril 2026",
	},
	{
		id: 35,
		title:
			"Le rôle des vitamines B pour les nerfs",
		category: { ...categories[5] }, // Développement personnel
		smallDescription:
			"Vitamines B pour nerfs et équilibre émotionnel.",
		description:
			"Les vitamines B soutiennent le système nerveux et l’équilibre émotionnel.",
		author: "Dr. Lucas Martin",
		date: "6 avril 2026",
	},
	{
		id: 36,
		title:
			"Mieux gérer son temps grâce à l’organisation",
		category: { ...categories[1] }, // Bien-être
		smallDescription:
			"Mieux s’organiser pour moins de stress et plus d’essentiel.",
		description:
			"Une bonne organisation réduit le stress et permet de consacrer plus de temps à ce qui compte.",
		author: "Julie Petit",
		date: "6 avril 2026",
	},
];
