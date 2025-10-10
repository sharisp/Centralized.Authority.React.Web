import "@testing-library/jest-dom";

// ResizeObserver mock
class ResizeObserver {
	observe() {}
	unobserve() {}
	disconnect() {}
}
(globalThis as any).ResizeObserver = ResizeObserver;
