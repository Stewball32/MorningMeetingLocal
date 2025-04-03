#!/bin/bash
set -e

# Load config from setup.env
if [[ -f setup.env ]]; then
	source ./setup.env
fi

# Defaults
POCKETBASE_VERSION="${POCKETBASE_VERSION:-0.26.6}"
PB_DIR="${PB_DIR:-pocketbase}"
ANIMOTION_DIR="${ANIMOTION_DIR:-animotion}"

# Detect platform and arch
OS=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)
[[ "$ARCH" == "x86_64" ]] && ARCH="amd64"
[[ "$ARCH" == "aarch64" || "$ARCH" == "arm64" ]] && ARCH="arm64"
[[ "$ARCH" == "armv7l" ]] && ARCH="armv7"

FILENAME="pocketbase_${POCKETBASE_VERSION}_${OS}_${ARCH}.zip"
URL="https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/${FILENAME}"

mkdir -p "$PB_DIR"

echo "Downloading PocketBase from $URL..."
curl -L -o "$PB_DIR/pb.zip" "$URL"

echo "Unzipping..."
unzip -o "$PB_DIR/pb.zip" -d "$PB_DIR"
chmod +x "$PB_DIR/pocketbase" || true
rm "$PB_DIR/pb.zip"
echo "PocketBase extracted to $PB_DIR/"

# Create animotion/.env from .env.example if missing
if [[ ! -f "$ANIMOTION_DIR/.env" && -f "$ANIMOTION_DIR/.env.example" ]]; then
	echo "Creating $ANIMOTION_DIR/.env from .env.example..."
	cp "$ANIMOTION_DIR/.env.example" "$ANIMOTION_DIR/.env"
	echo "$ANIMOTION_DIR/.env created."
else
	echo "$ANIMOTION_DIR/.env already exists or .env.example missing. Skipping."
fi

# Ask to copy sample_pb_data to pb_data, backing up existing
read -p "Copy $PB_DIR/sample_pb_data/ as $PB_DIR/pb_data/? This will back up existing pb_data/. (y/N): " COPY
if [[ "$COPY" =~ ^[Yy]$ ]]; then
	if [[ ! -d "$PB_DIR/sample_pb_data" ]]; then
		echo "Folder not found: $PB_DIR/sample_pb_data"
	else
		if [[ -d "$PB_DIR/pb_data" ]]; then
			mkdir -p "$PB_DIR/.backups"
			TIMESTAMP=$(date +%Y%m%d_%H%M%S)
			BACKUP_PATH="$PB_DIR/.backups/pb_data_$TIMESTAMP"
			mv "$PB_DIR/pb_data" "$BACKUP_PATH"
			echo "Existing pb_data/ backed up to $BACKUP_PATH"
		fi
		cp -r "$PB_DIR/sample_pb_data" "$PB_DIR/pb_data"
		echo "sample_pb_data/ copied to pb_data/"
	fi
fi

# Install npm packages
if [[ -f "$ANIMOTION_DIR/package.json" ]]; then
	echo "Installing npm packages in $ANIMOTION_DIR/..."
	(cd "$ANIMOTION_DIR" && npm install)
else
	echo "$ANIMOTION_DIR/package.json not found. Skipping npm install."
fi

echo "Dev setup complete."
