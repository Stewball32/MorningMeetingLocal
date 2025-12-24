# PocketBase Backend

This folder contains the PocketBase binary and project data for Morning Meeting.

## Contents

- `pocketbase` / `pocketbase.exe`: PocketBase binary
- `pb_data/`: Runtime database and files
- `pb_migrations/`: Schema migrations
- `pb_hooks/`: Server-side hooks
- `sample_pb_data/`: Optional starter data

## Run PocketBase

```bash
cd pocketbase
./pocketbase serve
```

LAN access:

```bash
./pocketbase serve --http=0.0.0.0:8090
```

Admin UI:

```
http://127.0.0.1:8090/_/
```

## Sample Data

If you want to load the sample dataset:

```bash
cp -r sample_pb_data pb_data
```

The root `setup.sh` script can do this for you and will back up any existing `pb_data/`.
