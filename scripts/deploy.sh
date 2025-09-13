#!/bin/bash

# Settings

FREEZE="_"
BUNDLE_DIRS="./desktop.bundles"

case "${YENV}" in
    "production")
        WWW_ROOT="/opt/nginx/www/hypnotoad"
        ;;
    "testing")
        WWW_ROOT="/opt/nginx/www/hypnotoad-beta"
        ;;
    *)
        echo "Set environment variable YENV=<production|testing>"
        exit 1
esac

echo "Deploy to '${WWW_ROOT}'"

# Check folders
[[ -d "${WWW_ROOT}" ]] || (echo "Not found folder '${WWW_ROOT}' from WWW_ROOT"; exit 1)
[[ -d "./${FREEZE}" ]] || (echo "Not found folder '${FREEZE}' from FREEZE"; exit 1)
for d in ${BUNDLE_DIRS}; do
    [[ -d "${d}" ]] || (echo "Not found folder '${d}' from BUNDLE_DIRS"; exit 1)
done

# Gzip static files
find ${FREEZE} -type f -regex ".*\.\(css\|js\|svg\)" -exec gzip -fk -- "{}" \;

# Remove all from www root except for freeze folder
find ${WWW_ROOT} -maxdepth 1 -mindepth 1 \
        -not -wholename "${WWW_ROOT}/${FREEZE}" -print0 | xargs -0 rm -rf --

# Move to www root
rsync -amv \
        --include="*/" \
        --include="${FREEZE}/*" \
        --exclude="**/*.src.html" \
        --include="**/*.html" \
        --include="robots.txt" \
        --exclude="*" \
        ./${FREEZE} ${BUNDLE_DIRS} "robots.txt" ${WWW_ROOT}
