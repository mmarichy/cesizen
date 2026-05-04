import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcrypt";

import {
  AdminAuditAction,
  ActivityDuration,
  DifficultyLevel,
  PrismaClient,
  Role,
  StatusType,
} from "../src/app/generated/prisma";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

/** Un tag par catégorie article (voir `ARTICLE_CATEGORY_DEFINITIONS`). */
const articleSeeds = [
  {
    id: "6c479710-ef5b-44a4-a8f9-7079f952af7a",
    tag: "sante-mentale",
    title: "Santé mentale — Apprivoiser ses émotions",
    description:
      "Mieux comprendre et réguler ses états émotionnels au quotidien.",
    content: `
## 🧠 Nommer, comprendre, réguler et entretenir ses ressources intérieures

### Reconnaître · Nommer l'émotion
La première étape vers une meilleure santé mentale est l'identification précise de ce que l'on ressent. Trop souvent, nous étiquetons nos états intérieurs de manière vague — "je ne vais pas bien", "je suis stressé" — sans aller plus loin. Or, nommer une émotion avec précision (frustration, honte, solitude, impuissance) active le cortex préfrontal et réduit mécaniquement l'intensité de la réaction limbique. C'est ce que les neuroscientifiques appellent le "affect labeling".

### Comprendre · Explorer l'origine
Chaque émotion est un signal, non une sentence. Derrière une colère se cache souvent une limite franchie ; derrière une tristesse, une perte non reconnue ; derrière l'anxiété, un besoin de contrôle insatisfait. Prenez l'habitude de vous poser une question simple lorsqu'une émotion intense surgit : *"Qu'est-ce que cette émotion essaie de me dire ?"* Ce questionnement transforme l'émotion d'obstacle en information.

### Réguler · Agir sans réagir
La régulation émotionnelle ne signifie pas supprimer ce que l'on ressent, mais choisir la manière d'y répondre. Des techniques comme la respiration diaphragmatique, la distanciation cognitive ("je remarque que je ressens de la colère" plutôt que "je suis en colère") ou le recadrage situationnel permettent de créer un espace entre le stimulus et la réaction. Cet espace, c'est la liberté.

### Entretenir · Construire sa résilience
La santé mentale est un muscle : elle se construit dans la durée, par des habitudes régulières. Journaling quotidien, thérapie, méditation, mais aussi qualité du sommeil, exercice physique et liens sociaux nourrissants — tous ces piliers forment un écosystème protecteur. Aucune technique isolée ne suffit ; c'est leur combinaison cohérente qui génère une vraie résilience.`,
    date: new Date("2026-04-06"),
    author: "Dr. Sophie Martin",
  },
  {
    id: "89ea88df-8f68-47df-b0df-4d090ca45864",
    tag: "bien-etre",
    title: "Bien-être — Rituels du quotidien",
    description:
      "Ancrer des habitudes simples pour cultiver un état de bien-être durable.",
    content: `
## 🌸 Du réveil au soir : intention, micro-récupération et lien social

### Matin · Poser l'intention
Les premières minutes après le réveil conditionnent la tonalité de toute la journée. Résistez à l'impulsion d'attraper votre téléphone. Prenez plutôt 5 minutes pour vous asseoir en silence, respirer lentement et formuler mentalement une intention simple pour la journée — non pas une liste de tâches, mais un état d'être : *"Aujourd'hui, je choisis la patience"*, *"Aujourd'hui, je prends soin de mon énergie"*. Cette micro-pratique active le mode intentionnel plutôt que le mode réactif.

### Journée · Micro-pauses conscientes
Le bien-être ne se construit pas uniquement dans de grands moments de détente, mais aussi dans des micro-pauses régulières insérées dans le flux de la journée. Une minute d'étirement toutes les heures, trois respirations profondes avant une réunion difficile, une courte marche après le déjeuner sans écran : ces micro-interruptions du mode automatique rechargent l'attention et régulent le système nerveux de manière continue.

### Soir · Décompresser activement
La transition entre vie professionnelle et vie personnelle est un moment clé souvent négligé. Créez un rituel de "décompression active" : une activité physique légère, une douche chaude, une lecture, de la musique. L'objectif est d'envoyer un signal clair à votre cerveau que la journée de travail est terminée, pour permettre au système nerveux de basculer vers le mode repos et favoriser un sommeil de qualité.

### Connexion · Nourrir les liens
Le bien-être est profondément social. Des études longitudinales, dont la célèbre Harvard Study of Adult Development, montrent que la qualité des relations interpersonnelles est le prédicteur le plus fiable de la santé et du bonheur à long terme — plus que la richesse, la notoriété ou les accomplissements. Investissez délibérément dans vos relations : un message sincère, un repas partagé, une vraie conversation sans distraction.`,
    date: new Date("2026-04-07"),
    author: "Dr. Sophie Martin",
  },
  {
    id: "28154e16-4207-4cf6-9f34-56d8af8b80ca",
    tag: "therapies",
    title: "Thérapies — Trouver son approche",
    description:
      "Comprendre les grandes approches thérapeutiques pour choisir celle qui vous correspond.",
    content: `
## 💆 TCC, psychodynamique, humaniste, somatique : ce qui les distingue

### Cognitivo-comportementale · Changer les schémas de pensée
La Thérapie Cognitivo-Comportementale (TCC) est l'une des approches les plus documentées scientifiquement. Elle repose sur un principe central : nos pensées influencent nos émotions, qui influencent nos comportements. En identifiant et en restructurant les pensées automatiques négatives (catastrophisme, pensée tout-ou-rien, sur-généralisation), le patient apprend à modifier progressivement ses réactions émotionnelles et comportementales. Particulièrement efficace pour l'anxiété, la dépression et les phobies.

### Psychodynamique · Explorer l'inconscient
Héritière de la psychanalyse, la thérapie psychodynamique cherche à mettre au jour les conflits inconscients, les schémas relationnels précoces et les mécanismes de défense qui organisent silencieusement notre vie psychique. Elle s'intéresse au *pourquoi profond* plutôt qu'au *comment pratique*. La relation thérapeutique elle-même devient un espace d'exploration : ce que le patient rejoue avec le thérapeute reflète souvent ce qu'il rejoue dans sa vie. Indiquée pour les problématiques identitaires, relationnelles ou les traumatismes anciens.

### Humaniste · Vers la pleine réalisation
Les thérapies humanistes (approche centrée sur la personne de Carl Rogers, Gestalt-thérapie) placent l'être humain au centre, avec une conviction fondamentale : chaque individu possède en lui les ressources nécessaires à sa propre guérison et à sa croissance. Le thérapeute n'est pas un expert qui diagnostique, mais un accompagnateur empathique qui crée les conditions d'un espace sécurisé. Ces approches privilégient l'expérience présente, l'authenticité et la conscience de soi.

### Somatique · Le corps comme voie d'accès
Les thérapies somatiques (EMDR, Somatic Experiencing, thérapie sensori-motrice) partent d'un constat neurobiologique : le trauma et les émotions non digérées sont stockés dans le corps, pas seulement dans les récits mentaux. En travaillant directement sur les sensations corporelles, le mouvement et la régulation du système nerveux autonome, ces approches permettent de libérer des mémoires traumatiques là où la parole seule ne suffit pas. Recommandées pour les traumatismes, le stress post-traumatique ou les pathologies psychosomatiques.`,
    date: new Date("2026-04-08"),
    author: "Dr. Marc Legrand",
  },
  {
    id: "a1b2c3d4-e5f6-4789-a012-3456789abcde",
    tag: "activite-physique",
    title: "Activité physique — Bouger avec intelligence",
    description:
      "Construire une pratique physique durable, adaptée à son corps et à son mode de vie.",
    content: `
## 🏃 Partir de son corps, tenir dans la durée, récupérer, prendre du plaisir

### Fondations · Comprendre son corps
Avant de choisir une activité ou un programme, il est essentiel de comprendre sa propre physiologie. Êtes-vous plutôt endurant ou explosif ? Avez-vous des déséquilibres musculaires, des douleurs articulaires chroniques, un passé sédentaire ? Un bilan postural ou une séance avec un kinésithérapeute du sport peut révéler des informations précieuses. Partir de la réalité de son corps — et non d'un idéal extérieur — est la condition d'une pratique physique à la fois efficace et durable.

### Régularité · La clé de la progression
La progression physique ne dépend pas de l'intensité des séances, mais de leur régularité dans le temps. Une heure d'effort intense suivie de deux semaines d'inactivité produit moins d'effets qu'une pratique modérée mais quotidienne. Le principe de surcompensation — la capacité du corps à se reconstruire plus fort après un effort — ne s'active que lorsque les sollicitations sont régulières et progressives. Trois séances de 30 minutes par semaine, maintenues sur six mois, transforment plus durablement un corps que n'importe quel défi intensif.

### Équilibre · Alterner effort et récupération
L'erreur la plus fréquente chez les sportifs amateurs est de négliger la récupération. Or, c'est pendant le repos — et non pendant l'effort — que le corps s'adapte, que les fibres musculaires se reconstruisent et que le système nerveux se régénère. Intégrez des séances de mobilité, d'étirements, de marche légère ou de yoga dans votre semaine. Apprenez à distinguer la fatigue normale post-effort de la fatigue chronique qui signale un surentraînement.

### Plaisir · Le moteur durable
Aucun programme d'entraînement ne tient dans la durée sans une dose de plaisir intrinsèque. Si courir vous ennuie, dansez. Si la salle de sport vous oppresse, pratiquez en plein air. Le meilleur exercice est celui que vous ferez vraiment, régulièrement, avec un minimum d'enthousiasme. Expérimentez, variez, pratiquez avec d'autres si la dimension sociale vous motive. Le corps suit toujours la direction que lui indique l'esprit.`,
    date: new Date("2026-04-09"),
    author: "Camille Bernard",
  },
  {
    id: "b2c3d4e5-f6a7-4890-b123-456789abcdef",
    tag: "nutrition",
    title: "Nutrition — Manger pour vivre mieux",
    description:
      "Développer une relation saine et éclairée à l'alimentation.",
    content: `
## 🥗 Pleine attention, aliments entiers, microbiome et alimentation réaliste

### Conscience · Manger en pleine attention
L'alimentation moderne est souvent déconnectée de l'expérience sensorielle réelle : on mange vite, devant un écran, sans vraiment goûter. La nutrition consciente (mindful eating) propose de revenir à une attention pleine portée à l'acte de manger — les textures, les saveurs, les odeurs, mais aussi les signaux de faim et de satiété. Cette seule pratique, sans aucun régime, peut réduire les comportements alimentaires compulsifs et améliorer la digestion.

### Qualité · Privilégier le non-transformé
Au-delà des macronutriments (protéines, glucides, lipides) et des calories, c'est la qualité intrinsèque des aliments qui détermine leur impact sur la santé. Les aliments ultra-transformés (AUT) — reconnaissables à leurs longues listes d'ingrédients industriels — perturbent le microbiome intestinal, génèrent des pics glycémiques et sont conçus pour contourner les mécanismes naturels de satiété. Privilégier les aliments bruts, entiers et peu transformés est la règle nutritionnelle la plus consensuelle et la plus robuste dans la littérature scientifique.

### Microbiome · L'intestin, second cerveau
La recherche des vingt dernières années a révolutionné notre compréhension de l'intestin. Le microbiome — l'ensemble des milliards de bactéries qui colonisent notre tube digestif — influence non seulement la digestion et l'immunité, mais aussi l'humeur, la cognition et la réponse au stress via l'axe intestin-cerveau. Nourrir son microbiome passe par une alimentation riche en fibres variées (légumineuses, légumes racines, céréales complètes) et en aliments fermentés (yaourt, kéfir, miso, choucroute).

### Équilibre · Sortir de la logique des régimes
Les régimes restrictifs produisent des résultats à court terme au prix de conséquences délétères à long terme : ralentissement métabolique, relation anxieuse à la nourriture, effets yoyo. L'objectif d'une nutrition saine n'est pas la perfection mais la cohérence : 80% d'aliments nourrissants, 20% de plaisir sans culpabilité. Cette approche flexible, documentée sous le nom de "flexible dieting" ou alimentation intuitive, est celle qui génère les meilleures adhésions sur le long terme.`,
    date: new Date("2026-04-10"),
    author: "Claire Dubois",
  },
  {
    id: "c3d4e5f6-a7b8-4901-c234-567890abcdef",
    tag: "developpement-personnel",
    title: "Développement personnel — Devenir auteur de sa vie",
    description:
      "Cultiver la connaissance de soi et construire une trajectoire de vie alignée.",
    content: `
## 🌱 Se connaître, clarifier le sens, passer à l'acte — sans se brûler les ailes

### Connaissance de soi · La boussole intérieure
Tout développement personnel authentique commence par une question radicalement honnête : *Qui suis-je vraiment, en dehors des rôles que je joue et des attentes que je cherche à satisfaire ?* Des outils comme le journaling introspectif, les tests de personnalité (MBTI, Ennéagramme, Big Five) ou simplement les retours de personnes de confiance permettent de cartographier ses valeurs profondes, ses forces naturelles et ses zones d'ombre. Cette carte intérieure est le point de départ de toute direction choisie plutôt que subie.

### Vision · Clarifier ce que l'on veut vraiment
Beaucoup de personnes savent précisément ce qu'elles ne veulent pas, mais restent floues sur ce qu'elles désirent profondément. Clarifier sa vision — non pas en termes d'objectifs SMART, mais en termes d'état d'être et de sens — est un travail exigeant mais fondateur. Des exercices comme la lettre à soi-même dans 10 ans, le "wheel of life" ou la question de l'épitaphe (*"Qu'est-ce que je veux que les autres disent de ma vie ?"*) permettent de contourner le mental rationnel pour toucher ce qui compte vraiment.

### Action · Transformer l'intention en mouvement
La lecture de livres de développement personnel, les podcasts inspirants et les prises de conscience intellectuelles ne changent rien tant qu'ils ne se traduisent pas en comportements concrets et répétés. Le changement durable ne vient pas d'une motivation sporadique mais de systèmes d'habitudes progressivement ancrés dans le quotidien. Commencez infiniment petit — une seule nouvelle habitude à la fois — pour contourner la résistance au changement et laisser la dynamique s'installer d'elle-même.

### Intégration · Réconcilier les paradoxes
Le développement personnel mature n'est pas une course vers la perfection ou l'optimisation permanente de soi. C'est une démarche de réconciliation : avec ses limites, ses contradictions, ses échecs passés et sa vulnérabilité. Les périodes de stagnation, de doute ou de régression ne sont pas des échecs — elles font partie intégrante du processus. Apprendre à s'accompagner avec la même bienveillance qu'on offrirait à un ami cher est peut-être la compétence la plus transformatrice de toutes.`,
    date: new Date("2026-04-11"),
    author: "Julie Petit",
  },
] as const;

