# 🤝 Contributing Guide

Thank you for considering contributing to this project! Your help makes it better.

## 📌 How to Contribute

1. **Fork the repository**
2. **Create a new branch** for your fix or feature:

   ```bash
   git checkout -b feature/<feature-name>
   ```

3. **Commit your changes** using [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/)
4. **Push to your fork** and open a Pull Request

## 📖 Contribution Rules

* Follow existing code style and naming conventions.
* Add clear and descriptive commit messages.
* Update or add tests when applicable.
* If adding new features, update the documentation.

<!-- 
## 📦 Project Scripts

* `npm run test` — run unit tests
* `npm run docs:dev` — run documentation locally
* `npm run release:test` — dry run semantic release 
-->

## Commit Message Format

All commit messages on `main` should follow the conventional commits format. For example:

```text
 feat: Allowed provided config object to extend other configs
  ^
(type)
```

The supported types are:

* No version update:
  * **build**: Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)
  * **chore**: A change that doesn't fall under any other types that affect the patch version such as removing an unused file
  * **ci**: Changes to the CI configuration files and scripts
  * **docs**: Documentation only changes
  * **perf**: A code change that improves performance
  * **refactor**: A code change that neither fixes a bug nor adds a feature
  * **style**: Changes that do not affect the meaning of the code (white-space, formatting, missing semi-colons, etc)
  * **test**: Adding missing tests or correcting existing tests
* Patch version update:
  * **fix**: A bug fix
  * **revert**: Reverts a previous commit
* Minor version update:
  * **feat**: A new feature
* Major version update:
  * **breaking** or **breaking change**: A breaking change

## 📑 License

By contributing, you agree that your contributions will be licensed under the project’s [MIT License](./blob/main/LICENSE).

Thanks for helping improve this project! 🚀
