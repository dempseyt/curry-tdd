function functionOfArity(func, arity) {
    switch (arity) {
        case 4:
            return function(a, b, c, d) {
                // Only apply func with the supplied arguments
                // How do I access the supplied arguments to a function
                return func.apply(this, arguments);
            }
        case 3:
            return function(a, b, c) {
                return func.apply(this, arguments);
            }
        case 2:
            return function(a, b) {
                return func.apply(this, arguments);
            }
        case 1: 
            return function(a) {
                return func.apply(this, arguments);
            }
    }
}

function curry(func) {
    const arityOfCurriedFunction = func.length;
    
    function curriedFunction(...providedArguments) {
        const remainingArguments = arityOfCurriedFunction - providedArguments.length;
        const isRemainingArguments = remainingArguments > 0;

        // Scenario 1: There are remaining arguments
        if (isRemainingArguments) {
            return functionOfArity((...args) => {
                    return curriedFunction(...providedArguments, ...args);
                }, remainingArguments
            )
            
        } 
        // Scenario 2: No remaining arguments
        else {
            return func(...providedArguments);
        }
    }
        return functionOfArity(curriedFunction, arityOfCurriedFunction);
    }
    
    export default curry;
    