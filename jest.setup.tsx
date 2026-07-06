import "@testing-library/jest-dom";

class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
}

if (typeof window !== "undefined") {
  window.ResizeObserver = ResizeObserver;
}

jest.mock("./src/components/ThreeScene", () => {
  return function MockThreeScene() {
    return <div data-testid="three-scene-mock" />;
  };
});
