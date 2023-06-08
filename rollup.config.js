import resolve from "@rollup/plugin-node-resolve";

export default {
    input: "./index_old.js",
    output: [
        {
            format: "esm",
            file: "./bundle.js"
        },
    ],
    plugins: [
        resolve(),
    ]
};