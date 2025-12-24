# Morning Meeting

Morning Meeting is a local-network web app for interactive classroom presentations, attendance, and people profiles. It uses a SvelteKit frontend and a PocketBase backend for data storage.

## Tech Stack

- SvelteKit 5 + Skeleton UI + Tailwind CSS
- PocketBase
- Node/NPM LTS (tested with 22.14.0)

## Repo Layout

- `sveltekit/`: SvelteKit application
- `pocketbase/`: PocketBase binaries, data, hooks, and migrations
- `setup.sh`: Convenience script for local setup
- `setup.env`: Config used by `setup.sh`
- `llm/`, `notes/`: Internal docs and experiments

## Getting Started

1) Clone the repo

```bash
git clone https://github.com/Stewball32/MorningMeetingLocal.git
cd MorningMeetingLocal
```

2) Run the setup script (bash required)

```bash
./setup.sh
```

The setup script will:
- Download the PocketBase binary for your OS/arch
- Optionally copy `sample_pb_data/` into `pb_data/` (backing up any existing data)
- Create `sveltekit/.env` from `.env.example` if needed
- Install SvelteKit dependencies

If you do not want to run the script, see `sveltekit/README.md` and `pocketbase/README.md` for manual steps.

## Development

Start PocketBase:

```bash
cd pocketbase
./pocketbase serve
```

Start SvelteKit:

```bash
cd sveltekit
npm run dev
```

LAN testing:

```bash
cd pocketbase
./pocketbase serve --http=0.0.0.0:8090
```

```bash
cd sveltekit
npm run devhost
```

PocketBase admin UI:

```
http://127.0.0.1:8090/_/
```

## License

MIT - see `LICENSE`.

---

Push the Elevator!
