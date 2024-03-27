import curry from './curry'

describe("curry", () => {
    it("curries a single value", () => {
        const mockedToCurry = jest.fn((a, b, c, d) => {
            return (a + b * c) / d;
        })
        const f = curry(mockedToCurry);
        const g = f(12);
        
        expect(g(3, 6, 2)).toBe(15);
        expect(mockedToCurry).toHaveBeenCalledWith(12, 3, 6, 2);
    });
    it("curries multiple values", () => {
        const mockedToCurry = jest.fn((a, b, c, d) => {
            return (a + b * c) / d;
        });
        const f = curry(mockedToCurry);
        const g = f(12, 3);
        expect(g(6, 2)).toBe(15);
        expect(mockedToCurry).toHaveBeenCalledWith(12, 3, 6, 2);
    });
    it("allows further currying of a curried function", () => {
        const mockedFunctionToCurry = jest.fn((a, b, c, d) => ((a + b* c) / d));
        const f = curry(mockedFunctionToCurry);
        const g = f(12);
        const h = g(3);

        expect(h(6, 2)).toBe(15);
        expect(mockedFunctionToCurry).toHaveBeenCalledWith(12, 3, 6, 2);
    });
    it("properly reports the length of the curried function", () => {
        const mockedFunctionToCurry = jest.fn((a, b, c, d) => (a + b * c) / d);
        const f = curry(mockedFunctionToCurry);
        expect(f.length).toBe(4)

        const g = f(12);
        expect(g.length).toBe(3);

        const h = g(3, 1);
        expect(h.length).toBe(1);

        // const i = h(2);
        // expect(i.length).toBe(1);
    })
});