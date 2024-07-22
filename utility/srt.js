import { exitWithError } from "./exitWithError.js";

export const SRT = {
    parse: (src) => {
        const lines = src.replaceAll("\r", "").split("\n");
        const output = [];

        for (let i = 0; i < lines.length; i++) {
            if (!lines[i].trim()) continue;

            // Load index
            const group = {
                index: output.length + 1,
            };

            // Load timestamp
            i++;
            const timeStamp = parseTimeStamp(lines[i], i + 1);
            group.from = timeStamp.from;
            group.to = timeStamp.to;

            // Load text
            group.subtitles = [];
            for (i++; i < lines.length; i++) {
                if (!lines[i]) break;
                group.subtitles.push(lines[i]);
            }

            output.push(group);
        }

        return output;
    },
};


function parseTimeStamp(timeStamp, line) {
    if (!timeStamp) exitWithError(`File contained an empty timestamp at line ${line}`);

    const split = timeStamp.split("-->");
    if (split.length == 1) exitWithError(`Invalid timestamp at line ${line}: ${timeStamp}`);

    return {
        from: parseTime(split[0], line),
        to: parseTime(split[1], line),
    }
}

function parseTime(time, line) {
    time = time.trim();

    // Extract the ms from `00:00:00,123` (123) in this case
    let split = time.split(",");
    if (split.length != 2) exitWithError(`Invalid time at line ${line}: ${time}`);
    const ms = split[1];

    // Extract the hour, minute, second from the first section `00:00:00`
    split = split[0].split(":");
    if (split.length != 3) exitWithError(`Invalid time at line ${line}: ${time}`);

    return {
        h: parseInt(split[0]),
        m: parseInt(split[1]),
        s: parseInt(split[2]),
        ms: parseInt(ms),
    };
}