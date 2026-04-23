"use client";

import { useCallback, useRef } from "react";
import {
	Bold,
	Heading1,
	Heading2,
	Heading3,
	Italic,
	Minus,
	Plus,
	RemoveFormatting,
	Type,
} from "lucide-react";

type ArticleContentFieldProps = {
	id: string;
	name: string;
	required?: boolean;
	rows?: number;
	className?: string;
	placeholder?: string;
	defaultValue?: string;
	labelClassName: string;
	toolbarTextClassName: string;
	children?: React.ReactNode;
};

function stripHeadingMarkers(text: string): string {
	return text
		.split("\n")
		.map((line) => line.replace(/^#{1,6}\s+/, ""))
		.join("\n");
}

function headingPrefix(level: 1 | 2 | 3): string {
	if (level === 1) return "# ";
	if (level === 2) return "## ";
	return "### ";
}

/** Début de la ligne et index du saut de ligne suivant (ou fin du texte). */
function lineBoundsAt(full: string, index: number): {
	lineStart: number;
	lineEnd: number;
} {
	const lineStart =
		index === 0 ? 0 : full.lastIndexOf("\n", index - 1) + 1;
	const nl = full.indexOf("\n", lineStart);
	const lineEnd = nl === -1 ? full.length : nl;
	return { lineStart, lineEnd };
}

const LARGE_SPAN_OPEN = '<span class="article-size-lg">';
const LARGE_SPAN_CLOSE = "</span>";

function stripFontSizeWrappers(text: string): string {
	const t = text.trim();
	const small = /^<small>([\s\S]*)<\/small>$/i.exec(t);
	if (small) return small[1];
	if (
		t.startsWith(LARGE_SPAN_OPEN) &&
		t.endsWith(LARGE_SPAN_CLOSE) &&
		t.length >= LARGE_SPAN_OPEN.length + LARGE_SPAN_CLOSE.length
	) {
		return t.slice(
			LARGE_SPAN_OPEN.length,
			t.length - LARGE_SPAN_CLOSE.length,
		);
	}
	return text;
}

export function ArticleContentField({
	id,
	name,
	required = false,
	rows = 12,
	className,
	placeholder,
	defaultValue,
	labelClassName,
	toolbarTextClassName,
	children,
}: ArticleContentFieldProps) {
	const textareaRef = useRef<HTMLTextAreaElement>(null);

	const withSelection = useCallback(
		(
			fn: (
				selected: string,
				start: number,
				end: number,
				full: string,
			) => {
				replacement: string;
				selectionStart: number;
				selectionEnd: number;
				replaceStart?: number;
				replaceEnd?: number;
			},
		) => {
			const el = textareaRef.current;
			if (!el) return;

			const start = el.selectionStart;
			const end = el.selectionEnd;
			const full = el.value;
			const selected = full.slice(start, end);
			const {
				replacement,
				selectionStart,
				selectionEnd,
				replaceStart = start,
				replaceEnd = end,
			} = fn(selected, start, end, full);

			el.value =
				full.slice(0, replaceStart) +
				replacement +
				full.slice(replaceEnd);
			el.selectionStart = selectionStart;
			el.selectionEnd = selectionEnd;
			el.focus();
			el.dispatchEvent(new Event("input", { bubbles: true }));
		},
		[],
	);

	const wrapBold = () => {
		withSelection((selected, start) => {
			if (selected.length === 0) {
				const ins = "****";
				const cursor = start + 2;
				return {
					replacement: ins,
					selectionStart: cursor,
					selectionEnd: cursor,
				};
			}
			if (selected.startsWith("**") && selected.endsWith("**")) {
				const inner = selected.slice(2, -2);
				return {
					replacement: inner,
					selectionStart: start,
					selectionEnd: start + inner.length,
				};
			}
			const next = `**${selected}**`;
			return {
				replacement: next,
				selectionStart: start,
				selectionEnd: start + next.length,
			};
		});
	};

	const wrapItalic = () => {
		withSelection((selected, start) => {
			if (selected.length === 0) {
				const ins = "**";
				const cursor = start + 1;
				return {
					replacement: ins,
					selectionStart: cursor,
					selectionEnd: cursor,
				};
			}
			if (/^\*[^*]+\*$/.test(selected)) {
				const inner = selected.slice(1, -1);
				return {
					replacement: inner,
					selectionStart: start,
					selectionEnd: start + inner.length,
				};
			}
			const next = `*${selected}*`;
			return {
				replacement: next,
				selectionStart: start,
				selectionEnd: start + next.length,
			};
		});
	};

	const applyHeading = (level: 1 | 2 | 3) => {
		withSelection((selected, start, end, full) => {
			const prefix = headingPrefix(level);
			const { lineStart, lineEnd } = lineBoundsAt(full, start);

			// Sans sélection : toute la ligne courante devient le titre
			if (selected.length === 0) {
				const firstLine = full.slice(lineStart, lineEnd);
				const newFirstLine =
					prefix + firstLine.replace(/^#{1,6}\s+/, "");
				return {
					replacement: newFirstLine,
					replaceStart: lineStart,
					replaceEnd: lineEnd,
					selectionStart: lineStart + newFirstLine.length,
					selectionEnd: lineStart + newFirstLine.length,
				};
			}

			// Avec sélection : titre = partie sélectionnée, avant / après sur d’autres lignes
			const blockEnd =
				end <= lineEnd
					? lineEnd
					: lineBoundsAt(full, end - 1).lineEnd;
			const before = full.slice(lineStart, start);
			const middle = full.slice(start, end);
			const after = full.slice(end, blockEnd);

			const middleLines = middle.split("\n");
			const firstHeadingPart = middleLines[0].replace(
				/^#{1,6}\s+/,
				"",
			);
			const restOfMiddle = middleLines.slice(1).join("\n");

			let replacement = "";
			if (before.length > 0) {
				replacement += `${before}\n`;
			}
			replacement += `${prefix}${firstHeadingPart}`;
			if (restOfMiddle.length > 0) {
				replacement += `\n${restOfMiddle}`;
			}
			if (after.length > 0) {
				replacement += `\n${after}`;
			}

			let offsetInReplacement = 0;
			if (before.length > 0) {
				offsetInReplacement += before.length + 1;
			}
			offsetInReplacement += prefix.length + firstHeadingPart.length;
			const cursorPos = lineStart + offsetInReplacement;

			return {
				replacement,
				replaceStart: lineStart,
				replaceEnd: blockEnd,
				selectionStart: cursorPos,
				selectionEnd: cursorPos,
			};
		});
	};

	const clearHeading = () => {
		withSelection((selected, start) => {
			if (selected.length === 0) return {
				replacement: "",
				selectionStart: start,
				selectionEnd: start,
			};
			const next = stripHeadingMarkers(selected);
			return {
				replacement: next,
				selectionStart: start,
				selectionEnd: start + next.length,
			};
		});
	};

	const wrapSmall = () => {
		withSelection((selected, start) => {
			if (selected.length === 0) {
				const ins = "<small></small>";
				const cursor = start + 7;
				return {
					replacement: ins,
					selectionStart: cursor,
					selectionEnd: cursor,
				};
			}
			const next = `<small>${selected}</small>`;
			return {
				replacement: next,
				selectionStart: start,
				selectionEnd: start + next.length,
			};
		});
	};

	const wrapLarge = () => {
		withSelection((selected, start) => {
			if (selected.length === 0) {
				const ins = `${LARGE_SPAN_OPEN}${LARGE_SPAN_CLOSE}`;
				const cursor = start + LARGE_SPAN_OPEN.length;
				return {
					replacement: ins,
					selectionStart: cursor,
					selectionEnd: cursor,
				};
			}
			const next = `${LARGE_SPAN_OPEN}${selected}${LARGE_SPAN_CLOSE}`;
			return {
				replacement: next,
				selectionStart: start,
				selectionEnd: start + next.length,
			};
		});
	};

	const clearFontSize = () => {
		withSelection((selected, start) => {
			if (selected.length === 0) return {
				replacement: "",
				selectionStart: start,
				selectionEnd: start,
			};
			const next = stripFontSizeWrappers(selected);
			return {
				replacement: next,
				selectionStart: start,
				selectionEnd: start + next.length,
			};
		});
	};

	const toolButtonClass =
		"inline-flex items-center justify-center gap-1.5 rounded-lg border border-gray-200 bg-white px-2.5 py-1.5 text-xs font-semibold text-gray-800 shadow-sm transition hover:border-orange-200 hover:bg-orange-50/80 disabled:cursor-not-allowed disabled:opacity-50 sm:px-3 sm:text-sm";

	return (
		<div>
			<label htmlFor={id} className={labelClassName}>
				Contenu
			</label>

			<p className={`mt-1 ${toolbarTextClassName}`}>
				Sélectionnez du texte dans le champ, puis utilisez les boutons pour
				appliquer le format (gras, italique, taille du texte, titres).
			</p>

			<div
				className="mt-2 flex flex-wrap gap-2"
				role="toolbar"
				aria-label="Mise en forme du contenu">
				<button
					type="button"
					className={toolButtonClass}
					onClick={wrapBold}
					title="Mettre en gras (**texte**)"
					aria-label="Mettre en gras">
					<Bold size={16} strokeWidth={2.25} aria-hidden />
					Gras
				</button>
				<button
					type="button"
					className={toolButtonClass}
					onClick={wrapItalic}
					title="Mettre en italique (*texte*)"
					aria-label="Mettre en italique">
					<Italic size={16} strokeWidth={2.25} aria-hidden />
					Italique
				</button>
				<span
					className="hidden h-8 w-px self-center bg-gray-200 sm:block"
					aria-hidden
				/>
				<button
					type="button"
					className={toolButtonClass}
					onClick={wrapSmall}
					title="Texte plus petit (balise small)"
					aria-label="Petit texte">
					<Minus size={16} strokeWidth={2.25} aria-hidden />
					Petit
				</button>
				<button
					type="button"
					className={toolButtonClass}
					onClick={clearFontSize}
					title="Retirer petit / grand (corps de texte par défaut)"
					aria-label="Corps de texte">
					<Type size={16} strokeWidth={2.25} aria-hidden />
					Corps
				</button>
				<button
					type="button"
					className={toolButtonClass}
					onClick={wrapLarge}
					title="Texte plus grand (balise span avec classe article-size-lg)"
					aria-label="Grand texte">
					<Plus size={16} strokeWidth={2.25} aria-hidden />
					Grand
				</button>
				<span
					className="hidden h-8 w-px self-center bg-gray-200 sm:block"
					aria-hidden
				/>
				<button
					type="button"
					className={toolButtonClass}
					onClick={clearHeading}
					title="Retirer les marqueurs de titre (#) sur la sélection"
					aria-label="Sans titre">
					<RemoveFormatting size={16} strokeWidth={2.25} aria-hidden />
					Sans titre
				</button>
				<button
					type="button"
					className={toolButtonClass}
					onClick={() => {
						applyHeading(1);
					}}
					title="Titre principal (#) : avec sélection, le titre est seul sur sa ligne ; le reste passe à la ligne"
					aria-label="Titre principal">
					<Heading1 size={16} strokeWidth={2.25} aria-hidden />
					Titre principal
				</button>
				<button
					type="button"
					className={toolButtonClass}
					onClick={() => {
						applyHeading(2);
					}}
					title="Grand titre (##) : avec sélection, titre isolé ; avant et après à la ligne"
					aria-label="Grand titre">
					<Heading2 size={16} strokeWidth={2.25} aria-hidden />
					Grand titre
				</button>
				<button
					type="button"
					className={toolButtonClass}
					onClick={() => {
						applyHeading(3);
					}}
					title="Titre moyen (###) : avec sélection, titre isolé ; avant et après à la ligne"
					aria-label="Titre moyen">
					<Heading3 size={16} strokeWidth={2.25} aria-hidden />
					Titre moyen
				</button>
			</div>

			<textarea
				ref={textareaRef}
				id={id}
				name={name}
				required={required}
				rows={rows}
				className={className}
				placeholder={placeholder}
				defaultValue={defaultValue}
			/>

			{children}
		</div>
	);
}
