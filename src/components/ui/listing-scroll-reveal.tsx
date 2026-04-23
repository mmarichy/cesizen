"use client";

import {
	useEffect,
	useRef,
	useState,
	useSyncExternalStore,
	type ReactNode,
} from "react";

const CARD_CLASS = "listing-card-scroll-reveal";

const ANIMATION_NAME = "listing-card-reveal-in";
const DURATION_MS = 680;
const TRANSLATE_REM = 2.875;
const STAGGER_MS = 115;
const STAGGER_CYCLE = 6;
const EASING = "cubic-bezier(0.22, 1, 0.36, 1)";

const IO_ROOT_MARGIN = "0px 0px -6% 0px";
const IO_THRESHOLD = 0.06;

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function listingScrollRevealInjectedCss(): string {
	return `
@keyframes ${ANIMATION_NAME} {
  from {
    opacity: 0;
    transform: translateY(${TRANSLATE_REM}rem);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (prefers-reduced-motion: reduce) {
  .${CARD_CLASS} {
    animation: none !important;
    opacity: 1 !important;
    transform: none !important;
  }
}
`;
}

function subscribeReducedMotion(
	onStoreChange: () => void,
): () => void {
	const mq = window.matchMedia(REDUCED_MOTION_QUERY);
	mq.addEventListener("change", onStoreChange);
	return () =>
		mq.removeEventListener("change", onStoreChange);
}

function reducedMotionSnapshot(): boolean {
	return window.matchMedia(REDUCED_MOTION_QUERY).matches;
}

function reducedMotionServerSnapshot(): boolean {
	return false;
}

function usePrefersReducedMotion(): boolean {
	return useSyncExternalStore(
		subscribeReducedMotion,
		reducedMotionSnapshot,
		reducedMotionServerSnapshot,
	);
}

export function ListingScrollRevealScope({
	children,
}: {
	children: ReactNode;
}) {
	return (
		<>
			<style
				dangerouslySetInnerHTML={{
					__html: listingScrollRevealInjectedCss(),
				}}
			/>
			{children}
		</>
	);
}

type ListingCardScrollRevealProps = {
	index: number;
	children: ReactNode;
};

export function ListingCardScrollReveal({
	index,
	children,
}: ListingCardScrollRevealProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [revealed, setRevealed] = useState(false);
	const reduceMotion = usePrefersReducedMotion();
	const visible = reduceMotion || revealed;

	useEffect(() => {
		if (reduceMotion) return;
		const el = ref.current;
		if (!el) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const [entry] = entries;
				if (!entry?.isIntersecting) return;
				setRevealed(true);
				observer.disconnect();
			},
			{
				rootMargin: IO_ROOT_MARGIN,
				threshold: IO_THRESHOLD,
			},
		);

		observer.observe(el);
		return () => observer.disconnect();
	}, [reduceMotion]);

	const stagger =
		Math.min(index % STAGGER_CYCLE, STAGGER_CYCLE - 1) *
		STAGGER_MS;

	return (
		<div
			ref={ref}
			className={`${CARD_CLASS} h-full min-w-0`}
			style={
				reduceMotion
					? undefined
					: visible
						? {
								animationName: ANIMATION_NAME,
								animationDuration: `${DURATION_MS}ms`,
								animationTimingFunction: EASING,
								animationDelay: `${stagger}ms`,
								animationFillMode: "both",
							}
						: {
								opacity: 0,
								transform: `translateY(${TRANSLATE_REM}rem)`,
							}
			}>
			{children}
		</div>
	);
}
