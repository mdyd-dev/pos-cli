pos-cli gui is an interface built to manage your platformOS instance and related data.

## Tech stack
- [SvelteKit](https://kit.svelte.dev) as front-end framework
- [Vite](https://vitejs.dev) as a development environment
- [Playwright](https://playwright.dev) for end-to-end testing

## Development
Prerequisites: [GIT](https://git-scm.com), [Node.js](https://nodejs.org/en), [pos-cli](https://github.com/mdyd-dev/pos-cli) installed and a [platformOS instance](https://documentation.platformos.com/get-started) configured.

1. Clone the whole pos-cli repository to an empty folder:

    ```bash
    git clone https://github.com/mdyd-dev/pos-cli.git
    ```
2. Navigate to the `gui/next` subfolder:
    ```bash
    cd gui/next
    ```
3. Install the dependencies:
    ```bash
    npm install
    ```

### Run the development server
To run the dev server you just need to run the following command from `gui/next` directory
```bash
npm run dev
```

By default, it runs the server at [http://localhost:5173](http://localhost:5173) and you should be able to view the GUI under this URL. You need to leave the server running in the terminal.

To test things out though, you would like to **connect to an instance** to have some test data appearing in the GUI.

In a new terminal window, run `pos-cli gui serve [instance alias]` from the [authenticated directory](https://documentation.platformos.com/get-started/working-with-the-code-and-files/) where you have your test instance code. The same as you would normally use to run the GUI on daily development.

### Make your changes
You can edit the source code at `gui/next` and while the development server is running, it will refresh the changes in the browser automatically.

### Build the final code
Before publishing or testing the changes you will have to build the final package.

To do that run the following in `gui/next` directory:

```bash
npm run build
```

### Update and run the tests
When making changes and developing new functions, please make sure you will modify or add automated test scenarios placed in the `playwright` directory.

The one rule to follow here is that each test scenario should be completely independent. You cannot rely on the previous tests to prepare any data as each test can be ran in parallel in a random order. The initial data is seeded using the public repository: https://github.com/Platform-OS/pos-cli-gui-qa

#### Manually run tests

To manually run the tests, you would require a test instance that has the testing code deployed and test data seeded.

1. If not done previously, [install Playwright browsers](https://playwright.dev/docs/browsers)
    ```bash
    npx playwright install --with-deps
    ```
2. Clone the test repository to an empty folder:
    ```bash
    git clone https://github.com/Platform-OS/pos-cli-gui-qa.git
    ```
3. [Authenticate the directory](https://documentation.platformos.com/get-started/working-with-the-code-and-files/#authenticate-your-environment) to work with platformOS
4. Navigate to that directory and run the following to deploy the code:
    ```bash
    pos-cli deploy <instance alias>
    ```
5. If the instance data was previously modified, you would have to clean the data to start fresh
    ```bash
    pos-cli data clean <instance alias>
    ```
6. Seed the test data to the instance
    ```bash
    pos-cli data import <instance alias> --path seed/data.zip --zip
    ```
7. Build the production-ready code
    ```bash
    npm run build
    ```
8. Run the preview server
    ```bash
    npm run preview
    ```

Finally, to run Playwright with an interface use the following command from `gui/next` directory:

```bash
npx playwright test --ui
```

This will run the Playwright interface, where you can run previously available test scenarios and see your changes when modifying the `.spec.js` test files.


#### Use a script to run tests

There is a Bash script prepared to run all the steps needed for automated testing. To use the script just run the following command from the `/gui/next` directory:

```bash
sh sh playwright/run.sh
```

Keep in mind that, by default, it uses an shared instance so if more than one person is running the tests, it might fail. You can change the instance it uses by editing the script.

The output would be a HTML report showing the tests results.


### Publish new version
When you are ready to publish the new GUI version:

1. Merge from `master` to make sure that you have the latest changes to the rest of the code
2. Increase the `pos-cli` version number by running the following from **the parent directory**:
    ```bash
    npm version <minor|path>
    ```
3. Describe your changes in `CHANGELOG.md`
4. Commit and push your branch to GitHub, pass the review and merge to `master`.
5. Switch to `master` branch
    ```bash
    git checkout master
    ```
6. Publish the new package to npm (requires you having the permissions):
    ```bash
    npm publish
    ```