/** Une activite par categorie affichee dans le front (lib/activities.ts). */
const activitySeeds = [
  {
    id: "d28d8f3e-f0b3-4fb8-8f3e-15f12e6c3f21",
    tag: "meditation",
    title: "Méditation — Pleine Présence",
    description:
      "Ancrage et clarté mentale rapide.",
    content: `
## 🌿 Trois temps pour retrouver le silence intérieur

>💡<small><strong>Astuce :</strong> Choisissez un moment où vous ne serez pas interrompu ; un minuteur discret évite de jeter un œil à l'heure.</small>

### 0 - 5 min · Ancrage
Asseyez-vous ou allongez-vous confortablement. Portez votre attention sur les points de contact entre votre corps et le support — la pression de vos cuisses sur la chaise, le poids de vos pieds sur le sol, la chaleur de votre dos contre le dossier. Ne cherchez pas à analyser ces sensations, contentez-vous de les observer et de les nommer intérieurement. Cet ancrage sensoriel coupe le flux des pensées en court-circuit.

### 5 - 12 min · Observation
Laissez les pensées surgir naturellement, sans les retenir ni les chasser. Imaginez votre esprit comme un ciel bleu et chaque pensée comme un nuage qui traverse lentement le champ de vision. Observez-les passer — une inquiétude, un souvenir, une tâche oubliée — puis regardez-les s'éloigner d'elles-mêmes. Vous n'êtes pas vos pensées : vous êtes celui qui les observe.

### 12 - 15 min · Gratitude
Avant d'ouvrir les yeux, prenez trois respirations lentes et identifiez mentalement trois éléments positifs de votre journée — même infimes : un café chaud, un échange agréable, un moment de calme. Formulez mentalement une phrase simple pour chacun. Cette clôture par la gratitude recalibre l'attention vers ce qui fonctionne bien, et ancre un état émotionnel positif durable.`,
    difficulty: DifficultyLevel.EASY,
    duration: ActivityDuration.MIN_15,
    date: new Date("2026-04-06"),
    author: "Camille Bernard",
  },
  {
    id: "6c2439d5-8f85-4f8f-87d9-f2adfcd853ec",
    tag: "respiration",
    title: "Respiration — L'Art du Souffle Profond",
    description:
      "Maîtrise avancée de l'énergie vitale (Pranayama).",
    content: `
## 🌬️ Du nettoyage des nadis au souffle spontané

>💡<small><strong>Astuce :</strong> Asseyez-vous dos droit ; si le carré à 8 s vous essouffle, raccourcissez les phases plutôt que de forcer.</small>

### 0 - 15 min · Nettoyage
Pratiquez le Nadi Shodhana, ou respiration alternée des narines. Bouchez la narine droite avec le pouce, inspirez par la gauche sur 4 secondes. Bouchez ensuite la narine gauche avec l'annulaire, expirez par la droite sur 4 secondes. Inversez. Ce cycle alterne l'activation des deux hémisphères cérébraux et rééquilibre progressivement le système nerveux autonome — idéal pour sortir d'un état de stress ou d'agitation mentale.

### 15 - 35 min · Puissance
Passez au Kapalabhati, le "souffle de feu". Inspirez passivement par le nez, puis expirez par contractions abdominales courtes, rapides et répétées (environ une par seconde). Réalisez 3 cycles de 30 à 50 expirations, séparés par une pause de respiration naturelle. Cette technique stimule le système sympathique, clarifie l'esprit et active le diaphragme en profondeur. Attention : pratiquez sur un estomac vide.

### 35 - 50 min · Rétention
Pratiquez le carré respiratoire avancé à 8 secondes : inspirez profondément sur 8 s, retenez les poumons pleins sur 8 s, expirez lentement sur 8 s, retenez les poumons vides sur 8 s. Ce rythme, plus long que le carré classique, sollicite le système nerveux parasympathique et entraîne une tolérance accrue au CO₂. Concentrez-vous sur la régularité plutôt que sur la profondeur.

### 50 - 60 min · Intégration
Laissez le souffle redevenir entièrement naturel et spontané, sans le contrôler. Asseyez-vous immobile, les mains posées sur les genoux. Portez toute votre attention sur la sensation physique de l'air entrant dans les narines — sa fraîcheur à l'inspiration, sa chaleur à l'expiration. Demeurez dans cet état de méditation respiratoire jusqu'à la fin, en témoin silencieux de votre propre vie intérieure.`,
    difficulty: DifficultyLevel.HARD,
    duration: ActivityDuration.HOUR_1,
    date: new Date("2026-04-07"),
    author: "Camille Bernard",
  },
  {
    id: "e4f5a6b7-c8d9-4e0f-a345-678901234567",
    tag: "musique",
    title: "Musique — Immersion Méditative Sonore",
    description:
      "Concentration et voyage intérieur par l'auditif.",
    content: `
## 🎵 De la couverture sonore au silence habité

>💡<small><strong>Astuce :</strong> Volume modéré pour préserver l'oreille ; un casque confortable aide à tenir les longues écoutes sans fatigue.</small>

### 0 - 10 min · Isolation
Enfilez votre casque ou vos écouteurs et lancez une piste de bruits roses (pink noise) ou de sons naturels — pluie, rivière, forêt. Fermez les yeux, ne cherchez pas à analyser : laissez simplement les sons envelopper votre mental agité comme une couverture sonore. L'objectif est de couper progressivement le flux de pensées parasites et de ramener l'attention dans l'instant présent.

### 10 - 30 min · Écoute Active
Basculez vers une composition musicale accordée à 432 Hz, réputée pour son effet apaisant sur le système nerveux. Pratiquez l'écoute analytique : choisissez un seul instrument (le piano, la basse, les cordes) et suivez-le exclusivement tout au long du morceau. Lorsque votre attention dérive, ramenez-la doucement sur cet instrument. C'est un entraînement de la concentration pure.

### 30 - 40 min · Bain de Sons
Passez à une piste de fréquences de solfège sacré, idéalement à 528 Hz, associée à la régénération et à la relaxation profonde. Abandonnez l'effort d'analyse : ouvrez simplement votre perception à l'ensemble du spectre sonore. Laissez les vibrations résonner dans votre corps. Si votre esprit part, observez-le partir, puis revenez aux sons sans jugement.

### 40 - 45 min · Silence
Retirez lentement le casque. Ne bougez pas immédiatement. Restez immobile et observez le silence qui suit — ou plutôt, les sons subtils qui le composent : votre souffle, les bruits lointains de l'environnement, les micro-sons de la pièce. Ce retour progressif au réel ancre l'expérience et prolonge l'état de calme acquis.`,
    difficulty: DifficultyLevel.MEDIUM,
    duration: ActivityDuration.MIN_45,
    date: new Date("2026-04-08"),
    author: "Nora Petit",
  },
  {
    id: "56fa2ef0-0de8-4f67-b32d-c750ad6f6468",
    tag: "exercice",
    title: "Exercice — Circuit Tonus Intermédiaire",
    description:
      "Renforcement musculaire et vitalité.",
    content: `
## 💪 Échauffement, circuit, mobilité et descente en récupération

>💡<small><strong>Astuce :</strong> Gardez de l'eau à portée de main ; en cas de douleur aiguë, arrêtez — l'amplitude propre prime sur la vitesse.</small>

### 0 - 5 min · Échauffement
Commencez debout, les pieds écartés à la largeur des épaules. Effectuez des rotations lentes et contrôlées du cou, des poignets et des chevilles dans les deux sens. Enchaînez avec 2 minutes de marche dynamique sur place en levant bien les genoux et en balançant les bras. L'objectif est d'augmenter progressivement la température musculaire et la lubrification articulaire avant l'effort.

### 5 - 20 min · Circuit (2 tours)
Réalisez deux tours complets du circuit suivant, en vous accordant 20 à 30 secondes de repos entre chaque exercice. **10 Squats** : pieds parallèles, descendez les hanches sous les genoux, dos droit. **10 Pompes** (genoux au sol si nécessaire) : corps aligné, coudes à 45°. **30 s de Planche** : abdos contractés, nuque dans l'axe. **15 Fentes** : pas en avant, genou arrière proche du sol, alterné à chaque jambe.

### 20 - 25 min · Mobilité
Passez en douceur aux étirements actifs. En posture du chien tête en bas, poussez les talons vers le sol et alternez la flexion de chaque genou pour cibler les ischio-jambiers et les mollets. Enchaînez avec un étirement du psoas en fente basse : genou arrière au sol, bassin poussé vers l'avant, bras levés pour amplifier l'ouverture de la hanche. Maintenez chaque position 30 secondes.

### 25 - 30 min · Récupération
Allongez-vous sur le dos, les bras le long du corps. Placez une main sur le ventre et respirez lentement et profondément : inspirez en gonflant le ventre sur 4 secondes, expirez lentement sur 6 secondes. Répétez jusqu'à la fin de la séance. Sentez votre rythme cardiaque descendre progressivement et votre corps entrer dans une phase de récupération active.`,
    difficulty: DifficultyLevel.MEDIUM,
    duration: ActivityDuration.MIN_30,
    date: new Date("2026-04-09"),
    author: "Nora Petit",
  },
  {
    id: "f5a6b7c8-d9e0-41f2-b456-789012345678",
    tag: "relaxation",
    title: "Relaxation — Le Calme Instantané",
    description:
      "Détente rapide après une journée stressante.",
    content: `
## 😌 Quinze minutes pour relâcher la journée

>💡<small><strong>Astuce :</strong> Un plaid léger pendant la visualisation évite la baisse de température qui peut couper la concentration.</small>

### 0 - 5 min · Déconnexion
Installez-vous dans une position confortable, assis ou allongé, dans un endroit calme. Fermez doucement les yeux, relâchez consciemment la mâchoire en laissant les dents se décoller légèrement, et laissez vos épaules tomber naturellement vers le bas. Respirez lentement par le nez.

### 5 - 12 min · Auto-massage
Posez vos index et majeurs sur vos tempes et effectuez de petites pressions circulaires douces, en variant la direction. Remontez ensuite vers le cuir chevelu. Passez ensuite aux mains : travaillez le centre de chaque paume avec le pouce opposé, puis remontez vers chaque doigt. Prenez le temps de sentir la chaleur se diffuser.

### 12 - 15 min · Visualisation
Imaginez une lumière chaude et dorée apparaître au sommet de votre crâne. Laissez-la descendre lentement le long de votre nuque, de vos épaules, de votre poitrine, de votre ventre, jusqu'aux pieds. À chaque zone qu'elle traverse, sentez les muscles se relâcher complètement, comme si la tension fondait sous la chaleur.`,
    difficulty: DifficultyLevel.EASY,
    duration: ActivityDuration.MIN_15,
    date: new Date("2026-04-10"),
    author: "Camille Bernard",
  },
] as const;

