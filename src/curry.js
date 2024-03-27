function functionOfArity(func, arity) {
    if (arity === 4) {
        return (a, b, c, d) => {
            return func(a, b, c, d);
        };
    }
    if (arity === 3) {
        return (a, b, c) => {
            return func(a, b, c);
        };
    }
    if (arity === 2) {
        return (a, b) => {
            return func(a, b);
        };
    }
    if (arity === 1) {
        return (a) => {
            return func(a);
        };
    }
    return func;
}

function curry(func) {
    const numberOfRequiredArgs = func.length;
    const storedArgs = [];

    function curriedFunction(...providedArgs) {
        for (let arg of providedArgs) {
            if (arg !== undefined) {
                storedArgs.push(arg);
            }
        }

        // all required arguments have been provided.
        //  - we can fully apply the underlying function.
        if (numberOfRequiredArgs === storedArgs.length) {
            return func(...storedArgs);
        }
        
        // or some arguments are yet to be provided.
        //  - we return the partially applied function with the arguments provided.
        const numOfRemainingArgs = numberOfRequiredArgs - storedArgs.length;
        return functionOfArity(
            curriedFunction,
            numOfRemainingArgs
        )
    }
    return functionOfArity(curriedFunction, numberOfRequiredArgs, []);
}

export default curry;
