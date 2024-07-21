export const Offset = {
    parse: (raw) => {
        if (raw[0] != "+" && raw[0] != "-") {
            return {
                error: "Missing + or - at the start of the offset",
            };
        }

        let timeString = "";
        let i = 1;
        for (; i < raw.length; i++) {
            if (raw[i] >= "0" && raw[i] <= "9") timeString += raw[i];
            else break;
        }

        if (timeString.length == 0) return {
            error: `Missing offset number after the ${raw[0]} character`
        };
        let time = parseFloat(timeString);

        const type = raw.substring(i);
        if (!type) return {
            error: `Missing offset time type the number character, like one of the following:`,
            description: `${raw}h\n${raw}m\n${raw}s\n${raw}ms`
        };

        switch (type.toLowerCase()) {
            case "h":
                time *= 60 * 60 * 1000;
                break;

            case "m":
                time *= 60 * 1000;
                break;

            case "s":
                time *= 1000;
                break;

            case "ms":
                // Already correct
                break;

            default:
                const sub = raw.substring(0, i);
                return {
                    error: `Invald offset time type '${type}', expected one of the following`,
                    description: `${sub}h\n${sub}m\n${sub}s\n${sub}ms`
                };
        }

        const isAddition = raw[0] == "+";
        return {
            offset: isAddition
                ? time
                : -time,
        };
    },
};
