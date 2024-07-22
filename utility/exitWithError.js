import { Color } from "./color.js";

export function exitWithError(error, help) {
    console.error(Color.foreground.red + error + Color.reset);
    if (help) {
        console.log(help + Color.reset);
    }
    process.exit(1);
}
