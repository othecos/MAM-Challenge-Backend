module.exports = {
    presets: [
        [
            "@babel/preset-env",
            {
                targets: {
                    node: "current", // NOTE Compiles code to the current version of Node.js
                },
            },
        ],
        "@babel/preset-typescript",
    ],
    plugins: [
        [
            "module-resolver",
            {
                // NOTE Create paths (same as tsconfig.json)
                alias: {
                    "@components/*": ["./src/components/*"],
                    "@config/*": ["./src/config/*"],
                    "@controllers/*": ["./src/controllers/*"],
                    "@interfaces/*": ["./src/interfaces/*"],
                    "@middleware/*": ["./src/middleware/*"],
                    "@models/*": ["./src/models/*"],
                    "@routers/*": ["./src/routers/*"],
                    "@utils/*": ["./src/utils/*"],
                    "@tests/*": ["./src/tests/*"],
                    "@populate/*": ["./populate/*"]
                },
            },
        ],
    ],
    ignore: ["**/*.spec.ts"],
};
