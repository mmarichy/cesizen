import { defaultSchema } from "rehype-sanitize";
import type { Options } from "rehype-sanitize";

/**
 * Schéma rehype-sanitize : HTML limité dans le corps Markdown (contenu admin).
 * - <small> : texte plus petit
 * - <span class="article-size-lg"> : texte plus grand (classe définie dans globals.css)
 */
export const articleBodySanitizeSchema: Options = {
	...defaultSchema,
	tagNames: [...(defaultSchema.tagNames ?? []), "small"],
	attributes: {
		...defaultSchema.attributes,
		span: [
			...(defaultSchema.attributes?.span ?? []),
			["className", /^article-size-lg$/],
		],
	},
};
