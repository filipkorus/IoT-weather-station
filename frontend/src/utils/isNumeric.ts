const isNumeric = (input?: number | string): boolean => {
    if (input === undefined || input === null) return false;
    if (typeof input === "number") return !isNaN(input);
    if (typeof input === "string") {
        const trimmedInput = input.trim();
        return trimmedInput !== "" && !isNaN(Number(trimmedInput));
    }
    return false;
};

export default isNumeric;
