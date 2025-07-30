# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/).

## [Unreleased/To Do]

### /pocketbase/

-

### /sveltekit/

- Create pages for nav rail and bar.
  - Ability to view and edit Pocketbase records for non-activity data.

## [0.1.1] - 2025-07-05

### /pocketbase/

- Added guests as their own collection
- Added presentations, deck_slides, and decks as collections
- Removed "x_dailies" collections from schema.
- Replaced with "x_activity" collections
- Now tracks per slide pre presentation instead of just presentation.

### /sveltekit

#### /src/lib/

- added `/decorations/` to hold svg art that can take props.
- /pb/
  - renamed `types.ts` to `schema.ts`
  - added `objects.ts` for wrappers of records.
- /slides/
  - Reorganized layout to support new pocketbase standards.
  - Added standard for student view and interactions.

#### /src/lib/

#### /static/

## [0.1.0] - 2025-04-14

### Removed animotion

- Due to issues with the DOM not updating properly with changes from pocketbase, the project no longer uses reveal.js or animotion as a whole.

### Added sveltekit

- Migrated working code from animotion to new pocketbase instance.
- Still using Skeleton UI v3 for styling w/ Tailwind 4
- Added initial verion of Attendance Slide.

### /

- removed setup.bat (may reinstate when project is more along.)

## [0.0.2] - 2025-04-02

### animotion/

- Added `.ico` file.
- Added `devhost` and `previewhost` scripts to `package.json` for simple network testing.
- Updated Reveal.js presentation options (`reload: true`).

### pocketbase/

- Removed PocketBase binaries.
- Added `sample_pb_data/` for example/easy setup.

### /

- Added `setup.bat` and `setup.sh` scripts for easy setup.
  - Configurable via `setup.env`.
  - **pocketbase/**
    - Detects system OS/architecture and downloads the appropriate PocketBase build.
    - Prompts to copy `sample_pb_data/` to `pb_data/`, backing up existing `pb_data/`.
  - **animotion/**
    - Copies `.env.example` to `.env` if it doesn't already exist.
    - Runs `npm install`.

## [0.0.1] - 2025-03-30

### Fixed

- Updated `README.md` to clarify PocketBase usage for Windows vs Linux

## [0.0.0] - 2025-03-30

### Added

- Initial project setup
- PocketBase backend with `students` and `teachers` collections
- Animotion frontend with SvelteKit, Skeleton UI, Tailwind, and Reveal.js
- `.env.example` configuration file
- Basic slide and attendance view
- Initial draft of `CHANGELOG.md`

### Changed

- Updated `README.md` with setup instructions and tech stack

### Fixed

- N/A

---

## setup.bat parity update (April 2, 2025)

### Added

- Full feature parity with `setup.sh`, including:
  - Environment variable support via `setup.env`
  - Automatic architecture detection (defaults to `amd64` on Windows)
  - PocketBase zip download and extraction based on version and platform
  - `.env` file creation in `animotion/` from `.env.example` if missing
  - Timestamped backup of existing `pb_data/` directory
  - Copying `sample_pb_data/` to `pb_data/`
  - `npm install` run inside `animotion/` if `package.json` exists

### Changed

- Improved user prompts for clarity and confirmation before data copying
- Uses PowerShell `Expand-Archive` for reliable unzip handling on Windows

### Known Limitations

- Does not dynamically detect non-amd64 architectures on Windows (assumes 64-bit)
- Requires PowerShell for unzipping functionality
