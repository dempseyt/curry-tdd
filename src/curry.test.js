import curry from './curry'

describe("curry", () => {
    it("curries a single value", () => {
        const f = curry(function(a, b, c, d) {
            return (a + b * c) / d;
        })
        const g = f(12);
        expect(g(3, 6, 2)).toBe(15);
    });
})