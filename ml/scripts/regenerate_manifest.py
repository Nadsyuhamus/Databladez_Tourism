"""Regenerate or verify checksums for the exported ML artifact bundle."""

from __future__ import annotations

import argparse
import hashlib
import json
from datetime import datetime, timezone
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[2]
MANIFEST_PATH = REPO_ROOT / "ml/artifacts/export_manifest.json"

EXPORTED_FILES = [
    "ml/artifacts/tourism_demand_residual_model.cbm",
    "ml/artifacts/model_metadata.json",
    "ml/artifacts/scoring_metadata.json",
    "ml/artifacts/district_signal_metadata.json",
    "ml/outputs/demand_forecast_latest.csv",
    "ml/outputs/demand_forecast_latest.json",
    "ml/outputs/series_registry.csv",
    "ml/outputs/state_tourism_intelligence_latest.csv",
    "ml/outputs/state_tourism_intelligence_latest.json",
    "ml/outputs/district_series_crosswalk.csv",
    "ml/outputs/district_emerging_signals_latest.csv",
    "ml/outputs/district_emerging_signals_latest.json",
]


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as file:
        for chunk in iter(lambda: file.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def require_exported_files() -> list[Path]:
    paths = [REPO_ROOT / relative_path for relative_path in EXPORTED_FILES]
    missing = [str(path) for path in paths if not path.is_file()]
    if missing:
        raise FileNotFoundError(f"Missing exported files: {missing}")
    return paths


def load_json(relative_path: str):
    with (REPO_ROOT / relative_path).open(encoding="utf-8") as file:
        return json.load(file)


def build_manifest() -> dict:
    paths = require_exported_files()
    forecasts = load_json("ml/outputs/demand_forecast_latest.json")
    states = load_json("ml/outputs/state_tourism_intelligence_latest.json")
    districts = load_json("ml/outputs/district_emerging_signals_latest.json")
    model_metadata = load_json("ml/artifacts/model_metadata.json")

    files = []
    for path in paths:
        files.append(
            {
                "path": path.relative_to(REPO_ROOT).as_posix(),
                "size_bytes": path.stat().st_size,
                "sha256": sha256(path),
            }
        )

    return {
        "bundle_name": "Tourism ML dashboard bundle",
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "model_version": model_metadata.get("model_version"),
        "branch_target": "main",
        "file_count": len(files),
        "forecast_series": len(forecasts),
        "state_records": len(states),
        "district_records": len(districts),
        "digitally_scored_districts": sum(
            item.get("digital_emerging_signal_score") is not None
            for item in districts
        ),
        "constant_or_unscored_districts": sum(
            item.get("digital_emerging_signal_score") is None
            for item in districts
        ),
        "files": files,
    }


def write_manifest() -> None:
    manifest = build_manifest()
    MANIFEST_PATH.write_text(
        json.dumps(manifest, indent=2) + "\n",
        encoding="utf-8",
        newline="\n",
    )
    print(f"Regenerated {MANIFEST_PATH.relative_to(REPO_ROOT)}")


def verify_manifest() -> None:
    require_exported_files()
    if not MANIFEST_PATH.is_file():
        raise FileNotFoundError(f"Missing manifest: {MANIFEST_PATH}")

    manifest = load_json("ml/artifacts/export_manifest.json")
    failures = []

    for item in manifest.get("files", []):
        path = REPO_ROOT / item["path"]
        if not path.is_file():
            failures.append(f"missing: {item['path']}")
            continue

        actual = sha256(path)
        if actual != item["sha256"]:
            failures.append(f"checksum mismatch: {item['path']}")

        if path.stat().st_size != item["size_bytes"]:
            failures.append(f"size mismatch: {item['path']}")

    if failures:
        raise RuntimeError("Manifest verification failed:\n" + "\n".join(failures))

    if len(manifest.get("files", [])) != len(EXPORTED_FILES):
        raise RuntimeError("Manifest file count does not match the export contract")

    print(f"Verified {len(EXPORTED_FILES)} exported files")


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--check",
        action="store_true",
        help="Verify the existing manifest without rewriting it.",
    )
    arguments = parser.parse_args()

    if arguments.check:
        verify_manifest()
    else:
        write_manifest()
        verify_manifest()


if __name__ == "__main__":
    main()

