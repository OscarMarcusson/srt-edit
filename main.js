import fs from "fs";
import { Color } from "./utility/color.js";

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


function exitWithError(error, help) {
    console.error(Color.foreground.red + error + Color.reset);
    if (help) {
        console.log(help + Color.reset);
    }
    process.exit(1);
}

function printHelp() {
    console.log("SRT Edit: " + process.env.npm_package_version);
    console.log("TODO: Usage examples");
}

function shift() {
    if (args.length == 1) exitWithError(
        "Expected an .srt file after the shift command, like the example in green:",
        `${args.join(" ")} ${Color.foreground.black}${Color.background.green}"some-subtitle-file.srt"${Color.reset} +5s`
    );
    if (args.length == 2) exitWithError(
        "Expected a time offset after the shift command, like the example in green:",
        `${args.join(" ")} ${Color.foreground.black}${Color.background.green}+5s`
    );
    if (args.length > 3) {
        const goodArds = args.slice(0, 3);
        const badArgs = args.slice(3);
        exitWithError(
            `Unexpected argument, please remove the red highlighted section:`,
            `${Color.foreground.green}${goodArds.join(" ")} ${Color.foreground.black}${Color.background.red}${badArgs.join(" ")}`
        );
    }
    console.log(args);
}