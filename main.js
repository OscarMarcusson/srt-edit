import fs from "fs";
import path from "path";
import { Color } from "./utility/color.js";
import { Offset } from "./utility/offset.js";
import { SRT } from "./utility/srt.js";
import { exitWithError } from "./utility/exitWithError.js";

const args = process.argv.slice(2);
if (args.length == 0) {
    printHelp();
    process.exit(0);
}

switch (args[0]) {
    case "-v":
    case "--version":
    case "v":
    case "version":
        console.log(process.env.npm_package_version);
        process.exit(0);

    case "-h":
    case "--help":
    case "h":
    case "help":
        printHelp();
        break;

    case "s":
    case "shift":
        shift();
        break;

    default:
        exitWithError(`Unknown command: ${Color.reset}${args[0]}\n${Color.dim}Use the 'help' command, or run without any commands, to display the help menu`);
        break;
}


function printHelp() {
    console.log("SRT Edit: " + process.env.npm_package_version);
    console.log("TODO: Usage examples");
}

function shift() {
    // Load file
    if (args.length == 1) exitWithError(
        "Expected an .srt file after the shift command, like the example in green:",
        `${args.join(" ")} ${Color.foreground.black}${Color.background.green}"some-subtitle-file.srt"${Color.reset} +5s`
    );
    const file = args[1];
    if (!fs.existsSync(file)) exitWithError(
        "Could not find that file",
        `Make sure that the file path is correct and try again`
    );

    // Get offset type
    if (args.length == 2) exitWithError(
        "Expected 'add' or 'remove' after the file, like the example in green:",
        `${args.join(" ")} ${Color.foreground.black}${Color.background.green}add${Color.reset} 5s`
    );
    let timeMultiplier;
    switch (args[2].toLowerCase()) {
        case "add": timeMultiplier = 1; break;
        case "sub":
        case "subtract": timeMultiplier = -1; break;
        default: exitWithError(`Expected 'add' or 'remove' after the file, not ${Color.reset}${Color.foreground.black}${Color.background.red}${args[2]}`);
    }

    // Get the offset data
    if (args.length == 3) exitWithError(
        "Expected a time value after the type, like the example in green:",
        `${args.join(" ")} ${Color.foreground.black}${Color.background.green}+5s`
    );
    const offsetParseResult = Offset.parse(args[3]);
    if (offsetParseResult.error) {
        exitWithError(offsetParseResult.error, offsetParseResult.description);
    }
    const offset = offsetParseResult.offset * timeMultiplier;

    const isFile = fs.statSync(file).isFile();
    if (isFile) {
        // Get output file path
        let output = file;
        if (args.length > 4) {
            output = args[4];

            // Ensure that we do not have any trailing and unhandeled arguments
            if (args.length > 5) {
                const goodArds = args.slice(0, 4);
                const badArgs = args.slice(4);
                exitWithError(
                    `Unexpected argument, please remove the red highlighted section:`,
                    `${Color.foreground.green}${goodArds.join(" ")} ${Color.foreground.black}${Color.background.red}${badArgs.join(" ")}`
                );
            }
        }
        transform(file, output);
    }
    else {
        let directory = path.resolve(file);
        const files = fs.readdirSync(directory, { recursive: false }).map(f => `${directory}/${f}`);
        for (const file of files) {
            transform(file, file);
        }
    }

    function transform(input, output) {
        const rawData = fs.readFileSync(input, { encoding: "utf-8" });
        const srt = SRT.parse(rawData);


        // Offset time
        for (const subtitles of srt) {
            subtitles.from = SRT.modifyTime(subtitles.from, offset);
            subtitles.to = SRT.modifyTime(subtitles.to, offset);
        }

        // Serialize results
        const serialized = SRT.serialize(srt);
        try {
            fs.writeFileSync(output, serialized, { encoding: "utf-8" });
        }
        catch (e) {
            exitWithError(e);
        }
    }
}