export type ActivityCategory =
	| "Méditation"
	| "Respiration"
	| "Musique"
	| "Exercice"
	| "Relaxation";

export type ActivityDifficulty = "Facile" | "Moyen" | "Difficile";

export type Activity = {
	id: number;
	title: string;
	description: string;
	category: ActivityCategory;
	/** Pastille catégorie / repère visuel (souvent aligné sur la catégorie). */
	accentColor: string;
	difficulty: ActivityDifficulty;
	durationMinutes: number;
	defaultFavorite?: boolean;
};

export const activityCategories: ActivityCategory[] = [
	"Méditation",
	"Respiration",
	"Musique",
	"Exercice",
	"Relaxation",
];

export const activityDifficulties: ActivityDifficulty[] = [
	"Facile",
	"Moyen",
	"Difficile",
];

/** Couleur de la pilule lorsque la catégorie est sélectionnée (texte blanc). */
export const categoryFilterActiveColor: Record<
	ActivityCategory,
	string
> = {
	Méditation: "#9333ea",
	Respiration: "#2563eb",
	Musique: "#e11d48",
	Exercice: "#ea580c",
	Relaxation: "#0d9488",
};

/** Couleur de la pilule lorsque la difficulté est sélectionnée (texte blanc). */
export const difficultyFilterActiveColor: Record<
	ActivityDifficulty,
	string
> = {
	Facile: "#16a34a",
	Moyen: "#ca8a04",
	Difficile: "#dc2626",
};

type ActivitySeed = Omit<
	Activity,
	"id" | "accentColor"
>;

