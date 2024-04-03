import curry from './curry'
import _ from './_'

describe("curry", () => {
    it("curries a single value", () => {
        const mockedToCurry = jest.fn((a, b, c, d) => {
            return (a + b * c) / d;
        })
        const f = curry(mockedToCurry);
        const g = f(12);
        expect(g(3, 6, 2)).toBe(15);
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
        expect(g(3, 6, 2)).toEqual(15);

        const h = g(3);

        expect(h(6, 2)).toBe(15);
        expect(g(3, 6)(2)).toEqual(15)
    });
    it("properly reports the length of the curried function", () => {
        const mockedFunctionToCurry = jest.fn((a, b, c, d) => (a + b * c) / d);
        const f = curry(mockedFunctionToCurry);
        expect(f.length).toBe(4)

        const g = f(12);
        expect(g.length).toBe(3);

        const h = g(3);
        expect(h.length).toBe(2);
        expect(typeof g(3, 6)).toEqual('function')
        expect(g(3, 6).length).toBe(1);
    });
    it("preserves context", () => {
        const ctx = {x: 10};
        const f = function(a, b) {
            return a + b * this.x;
        }
        const g = curry(f);

        expect(g.call(ctx, 2, 4)).toEqual(42);
        expect(g.call(ctx, 2).call(ctx, 4)).toEqual(42);
    });
    it("supports _ placeholder", () => {
        const f = function(a, b, c) {
            return [a, b, c];
        };
        const g = curry(f);
        
        function eq(actual, expected) {
            return expect(actual).toEqual(expected);
        }

        eq(g(1)(2)(3), [1, 2, 3]);
        eq(g(1)(2, 3), [1, 2, 3]);
        eq(g(1, 2)(3), [1, 2, 3]);
        eq(g(1, 2, 3), [1, 2, 3]);

        eq(g(_, 2, 3)(1), [1, 2, 3]);
        eq(g(1, _, 3)(2), [1, 2, 3]);
        eq(g(1, 2, _)(3), [1, 2, 3]);

        eq(g(1, _, _)(2)(3), [1, 2, 3]);
        eq(g(_, 2, _)(1)(3), [1, 2, 3]);
        eq(g(_, _, 3)(1)(2), [1, 2, 3]);

        eq(g(1, _, _)(2, 3), [1, 2, 3]);
        eq(g(_, 2, _)(1, 3), [1, 2, 3]);
        eq(g(_, _, 3)(1, 2), [1, 2, 3]);

        eq(g(1, _, _)(_, 3)(2), [1, 2, 3]);
        eq(g(_, 2, _)(_, 3)(1), [1, 2, 3]);
        eq(g(_, _, 3)(_, 2)(1), [1, 2, 3]);

        eq(g(_, _, _)(_, _)(_)(1, 2, 3), [1, 2, 3]);
        eq(g(_, _, _)(1, _, _)(_, _)(2, _)(_)(3), [1, 2, 3]);
    });
    it("forwards extra arguments", () => {
        let f = function(a, b, c) {
            void c;
            return Array.prototype.slice.call(arguments);
        };
        let g = curry(f);

        function eq(actual, expected) {
            return expect(actual).toEqual(expected);
        }

        eq(g(1, 2, 3), [1, 2, 3]);
        eq(g(1, 2, 3, 4), [1, 2, 3, 4]);
        eq(g(1, 2)(3, 4), [1, 2, 3, 4]);
        eq(g(1)(2, 3, 4), [1, 2, 3, 4]);
        eq(g(1)(2)(3, 4), [1, 2, 3, 4]);
    });
    it('handles arguments beyond function arity when called with placeholder', () => {
        let f = function(a, b, c) { return [a, b, c]; };
        let g = curry(f);
        
        function eq(actual, expected) {
            return expect(actual).toEqual(expected);
        }
        
        eq(g(1)(_, _, _)(2, _, _)(3)(4), [1, 2, 3]);
        eq(g(_, 2, 3, 4)(1), [1, 2, 3]);
        eq(g(1, 2, 3, _)(4), [1, 2, 3]);
        eq(g(1)(_, 3, 4)(2), [1, 2, 3]);
        eq(g(_)(_, 2, 3, 4)(1), [1, 2, 3]);
        eq(g(_)(_, 2, _, 4, 5)(_, 3, 4)(1), [1, 2, 3]);
        eq(g(_, _, _)(1, _, _)(_, _)(2, _)(_)(3), [1, 2, 3]);

        // g(_) --> h(a, b, c)
        // h(_, 2, _, 4, 5) --> i(a, c)
        // i(1, 3) --> g(1, 2, 3, 4, 5) --> [1, 2, 3]
        eq(g(_)(_, 2, _, 4, 5)(1, 3), [1, 2, 3]);
    });
});