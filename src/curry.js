import _ from './_'

function functionOfArity(func, arity) {
    Object.defineProperty(func, 'length', {
        value: arity
    });

    return func;
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
        const workingArity = providedArguments.length > arityOfCurriedFunction ? providedArguments.length : arityOfCurriedFunction;

        let amountOfRemainingArguments = workingArity - providedArguments.length;
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
    