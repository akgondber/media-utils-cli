export default {
    entries: ["./cli"],
    rollup: {
        esbuild: {
            target: "es2022"
        }
    }
};
