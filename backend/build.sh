#!/usr/bin/env bash
set -euo pipefail

python -m pip install --upgrade pip
pip install poetry
poetry config virtualenvs.create false
poetry install --no-dev