async function main() {
  console.log("Seeding...");

  const email = "admin@cesizen.local";
  const plainPassword = "Admin123!";

  const hashedPassword = await bcrypt.hash(plainPassword, 12);

  const adminUser = await prisma.user.upsert({
    where: { email },
    update: {
      firstname: "Admin",
      lastname: "Cesizen",
      phone: "+33612345678",
      password: hashedPassword,
      role: Role.USER,
    },
    create: {
      email,
      firstname: "Admin",
      lastname: "Cesizen",
      phone: "+33612345678",
      password: hashedPassword,
      role: Role.USER,
    },
  });

  const secondEmail = "user@cesizen.local";
  const secondPlainPassword = "User123!";
  const secondHashedPassword = await bcrypt.hash(secondPlainPassword, 12);

  const secondUser = await prisma.user.upsert({
    where: { email: secondEmail },
    update: {
      firstname: "User",
      lastname: "Cesizen",
      phone: "+33698765432",
      password: secondHashedPassword,
      role: Role.USER,
    },
    create: {
      email: secondEmail,
      firstname: "User",
      lastname: "Cesizen",
      phone: "+33698765432",
      password: secondHashedPassword,
      role: Role.USER,
    },
  });

  const promotedAdminUser = await prisma.user.update({
    where: { id: adminUser.id },
    data: {
      role: Role.ADMIN,
    },
  });

  await prisma.adminAuditLog.deleteMany({
    where: {
      actorEmail: {
        in: [email, secondEmail],
      },
      targetEmail: {
        in: [email, secondEmail],
      },
    },
  });

  await prisma.adminAuditLog.createMany({
    data: [
      {
        action: AdminAuditAction.USER_CREATED,
        actorUserId: promotedAdminUser.id,
        actorEmail: email,
        targetUserId: adminUser.id,
        targetEmail: email,
        metadata: {
          source: "seed",
          role: "USER",
        },
      },
      {
        action: AdminAuditAction.USER_CREATED,
        actorUserId: promotedAdminUser.id,
        actorEmail: email,
        targetUserId: secondUser.id,
        targetEmail: secondEmail,
        metadata: {
          source: "seed",
          role: "USER",
        },
      },
      {
        action: AdminAuditAction.USER_STATUS_CHANGED,
        actorUserId: promotedAdminUser.id,
        actorEmail: email,
        targetUserId: adminUser.id,
        targetEmail: email,
        metadata: {
          source: "seed",
          field: "role",
          from: "USER",
          to: "ADMIN",
        },
      },
    ],
  });

  const seededArticleIds = articleSeeds.map((article) => article.id);
  const seededActivityIds = activitySeeds.map((activity) => activity.id);

  await prisma.adminAuditLog.deleteMany({
    where: {
      action: AdminAuditAction.ARTICLE_CREATED,
      actorUserId: promotedAdminUser.id,
      targetUserId: {
        in: seededArticleIds,
      },
    },
  });

  await prisma.adminAuditLog.deleteMany({
    where: {
      action: AdminAuditAction.ACTIVITY_CREATED,
      actorUserId: promotedAdminUser.id,
      targetUserId: {
        in: seededActivityIds,
      },
    },
  });

  for (const article of articleSeeds) {
    await prisma.article.upsert({
      where: { id: article.id },
      update: {
        title: article.title,
        description: article.description,
        content: article.content,
        tag: article.tag,
        date: article.date,
        status: StatusType.PUBLISHED,
        author: article.author,
      },
      create: {
        id: article.id,
        title: article.title,
        description: article.description,
        content: article.content,
        tag: article.tag,
        date: article.date,
        status: StatusType.PUBLISHED,
        author: article.author,
      },
    });
    await prisma.adminAuditLog.create({
      data: {
        action: AdminAuditAction.ARTICLE_CREATED,
        actorUserId: promotedAdminUser.id,
        actorEmail: email,
        targetUserId: article.id,
        targetEmail: article.title,
        metadata: {
          source: "seed",
          entityType: "article",
          tag: article.tag,
        },
      },
    });
    console.log(
      `[seed][article] "${article.title}" (${article.id}) cree/mis a jour`,
    );
  }

  for (const activity of activitySeeds) {
    await prisma.activity.upsert({
      where: { id: activity.id },
      update: {
        title: activity.title,
        description: activity.description,
        content: activity.content,
        tag: activity.tag,
        difficulty: activity.difficulty,
        duration: activity.duration,
        date: activity.date,
        status: StatusType.PUBLISHED,
        author: activity.author,
      },
      create: {
        id: activity.id,
        title: activity.title,
        description: activity.description,
        content: activity.content,
        tag: activity.tag,
        difficulty: activity.difficulty,
        duration: activity.duration,
        date: activity.date,
        status: StatusType.PUBLISHED,
        author: activity.author,
      },
    });
    await prisma.adminAuditLog.create({
      data: {
        action: AdminAuditAction.ACTIVITY_CREATED,
        actorUserId: promotedAdminUser.id,
        actorEmail: email,
        targetUserId: activity.id,
        targetEmail: activity.title,
        metadata: {
          source: "seed",
          entityType: "activity",
          tag: activity.tag,
          difficulty: activity.difficulty,
          duration: activity.duration,
        },
      },
    });
    console.log(
      `[seed][activity] "${activity.title}" (${activity.id}) cree/mis a jour`,
    );
  }

  console.log("Utilisateur admin créé ou déjà existant :", email);
  console.log("Deuxième utilisateur créé ou déjà existant :", secondEmail);
  console.log(`${articleSeeds.length} articles (une catégorie chacun)`);
  console.log(`${activitySeeds.length} activités (une catégorie chacune)`);
  console.log("Seed terminé !");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
