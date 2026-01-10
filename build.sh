#!/bin/bash

echo ''
echo "Building for $1 distribution"
echo ''

PROJECT_NAME=insurance_admin_portal
PACK_NAME="${1}_${PROJECT_NAME}$(date +_%Y_%m_%d_%H_%M_%S).tar.gz"

echo ''
echo "Removing cache .angular file"
echo ''
rm -rf .angular

echo ''
echo "Removing existing dist"
echo ''
rm -rf dist

rm -rf *.gz *.zip *.xz

echo ''
echo "Formatting all files"
echo ''
npx prettier --write .

echo ''
echo "Calculating 60% of system RAM for build optimization"
echo ''

# Detect OS
OS="$(uname -s)"

if [ "$OS" == "Darwin" ]; then
    # macOS: Get total RAM in bytes
    total_ram=$(sysctl -n hw.memsize)
else
    # Linux: Get total RAM in KB, convert to bytes
    total_ram=$(grep MemTotal /proc/meminfo | awk '{print $2}')
    total_ram=$((total_ram * 1024))
fi

# Calculate 60% of the total RAM
ram_60_percent=$((total_ram * 60 / 100))

# Convert to MB and GB
ram_60_percent_mb=$((ram_60_percent / 1024 / 1024))
ram_60_percent_gb=$((ram_60_percent_mb / 1024))

echo "Angular build production with ${ram_60_percent_gb} GB RAM"
export NODE_OPTIONS="--max_old_space_size=${ram_60_percent_mb}"
ng build --configuration production

echo ''
echo "Removing macOS extended attributes (if applicable)"
echo ''

# Remove macOS extended attributes before archiving
if [ "$OS" == "Darwin" ]; then
    xattr -cr dist
fi

echo ''
echo "Creating tar archive: $PACK_NAME"
echo ''

# macOS: Exclude extended attributes to prevent errors on Linux extraction
if [ "$OS" == "Darwin" ]; then
    tar --disable-copyfile --no-xattrs -cvzf "$PACK_NAME" dist
else
    tar -cvzf "$PACK_NAME" dist
fi

echo ''
echo "Dist has been created: $PACK_NAME"

# Open folder in file explorer
if [ "$OS" == "Darwin" ]; then
    open .
else
    nautilus . &
fi
