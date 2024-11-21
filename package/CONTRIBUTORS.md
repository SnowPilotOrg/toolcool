# Notes for contributors

- Building:
  - `bun build` is used to build the package.
  - `bun test` is used to run the tests.

- Publishing:
  - `bun publish`
  - `bun publish --access public` is used to publish the package for the first time.
  - `bun publish --dry-run` is used to check the package is ready to be published.

- Version bumps:
  - `bun version patch`  # 0.1.0 -> 0.1.1
  - `bun version minor`  # 0.1.0 -> 0.2.0
  - `bun version major`  # 0.1.0 -> 1.0.0