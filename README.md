# gitlabels

> This action configures labels in a repository based on **labels.json** file.


## Usage

Basic usage of the **gitlabels** action. The `GITHUB_TOKEN` token must
be passed as environment variable.

```yaml
steps:
- uses: actions/checkout@v3
- uses: gitlabels/gitlabels@v1
  env:
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

The action requires the `issues: write` permission when using the `GITHUB_TOKEN` token.

```yaml
name: labels

permissions:
  contents: read
  issues: write

jobs:
  labels:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: gitlabels/gitlabels@v1
        env:
          GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```


## License

Source code is licensed under the [MIT License](LICENSE).
