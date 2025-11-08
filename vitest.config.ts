import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
    plugins: [tsconfigPaths()],
    test: {
        setupFiles: ["./test/setup.ts"],
        globals: true,
        environment: "node",
        include: ["./test/**/*.test.ts"],
        exclude: ["**/*.int.test.ts"]
    }
});