import Markdown from "react-markdown";
import rehypeRaw from "rehype-raw";
import rehypeSanitize from "rehype-sanitize";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import { articleBodySanitizeSchema } from "@/lib/article-body-sanitize-schema";

const markdownComponents: Components = {
	h1: ({ children }) => (
		<h1 className="mt-10 text-3xl font-bold tracking-tight text-slate-900 first:mt-0 sm:text-4xl lg:text-[2.5rem]">
			{children}
		</h1>
	),
	h2: ({ children }) => (
		<h2 className="mt-8 border-b border-slate-200 pb-2 text-2xl font-bold text-slate-900 sm:text-[1.75rem]">
			{children}
		</h2>
	),
	h3: ({ children }) => (
		<h3 className="mt-6 text-xl font-semibold text-slate-900 sm:text-2xl">
			{children}
		</h3>
	),
	h4: ({ children }) => (
		<h4 className="mt-5 text-lg font-semibold text-slate-800 sm:text-xl">
			{children}
		</h4>
	),
	p: ({ children }) => (
		<p className="mt-4 leading-relaxed text-inherit first:mt-0">{children}</p>
	),
	ul: ({ children }) => (
		<ul className="mt-4 list-disc space-y-2 pl-6 text-slate-700">{children}</ul>
	),
	ol: ({ children }) => (
		<ol className="mt-4 list-decimal space-y-2 pl-6 text-slate-700">{children}</ol>
	),
	li: ({ children }) => <li className="leading-relaxed">{children}</li>,
	strong: ({ children }) => (
		<strong className="font-semibold text-slate-900">{children}</strong>
	),
	em: ({ children }) => <em className="italic text-slate-800">{children}</em>,
	blockquote: ({ children }) => (
		<blockquote className="mt-4 border-l-4 border-emerald-500 bg-emerald-50/60 py-2 pl-4 pr-3 text-slate-700 italic">
			{children}
		</blockquote>
	),
	hr: () => <hr className="my-10 border-slate-200" />,
	a: ({ href, children }) => {
		const external =
			href?.startsWith("http://") || href?.startsWith("https://");
		return (
			<a
				href={href}
				className="font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-2 transition hover:text-emerald-900"
				{...(external
					? { target: "_blank", rel: "noopener noreferrer" }
					: {})}>
				{children}
			</a>
		);
	},
	code: ({ className, children, ...props }) => {
		const isBlock =
			typeof className === "string" && className.includes("language-");
		if (isBlock) {
			return (
				<code className={className} {...props}>
					{children}
				</code>
			);
		}
		return (
			<code
				className="rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[0.9em] text-slate-800"
				{...props}>
				{children}
			</code>
		);
	},
	pre: ({ children }) => (
		<pre className="mt-4 overflow-x-auto rounded-xl border border-slate-200 bg-slate-950 p-4 text-base text-slate-100 shadow-sm">
			{children}
		</pre>
	),
	table: ({ children }) => (
		<div className="mt-6 overflow-x-auto rounded-lg border border-slate-200">
			<table className="w-full min-w-[20rem] border-collapse text-left text-base text-slate-700">
				{children}
			</table>
		</div>
	),
	thead: ({ children }) => (
		<thead className="bg-slate-100 text-slate-900">{children}</thead>
	),
	th: ({ children }) => (
		<th className="border-b border-slate-200 px-3 py-2 font-semibold">{children}</th>
	),
	td: ({ children }) => (
		<td className="border-b border-slate-100 px-3 py-2">{children}</td>
	),
	tr: ({ children }) => <tr>{children}</tr>,
	img: ({ src, alt }) => (
		<img
			src={src}
			alt={alt ?? ""}
			className="my-6 h-auto max-w-full rounded-xl border border-slate-200 shadow-sm"
			loading="lazy"
		/>
	),
};

export function ArticleMarkdown({ source }: { source: string }) {
	return (
		<div className="article-markdown text-lg leading-relaxed text-slate-700 sm:text-xl sm:leading-relaxed">
			<Markdown
				remarkPlugins={[remarkGfm]}
				rehypePlugins={[
					rehypeRaw,
					[rehypeSanitize, articleBodySanitizeSchema],
				]}
				components={markdownComponents}>
				{source}
			</Markdown>
		</div>
	);
}
