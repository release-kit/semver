## Navigation

- [Usage](#usage)
- [Options](#options)
- [Outputs](#outputs)
- [Contrubuting](#contributing)
- [Maintenance](#maintenance)
  - [Regular flow](#regular-flow)
  - [Prerelease from](#prerelease-flow)
  - [Conventions](#conventions)

## Usage

Extract and parse version:

```yml
steps:
  # from tag (may be v-prefixed)
  - name: Parse version from tag
    id: version
    uses: release-kit/semver@v1
  
  # from v-prefixed string
  - name: Parse version from string
    id: version
    uses: release-kit/semver@v1
    with:
      input: 'v4.5.0'

  # from custom string
  - name: Parse version from custom string
    id: version
    uses: release-kit/semver@v1
    with:
      input: 'my-version:4.5.0'
      extract: '^my-version:(.*)$' # ^v?(.*)$ by default

  # from tag with custom fallback
  - name: Parse version from tag with custom fallback
    id: version
    uses: release-kit/semver@v1
    with:
      fallback: 'v1.0.0' # v0.1.0 by default
```

Use parsed result:

```yml
- name: Use parsed version
  run: |
    echo "${{ steps.version.outputs.major }}"
    echo "${{ steps.version.outputs.minor }}"
    echo "${{ steps.version.outputs.patch }}"
    echo "${{ steps.version.outputs.prerelease }}"
    echo "${{ steps.version.outputs.build }}"
    echo "${{ steps.version.outputs.full }}"
    echo "${{ steps.version.outputs.tag }}"
```

## Options

- `input` (optional, defaults to git tag) - custom string to use instead of git tag
- `fallback` (optional, defaults to `v0.1.0`) - fallback string when tag is not found
- `extract` (optional, defaults to `^v?(.*)$`) - regex to extract version from string

## Outputs

- `major` - `3` in `v3.4.5-alpha+1.2`
- `minor` - `4` in `v3.4.5-alpha+1.2`
- `patch` - `5` in `v3.4.5-alpha+1.2`
- `prerelease` - `alpha` in `v3.4.5-alpha+1.2` (empty string if no present)
- `build` - `1.2` in `v3.4.5-alpha+1.2` (empty string if no present)
- `full` - `3.4.5-alpha+1.2` in `v3.4.5-alpha+1.2`
- `tag` - `v3.4.5-alpha+1.2` in `v3.4.5-alpha+1.2`

## Contributing

1. Fork this repo
2. Use the [Regular flow](#regular-flow)

Please follow [Conventions](#conventions)

## Maintenance

The dev branch is `main` - any developer changes is merged in there.

Also, there is a `release/latest` branch. It always contains the actual source code for release published with `latest` tag.

All changes is made using Pull Requests - push is forbidden. PR can be merged only after successfull `test-and-build` workflow checks.

When PR is merged, `release-drafter` workflow creates/updates a draft release. The changelog is built from the merged branch scope (`feat`, `fix`, etc) and PR title. When release is ready - we publish the draft.

Then, the `release` workflow handles everything:

- It runs tests, builds a package, and publishes it
- It synchronizes released tag with `release/latest` branch

### Regular flow

1. Create [feature branch](#conventions)
2. Make changes in your feature branch and [commit](#conventions)
3. Create a Pull Request from your feature branch to `main`  
   The PR is needed to test the code before pushing to release branch
4. If your PR contains breaking changes, don't forget to put a `BREAKING CHANGES` label
5. Merge the PR in `main`
6. All done! Now you have a drafted release - just publish it when ready

### Prerelease flow

1. Assume your prerelease tag is `beta`
2. Create `release/beta` branch
3. Create [feature branch](#conventions)
4. Make changes in your feature branch and [commit](#conventions)
5. Create a Pull Request from your feature branch to `release/beta`  
   The PR is needed to test the code before pushing to release branch
6. Create Github release with tag like `v1.0.0-beta`, pointing to `release/beta` branch  
   For next `beta` versions use semver build syntax: `v1.0.0-beta+1`  
7. After that, the `release` workflow will publish your package with the `beta` tag
8. When the `beta` version is ready to become `latest` - create a Pull Request from `release/beta` to `main` branch
9. Continue from the [Regular flow's](#regular-flow) #5 step

### Conventions

**Feature branches**:
- Should start with `feat/`, `fix/`, `docs/`, `refactor/`, and etc., depending on the changes you want to propose (see [pr-labeler.yml](./.github/pr-labeler.yml) for a full list of scopes)

**Commits**:
- Should follow the [Conventional Commits specification](https://www.conventionalcommits.org)

**Pull requests**:
- Should have human-readable name, for example: "Add a TODO list feature"
- Should describe changes
- Should have correct labels
