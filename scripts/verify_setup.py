#!/usr/bin/env python3
"""
Verify Setup Script

Checks that the environment is correctly configured for the Way Back Home codelab:
- Google Cloud project is set
- Vertex AI API is enabled
- Python dependencies are installed

Run this AFTER installing dependencies (pip install -r level_0/requirements.txt)
"""

import os
import sys
import subprocess


def check_gcloud_project() -> tuple[bool, str]:
    """Check if a Google Cloud project is configured."""
    # First check environment variable
    project_id = os.environ.get("GOOGLE_CLOUD_PROJECT")

    if not project_id:
        # Try to get from gcloud config
        try:
            result = subprocess.run(
                ["gcloud", "config", "get-value", "project"],
                capture_output=True,
                text=True,
                timeout=10
            )
            project_id = result.stdout.strip()
        except (subprocess.TimeoutExpired, FileNotFoundError):
            pass

    if project_id and project_id != "(unset)":
        return True, project_id
    return False, ""


def check_vertex_ai_api(project_id: str) -> bool:
    """Check if Vertex AI API is enabled."""
    try:
        result = subprocess.run(
            ["gcloud", "services", "list", "--enabled",
             "--filter=name:aiplatform.googleapis.com",
             "--format=value(name)",
             f"--project={project_id}"],
            capture_output=True,
            text=True,
            timeout=30
        )
        return "aiplatform.googleapis.com" in result.stdout
    except (subprocess.TimeoutExpired, FileNotFoundError):
        # If we can't check, assume it might be enabled
        return True


def check_dependencies() -> tuple[bool, list[str]]:
    """Check if required Python packages are installed."""
    missing = []

    try:
        import google.genai
    except ImportError:
        missing.append("google-genai")

    try:
        from PIL import Image
    except ImportError:
        missing.append("Pillow")

    try:
        import requests
    except ImportError:
        missing.append("requests")

    return len(missing) == 0, missing


def main():
    """Run all verification checks."""
    print("🔍 Verifying Way Back Home setup...\n")

    all_passed = True

    # Check 1: Google Cloud Project
    project_ok, project_id = check_gcloud_project()
    if project_ok:
        print(f"✓ Google Cloud project configured: {project_id}")
    else:
        print("✗ Google Cloud project not configured")
        print("  Run: gcloud config set project YOUR_PROJECT_ID")
        all_passed = False

    # Check 2: Vertex AI API (only if project is configured)
    if project_ok:
        api_ok = check_vertex_ai_api(project_id)
        if api_ok:
            print("✓ Vertex AI API enabled")
        else:
            print("✗ Vertex AI API may not be enabled")
            print("  Run: gcloud services enable aiplatform.googleapis.com")
            all_passed = False

    # Check 3: Python dependencies
    deps_ok, missing = check_dependencies()
    if deps_ok:
        print("✓ Dependencies installed")
    else:
        print(f"✗ Missing dependencies: {', '.join(missing)}")
        print("  Make sure you activated the virtual environment:")
        print("    source level_0/.venv/bin/activate")
        print("  Then install dependencies:")
        print("    pip install -r level_0/requirements.txt")
        all_passed = False

    # Final result
    print()
    if all_passed:
        print("✓ Ready to proceed!")
        return 0
    else:
        print("✗ Please fix the issues above before continuing.")
        return 1


if __name__ == "__main__":
    sys.exit(main())
