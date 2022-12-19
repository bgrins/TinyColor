const chalk = require("chalk");
const process = require("process");
const { testDefinitions } = require("@deno/shim-deno/test-internals");
const filePaths = [
    "test.js",
];
async function main() {
    const testContext = {
        process,
        chalk,
    };
    for (const [i, filePath] of filePaths.entries()) {
        if (i > 0) {
            console.log("");
        }
        const scriptPath = "./script/" + filePath;
        console.log("Running tests in " + chalk.underline(scriptPath) + "...\n");
        process.chdir(__dirname + "/script");
        try {
            require(scriptPath);
        }
        catch (err) {
            console.error(err);
            process.exit(1);
        }
        await runTestDefinitions(testDefinitions.splice(0, testDefinitions.length), testContext);
        const esmPath = "./esm/" + filePath;
        process.chdir(__dirname + "/esm");
        console.log("\nRunning tests in " + chalk.underline(esmPath) + "...\n");
        await import(esmPath);
        await runTestDefinitions(testDefinitions.splice(0, testDefinitions.length), testContext);
    }
}
async function runTestDefinitions(testDefinitions, options) {
    const testFailures = [];
    for (const definition of testDefinitions) {
        options.process.stdout.write("test " + definition.name + " ...");
        if (definition.ignore) {
            options.process.stdout.write(` ${options.chalk.gray("ignored")}\n`);
            continue;
        }
        const context = getTestContext();
        let pass = false;
        try {
            await definition.fn(context);
            if (context.hasFailingChild) {
                testFailures.push({
                    name: definition.name,
                    err: new Error("Had failing test step.")
                });
            }
            else {
                pass = true;
            }
        }
        catch (err) {
            testFailures.push({
                name: definition.name,
                err
            });
        }
        const testStepOutput = context.getOutput();
        if (testStepOutput.length > 0) {
            options.process.stdout.write(testStepOutput);
        }
        else {
            options.process.stdout.write(" ");
        }
        options.process.stdout.write(getStatusText(pass ? "ok" : "fail"));
        options.process.stdout.write("\n");
    }
    if (testFailures.length > 0) {
        options.process.stdout.write("\nFAILURES");
        for (const failure of testFailures) {
            options.process.stdout.write("\n\n");
            options.process.stdout.write(failure.name + "\n");
            options.process.stdout.write(indentText((failure.err?.stack ?? failure.err).toString(), 1));
        }
        options.process.exit(1);
    }
    function getTestContext() {
        return {
            name: undefined,
            /** @type {any} */ err: undefined,
            status: "ok",
            children: [],
            get hasFailingChild() {
                return this.children.some((c) => c.status === "fail" || c.status === "pending");
            },
            getOutput() {
                let output = "";
                if (this.name) {
                    output += "test " + this.name + " ...";
                }
                if (this.children.length > 0) {
                    output += "\n" + this.children.map((c) => indentText(c.getOutput(), 1)).join("\n") + "\n";
                }
                else if (!this.err) {
                    output += " ";
                }
                if (this.name && this.err) {
                    output += "\n";
                }
                if (this.err) {
                    output += indentText((this.err.stack ?? this.err).toString(), 1);
                    if (this.name) {
                        output += "\n";
                    }
                }
                if (this.name) {
                    output += getStatusText(this.status);
                }
                return output;
            },
            async step(nameOrTestDefinition, fn) {
                const definition = getDefinition();
                const context = getTestContext();
                context.status = "pending";
                context.name = definition.name;
                context.status = "pending";
                this.children.push(context);
                if (definition.ignore) {
                    context.status = "ignored";
                    return false;
                }
                try {
                    await definition.fn(context);
                    context.status = "ok";
                    if (context.hasFailingChild) {
                        context.status = "fail";
                        return false;
                    }
                    return true;
                }
                catch (err) {
                    context.status = "fail";
                    context.err = err;
                    return false;
                }
                /** @returns {TestDefinition} */ function getDefinition() {
                    if (typeof nameOrTestDefinition === "string") {
                        if (!(fn instanceof Function)) {
                            throw new TypeError("Expected function for second argument.");
                        }
                        return {
                            name: nameOrTestDefinition,
                            fn
                        };
                    }
                    else if (typeof nameOrTestDefinition === "object") {
                        return nameOrTestDefinition;
                    }
                    else {
                        throw new TypeError("Expected a test definition or name and function.");
                    }
                }
            }
        };
    }
    function getStatusText(status) {
        switch (status) {
            case "ok":
                return options.chalk.green(status);
            case "fail":
            case "pending":
                return options.chalk.red(status);
            case "ignored":
                return options.chalk.gray(status);
            default:
                {
                    const _assertNever = status;
                    return status;
                }
        }
    }
    function indentText(text, indentLevel) {
        if (text === undefined) {
            text = "[undefined]";
        }
        else if (text === null) {
            text = "[null]";
        }
        else {
            text = text.toString();
        }
        return text.split(/\r?\n/).map((line) => "  ".repeat(indentLevel) + line).join("\n");
    }
}
main();
