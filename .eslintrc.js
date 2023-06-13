module.exports = {
    extends: ["eslint:recommended", "plugin:prettier/recommended"],
    overrides: [
        {
            files: ["*.ts"],
            plugins: ["@typescript-eslint"],
            extends: [
                "plugin:@typescript-eslint/eslint-recommended",
                "plugin:@typescript-eslint/recommended",
                "prettier/@typescript-eslint",
            ],
            rules: {},
        },
        {
            files: ["*.test.ts"],
            plugins: ["jest"],
            rules: {},
        },
    ],
}
