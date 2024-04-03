import _ from './_'

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

function replacePlaceholders(currentArguments, args) {
    const {resultArgs, argsToMerge} = currentArguments.reduce( function({resultArgs, argsToMerge}, currentValue) {
        if (argsToMerge.length > 0 && currentValue === _) {
                resultArgs.push(argsToMerge.shift());
        } else {
            resultArgs.push(currentValue);
        }
        return {resultArgs, argsToMerge};
    }, {resultArgs:[], argsToMerge:args});
    return [resultArgs, argsToMerge];
}

function curry(func) {
    const arityOfCurriedFunction = func.length;
    
    function curriedFunction(...providedArguments) {

        let amountOfRemainingArguments = arityOfCurriedFunction - providedArguments.length;
        for (let providedArgument of providedArguments) {
            if (providedArgument === _) {
                amountOfRemainingArguments++;
            }
        }
        const isRemainingArguments = amountOfRemainingArguments > 0;

        // Scenario 1: There are remaining arguments
        if (isRemainingArguments) {
            return functionOfArity((...newArgs) => {
                    const [partiallyReplacedArguments, remainingArguments] = replacePlaceholders(providedArguments, newArgs);
                    return curriedFunction.call(this, ...partiallyReplacedArguments, ...remainingArguments);
                }, amountOfRemainingArguments
            )
        } 
        // Scenario 2: No remaining arguments
        else {
            return func.call(this, ...providedArguments);
        }
    }
        return functionOfArity(curriedFunction, arityOfCurriedFunction);
    }
    
    export default curry;
    