const activitySeeds: ActivitySeed[] = [
	{
		title: "Méditation guidée pour débutants",
		description:
			"Une séance de méditation douce pour apprendre les bases de la pleine conscience.",
		category: "Méditation",
		difficulty: "Facile",
		durationMinutes: 10,
		defaultFavorite: true,
	},
	{
		title: "Exercice de respiration 4-7-8",
		description:
			"Technique de respiration pour réduire le stress rapidement et calmer le système nerveux.",
		category: "Respiration",
		difficulty: "Facile",
		durationMinutes: 5,
	},
	{
		title: "Musique relaxante — Sons de la nature",
		description:
			"Écoutez les sons apaisants de la forêt pour vous détendre profondément.",
		category: "Musique",
		difficulty: "Facile",
		durationMinutes: 20,
	},
	{
		title: "Étirements doux du matin",
		description:
			"Séquence courte pour réveiller le corps en douceur et libérer les tensions.",
		category: "Exercice",
		difficulty: "Moyen",
		durationMinutes: 15,
	},
	{
		title: "Scan corporel progressif",
		description:
			"Parcours guidé pour relâcher chaque zone du corps et favoriser l’endormissement.",
		category: "Relaxation",
		difficulty: "Moyen",
		durationMinutes: 25,
	},
	{
		title: "Méditation avancée — silence intérieur",
		description:
			"Pratique prolongée pour approfondir la concentration et l’ancrage.",
		category: "Méditation",
		difficulty: "Difficile",
		durationMinutes: 30,
	},
	{
		title: "Respiration ventrale apaisante",
		description:
			"Posez les mains sur le ventre et suivez le rythme pour retrouver le calme.",
		category: "Respiration",
		difficulty: "Facile",
		durationMinutes: 8,
	},
	{
		title: "Balade sonore — Pluie et rivière",
		description:
			"Ambiances aquatiques pour se centrer et relâcher les pensées parasites.",
		category: "Musique",
		difficulty: "Facile",
		durationMinutes: 18,
	},
	{
		title: "Yoga doux — ouverture des hanches",
		description:
			"Postures lentes pour détendre le bas du dos et améliorer la souplesse.",
		category: "Exercice",
		difficulty: "Facile",
		durationMinutes: 12,
	},
	{
		title: "Relaxation Jacobson simplifiée",
		description:
			"Alternez tension et relâchement sur membres et épaules pour lâcher prise.",
		category: "Relaxation",
		difficulty: "Moyen",
		durationMinutes: 20,
	},
	{
		title: "Méditation sur le souffle",
		description:
			"Analysez le flux d’air aux narines pour ancrer l’attention au présent.",
		category: "Méditation",
		difficulty: "Facile",
		durationMinutes: 12,
	},
	{
		title: "Cohérence cardiaque 365",
		description:
			"Séance guidée en respiration à 5 cycles par minute pour équilibrer le rythme.",
		category: "Respiration",
		difficulty: "Moyen",
		durationMinutes: 10,
	},
	{
		title: "Piano ambiant pour la concentration",
		description:
			"Pistes douces favorisant le travail ou la lecture en silence intérieur.",
		category: "Musique",
		difficulty: "Facile",
		durationMinutes: 35,
	},
	{
		title: "Marche lente et conscience du corps",
		description:
			"Méditation debout : ressentir chaque appui et chaque mouvement.",
		category: "Exercice",
		difficulty: "Moyen",
		durationMinutes: 22,
	},
	{
		title: "Visualisation du lieu sûr",
		description:
			"Créez mentalement un espace apaisant pour vous ressourcer en quelques minutes.",
		category: "Relaxation",
		difficulty: "Facile",
		durationMinutes: 14,
	},
	{
		title: "Méditation loving-kindness",
		description:
			"Envoyez des vœux de bienveillance à vous-même et aux autres.",
		category: "Méditation",
		difficulty: "Moyen",
		durationMinutes: 18,
	},
	{
		title: "Respiration en carré",
		description:
			"Quatre temps égaux pour apaiser le mental avant un rendez-vous important.",
		category: "Respiration",
		difficulty: "Moyen",
		durationMinutes: 7,
	},
	{
		title: "Gong et bols — vibrations profondes",
		description:
			"Textures sonores riches pour une détente immédiate et corporelle.",
		category: "Musique",
		difficulty: "Facile",
		durationMinutes: 28,
	},
	{
		title: "Renforcement doux du tronc",
		description:
			"Gainage léger et respiration pour soutenir la posture sans crispation.",
		category: "Exercice",
		difficulty: "Moyen",
		durationMinutes: 16,
	},
	{
		title: "Détente des mâchoires et du visage",
		description:
			"Micro-mouvements et respiration pour lâcher le stress accumulé.",
		category: "Relaxation",
		difficulty: "Facile",
		durationMinutes: 9,
	},
	{
		title: "Méditation debout — ancrage",
		description:
			"Sentez le contact des pieds au sol et la colonne s’alléger.",
		category: "Méditation",
		difficulty: "Facile",
		durationMinutes: 11,
	},
	{
		title: "Respiration nasale alternée (Nadi Shodhana)",
		description:
			"Technique yogique pour harmoniser les deux hémisphères et clarifier l’esprit.",
		category: "Respiration",
		difficulty: "Difficile",
		durationMinutes: 15,
	},
	{
		title: "Playlist jazz apaisant",
		description:
			"Standards lents et textures chaleureuses pour une soirée sereine.",
		category: "Musique",
		difficulty: "Facile",
		durationMinutes: 40,
	},
	{
		title: "Mobilité nuque et épaules",
		description:
			"Enchaînement guidé pour les travailleurs sur écran.",
		category: "Exercice",
		difficulty: "Facile",
		durationMinutes: 10,
	},
	{
		title: "Atelier auto-massage des mains",
		description:
			"Pressions simples pour dénouer les tensions et se recentrer.",
		category: "Relaxation",
		difficulty: "Facile",
		durationMinutes: 8,
	},
	{
		title: "Méditation des sons environnants",
		description:
			"Écoutez sans juger les bruits autour de vous comme vague venue et partie.",
		category: "Méditation",
		difficulty: "Moyen",
		durationMinutes: 20,
	},
	{
		title: "Respiration allongée contre le stress",
		description:
			"Séance couchée pour ralentir le rythme cardiaque avant de dormir.",
		category: "Respiration",
		difficulty: "Facile",
		durationMinutes: 16,
	},
	{
		title: "Bruit blanc rose pour le sommeil",
		description:
			"Fond sonore doux pour masquer les perturbations et s’endormir.",
		category: "Musique",
		difficulty: "Facile",
		durationMinutes: 60,
	},
	{
		title: "Pilates doux niveau 1",
		description:
			"Contrôle du centre et respiration latérale pour un corps plus stable.",
		category: "Exercice",
		difficulty: "Moyen",
		durationMinutes: 24,
	},
	{
		title: "Sieste guidée express",
		description:
			"Parcours court pour une pause réparatrice sans s’endormir complètement.",
		category: "Relaxation",
		difficulty: "Facile",
		durationMinutes: 12,
	},
	{
		title: "Méditation marchée concentrée",
		description:
			"En intérieur ou dehors, synchronisez pas et conscience.",
		category: "Méditation",
		difficulty: "Difficile",
		durationMinutes: 25,
	},
	{
		title: "Respiration « ha » libératrice",
		description:
			"Expirez en son pour libérer la tension émotionnelle accumulée.",
		category: "Respiration",
		difficulty: "Facile",
		durationMinutes: 6,
	},
	{
		title: "Cordes et nature — paysages sonores",
		description:
			"Mélange d’instruments acoustiques et de field recordings relaxants.",
		category: "Musique",
		difficulty: "Facile",
		durationMinutes: 32,
	},
	{
		title: "Stretching du soir au sol",
		description:
			"Enchaînement calme pour préparer le corps au repos.",
		category: "Exercice",
		difficulty: "Facile",
		durationMinutes: 18,
	},
	{
		title: "Shiatsu facile : points du dos",
		description:
			"Démonstration pour soulager les tensions avec un coussin ou un mur.",
		category: "Relaxation",
		difficulty: "Moyen",
		durationMinutes: 17,
	},
	{
		title: "Méditation sur une phrase courte",
		description:
			"Répétez une formule apaisante pour cultiver une intention positive.",
		category: "Méditation",
		difficulty: "Facile",
		durationMinutes: 9,
	},
	{
		title: "Ventilation thoracique",
		description:
			"Ouvrez la cage et oxygénez le haut du corps en douceur.",
		category: "Respiration",
		difficulty: "Facile",
		durationMinutes: 7,
	},
	{
		title: "Harpe celtique pour se détendre",
		description:
			"Arpèges fluides propices à la récupération nerveuse.",
		category: "Musique",
		difficulty: "Facile",
		durationMinutes: 26,
	},
	{
		title: "Renfo mollets et chevilles",
		description:
			"Prévention des tensions et meilleure stabilité en station debout.",
		category: "Exercice",
		difficulty: "Facile",
		durationMinutes: 11,
	},
	{
		title: "Régulation émotionnelle — ancre 54321",
		description:
			"Reconnectez vos sens pour sortir d’un pic d’anxiété rapidement.",
		category: "Relaxation",
		difficulty: "Moyen",
		durationMinutes: 8,
	},
	{
		title: "Méditation vipassana introductive",
		description:
			"Observation des sensations avec une attention stable et bienveillante.",
		category: "Méditation",
		difficulty: "Difficile",
		durationMinutes: 35,
	},
	{
		title: "Respiration de feu douce (kapalabhati léger)",
		description:
			"Stimulation douce du système énergétique — à pratiquer avec précaution.",
		category: "Respiration",
		difficulty: "Difficile",
		durationMinutes: 8,
	},
	{
		title: "Ambient électronique lent",
		description:
			"Textures synthétiques feutrées pour la concentration profonde.",
		category: "Musique",
		difficulty: "Facile",
		durationMinutes: 45,
	},
	{
		title: "Circuit mobilité articulaire",
		description:
			"Rotations douces pour toutes les grandes articulations.",
		category: "Exercice",
		difficulty: "Moyen",
		durationMinutes: 14,
	},
	{
		title: "Hypnose légère — confiance en soi",
		description:
			"Induction douce pour renforcer une image de soi posée.",
		category: "Relaxation",
		difficulty: "Moyen",
		durationMinutes: 22,
	},
	{
		title: "Méditation des pensées-passages",
		description:
			"Observez les idées comme des nuages sans vous y accrocher.",
		category: "Méditation",
		difficulty: "Moyen",
		durationMinutes: 16,
	},
	{
		title: "Respiration prolongée — apnée douce",
		description:
			"Allongez lentement les expirations pour activer le parasympathique.",
		category: "Respiration",
		difficulty: "Difficile",
		durationMinutes: 12,
	},
	{
		title: "Chants harmoniques et drones",
		description:
			"Voyages sonores inspirés des traditions vocales apaisantes.",
		category: "Musique",
		difficulty: "Moyen",
		durationMinutes: 30,
	},
	{
		title: "Préparation course à pied — échauffement zen",
		description:
			"Mouvements dynamiques mais contrôlés pour éviter les blessures.",
		category: "Exercice",
		difficulty: "Difficile",
		durationMinutes: 20,
	},
	{
		title: "Cocooning : couverture et visualisation chaleureuse",
		description:
			"Confort thermique et image mentale pour se sentir en sécurité.",
		category: "Relaxation",
		difficulty: "Facile",
		durationMinutes: 13,
	},
	{
		title: "Micro-pause une minute",
		description:
			"Méditation ultra-courte pour les journées chargées.",
		category: "Méditation",
		difficulty: "Facile",
		durationMinutes: 1,
	},
	{
		title: "Respiration avant parole en public",
		description:
			"Routine courte pour stabiliser la voix et les mains.",
		category: "Respiration",
		difficulty: "Facile",
		durationMinutes: 5,
	},
	{
		title: "Oiseaux du matin — concert léger",
		description:
			"Pinsons et ruisseau pour commencer la journée en douceur.",
		category: "Musique",
		difficulty: "Facile",
		durationMinutes: 22,
	},
	{
		title: "Exercice des yeux et paupières",
		description:
			"Repos visuel et clignements conscients pour fatigues d’écran.",
		category: "Exercice",
		difficulty: "Facile",
		durationMinutes: 6,
	},
	{
		title: "Relaxation progressive des orteils",
		description:
			"Descendez l’attention pied par pied jusqu’au sommeil.",
		category: "Relaxation",
		difficulty: "Facile",
		durationMinutes: 15,
	},
	{
		title: "Méditation zen — posture du zazen",
		description:
			"Consignes pour tenir le dos et fixer un point sans rigidifier.",
		category: "Méditation",
		difficulty: "Difficile",
		durationMinutes: 28,
	},
	{
		title: "Respiration contre la colère",
		description:
			"Expirez plus longtemps que vous n’inspirez pour redescendre en pression.",
		category: "Respiration",
		difficulty: "Moyen",
		durationMinutes: 9,
	},
	{
		title: "Cordes à vide et vent léger",
		description:
			"Paysage sonore minimaliste pour la méditation assise.",
		category: "Musique",
		difficulty: "Facile",
		durationMinutes: 38,
	},
	{
		title: "Renforcement fessiers sans matériel",
		description:
			"Ponts et extensions pour un bassin stable au quotidien.",
		category: "Exercice",
		difficulty: "Moyen",
		durationMinutes: 13,
	},
	{
		title: "Conte relaxant — rivière et feu de camp",
		description:
			"Histoire douce narrée pour enfants et adultes en quête de réconfort.",
		category: "Relaxation",
		difficulty: "Facile",
		durationMinutes: 19,
	},
];

export const activities: Activity[] = activitySeeds.map(
	(seed, index) => ({
		id: index + 1,
		accentColor: categoryFilterActiveColor[seed.category],
		...seed,
	}),
);
