const curry = (func) => {
    return (a) => {
        // f
        return (b, c, d) => {
            // g
            return func(a, b, c, d)
        }
    }
}

export default curry;
