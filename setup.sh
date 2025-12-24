#!/bin/bash
set -euo pipefail

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[1;34m'
NC='\033[0m' # No Color

log()      { echo -e "${BLUE}[$(date +'%H:%M:%S')] [INFO]${NC} $*"; }
warn()     { echo -e "${YELLOW}[$(date +'%H:%M:%S')] [WARN]${NC} $*"; }
error()    { echo -e "${RED}[$(date +'%H:%M:%S')] [ERROR]${NC} $*"; }
success()  { echo -e "${GREEN}[$(date +'%H:%M:%S')] [ OK ]${NC} $*"; }

# Load config
if [[ -f setup.env ]]; then
	source ./setup.env
	log "Loaded config from setup.env"
else
	warn "setup.env not found. Using defaults."
fi

# Defaults
POCKETBASE_VERSION="${POCKETBASE_VERSION:-0.26.6}"
PB_DIR="${PB_DIR:-pocketbase}"
SVELTEKIT_DIR="${SVELTEKIT_DIR:-sveltekit}"

# Detect OS/ARCH
UNAME_OS=$(uname -s)
if grep -qi microsoft /proc/version; then
	# WSL detected
	OS="windows"
else
	case "$UNAME_OS" in
		MINGW*|MSYS*|CYGWIN*) OS="windows" ;;
		Linux)                OS="linux" ;;
		Darwin)               OS="darwin" ;;
		*)                    echo "Unsupported OS: $UNAME_OS" && exit 1 ;;
	esac
fi

ARCH=$(uname -m)
[[ "$ARCH" == "x86_64" ]] && ARCH="amd64"
[[ "$ARCH" == "aarch64" || "$ARCH" == "arm64" ]] && ARCH="arm64"
[[ "$ARCH" == "armv7l" ]] && ARCH="armv7"

# Check unsupported arch
if [[ "$ARCH" == "armv7" ]]; then
	error "PocketBase does not provide a binary for 32-bit ARM (armv7). Please use a 64-bit OS (aarch64)."
	exit 1
fi

FILENAME="pocketbase_${POCKETBASE_VERSION}_${OS}_${ARCH}.zip"
URL="https://github.com/pocketbase/pocketbase/releases/download/v${POCKETBASE_VERSION}/${FILENAME}"

mkdir -p "$PB_DIR"
log "Downloading PocketBase from $URL..."
curl -L -o "$PB_DIR/pb.zip" "$URL"

log "Unzipping PocketBase..."
unzip -o "$PB_DIR/pb.zip" -d "$PB_DIR"
chmod +x "$PB_DIR/pocketbase" || true
rm "$PB_DIR/pb.zip"
success "PocketBase extracted to $PB_DIR/"

# Setup SvelteKit .env
if [[ ! -f "$SVELTEKIT_DIR/.env" && -f "$SVELTEKIT_DIR/.env.example" ]]; then
	log "Creating $SVELTEKIT_DIR/.env from .env.example..."
	cp "$SVELTEKIT_DIR/.env.example" "$SVELTEKIT_DIR/.env"
	success "$SVELTEKIT_DIR/.env created."
else
	warn "$SVELTEKIT_DIR/.env already exists or .env.example missing. Skipping."
fi

# Ask to copy sample data
read -p $'\nDo you want to copy \e[1m$PB_DIR/sample_pb_data\e[0m to \e[1m$PB_DIR/pb_data\e[0m?\nThis will back up existing \e[1mpb_data/\e[0m if it exists. [y/N]: ' COPY
if [[ "$COPY" =~ ^[Yy]$ ]]; then
	if [[ ! -d "$PB_DIR/sample_pb_data" ]]; then
		error "Folder not found: $PB_DIR/sample_pb_data"
	else
		if [[ -d "$PB_DIR/pb_data" ]]; then
			mkdir -p "$PB_DIR/.backups"
			TIMESTAMP=$(date +%Y%m%d_%H%M%S)
			BACKUP_PATH="$PB_DIR/.backups/pb_data_$TIMESTAMP"
			mv "$PB_DIR/pb_data" "$BACKUP_PATH"
			log "Existing pb_data/ backed up to $BACKUP_PATH"
		fi
		cp -r "$PB_DIR/sample_pb_data" "$PB_DIR/pb_data"
		success "sample_pb_data/ copied to pb_data/"
	fi
fi

# Ask to install npm packages
read -p $'\nDo you want to run \e[1mnpm install\e[0m in \e[1m$SVELTEKIT_DIR\e[0m? [y/N]: ' INSTALL_NPM
if [[ "$INSTALL_NPM" =~ ^[Yy]$ ]]; then
	if [[ -f "$SVELTEKIT_DIR/package.json" ]]; then
		log "Installing npm packages in $SVELTEKIT_DIR (output suppressed)..."
		INSTALL_OUTPUT=$(cd "$SVELTEKIT_DIR" && npm install --loglevel=error 2>&1)
		AUDIT_OUTPUT=$(cd "$SVELTEKIT_DIR" && npm audit --loglevel=error || true)
		success "npm packages installed."

		if echo "$AUDIT_OUTPUT" | grep -q "vulnerabilit"; then
			warn "npm reported vulnerabilities:"
			echo "$AUDIT_OUTPUT" | grep -E "(vulnerabilit|Run .*npm audit)"
		fi
	else
		warn "$SVELTEKIT_DIR/package.json not found. Skipping npm install."
	fi
else
	warn "Skipped npm install."
fi

success "Dev setup complete."
