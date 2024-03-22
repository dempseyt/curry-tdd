const curry = (func) => {
    let providedArguments = [];
    const numberOfRequiredArgs = func.length;

    function curriedFunction(...args) {
        let allArgumentsAreProvided = false;
        providedArguments = [...providedArguments, ...args];

        if (numberOfRequiredArgs == providedArguments.length) {
            allArgumentsAreProvided = true;
        }
        
        // all required arguments have been provided.
        //  - we can fully apply the underlying function.
        if (allArgumentsAreProvided) {
            return func(...providedArguments);
        } 

        // or some arguments are yet to be provided.
        //  - we return the partially applied function with the arguments provided.
        return curriedFunction;
    }

    return curriedFunction;
}

export default curry;
