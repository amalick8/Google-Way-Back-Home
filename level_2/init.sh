
#!/bin/bash

# --- Function for error handling ---
handle_error() {
  echo -e "\n\n*******************************************************"
  echo "Error: $1"
  echo "*******************************************************"
  exit 1
}

# --- Part 1: Find or Create Google Cloud Project ID ---
PROJECT_FILE="$HOME/project_id.txt"
PROJECT_ID_SET=false

# Check if a project ID file already exists and points to a valid project
if [ -s "$PROJECT_FILE" ]; then
    EXISTING_PROJECT_ID=$(cat "$PROJECT_FILE" | tr -d '[:space:]') # Read and trim whitespace
    echo "--- Found existing project ID in $PROJECT_FILE: $EXISTING_PROJECT_ID ---"
    echo "Verifying this project exists in Google Cloud..."

    # Check if the project actually exists in GCP and we have permission to see it
    if gcloud projects describe "$EXISTING_PROJECT_ID" --quiet >/dev/null 2>&1; then
        echo "Project '$EXISTING_PROJECT_ID' successfully verified."
        FINAL_PROJECT_ID=$EXISTING_PROJECT_ID
        PROJECT_ID_SET=true

        # Ensure gcloud config is set to this project for the current session
        gcloud config set project "$FINAL_PROJECT_ID" || handle_error "Failed to set active project to '$FINAL_PROJECT_ID'."
        echo "Set active gcloud project to '$FINAL_PROJECT_ID'."
    else
        echo "Warning: Project '$EXISTING_PROJECT_ID' from file does not exist or you lack permissions."
        echo "Removing invalid reference file and proceeding with new project creation."
        rm "$PROJECT_FILE"
    fi
fi

# If no valid existing project was found in file, start the interactive setup
if [ "$PROJECT_ID_SET" = false ]; then
    echo "--- Setup Google Cloud Project ID ---"
    
    # 1. Detect currently active project to suggest as default
    ACTIVE_PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
    if [ "$ACTIVE_PROJECT_ID" = "(unset)" ]; then
        ACTIVE_PROJECT_ID=""
    fi

    CODELAB_PROJECT_PREFIX="waybackhome"
    PREFIX_LEN=${#CODELAB_PROJECT_PREFIX}
    MAX_SUFFIX_LEN=$(( 30 - PREFIX_LEN - 1 ))
    
    # Prepare a random fallback
    RANDOM_SUFFIX=$(LC_ALL=C tr -dc 'a-z0-9' < /dev/urandom | head -c "$MAX_SUFFIX_LEN")
    RANDOM_PROJECT_ID="${CODELAB_PROJECT_PREFIX}-${RANDOM_SUFFIX}"

    # Default is Active ID (if exists) or Random ID
    FINAL_PROJECT_ID=""
    
    if [ -n "$ACTIVE_PROJECT_ID" ]; then
        echo "Detected active Google Cloud project: $ACTIVE_PROJECT_ID"
        read -p "Use this project? [Y/n] " USE_ACTIVE
        USE_ACTIVE=${USE_ACTIVE:-Y}
        if [[ "$USE_ACTIVE" =~ ^[Yy]$ ]]; then
             FINAL_PROJECT_ID="$ACTIVE_PROJECT_ID"
             echo "Using active project: $FINAL_PROJECT_ID"
        fi
    fi

    # Only show these instructions if we aren't already using the active project
    if [ -z "$FINAL_PROJECT_ID" ]; then
        SUGGESTED_PROJECT_ID="${ACTIVE_PROJECT_ID:-$RANDOM_PROJECT_ID}"
        echo "Detailed Project Setup:"
        echo "1. Enter a project ID to use (or create)."
        echo "2. Press Enter to use default: $SUGGESTED_PROJECT_ID"
    fi
    
    while true; do
      # If we don't have a project ID yet (or previous one failed), ask for one
      if [ -z "$FINAL_PROJECT_ID" ]; then
          read -p "Enter project ID: " INPUT_ID
          FINAL_PROJECT_ID="${INPUT_ID:-$SUGGESTED_PROJECT_ID}"
      fi

      if [[ -z "$FINAL_PROJECT_ID" ]]; then
          echo "Project ID cannot be empty."
          continue
      fi

      echo "Verifying project '$FINAL_PROJECT_ID'..."
      
      # Step A: Check if project exists and we have access
      if gcloud projects describe "$FINAL_PROJECT_ID" >/dev/null 2>&1; then
          echo "Project '$FINAL_PROJECT_ID' already exists and you have access. Using it."
          
          # Finalize
          gcloud config set project "$FINAL_PROJECT_ID" || handle_error "Failed to set active project."
          echo "$FINAL_PROJECT_ID" > "$PROJECT_FILE" || handle_error "Failed to save project ID."
          echo "Successfully saved project ID to $PROJECT_FILE."
          break
      else
          # Step B: Project does not exist, try to create
          echo "Project '$FINAL_PROJECT_ID' not found (or access denied). Attempting to create..."
          ERROR_OUTPUT=$(gcloud projects create "$FINAL_PROJECT_ID" --quiet 2>&1)
          CREATE_STATUS=$?

          if [[ $CREATE_STATUS -eq 0 ]]; then
            echo "Successfully created project: $FINAL_PROJECT_ID"
            gcloud config set project "$FINAL_PROJECT_ID" || handle_error "Failed to set active project."
            echo "$FINAL_PROJECT_ID" > "$PROJECT_FILE" || handle_error "Failed to save project ID."
            echo "Successfully saved project ID to $PROJECT_FILE."
            break
          else
            echo "Could not create project '$FINAL_PROJECT_ID'."
            echo "Reason: $ERROR_OUTPUT"
            echo "Please try a different project ID."
            # Clear FINAL_PROJECT_ID to prompt again
            FINAL_PROJECT_ID=""
          fi
      fi
    done
fi

# --- Part 2: Install Dependencies and Run Billing Setup ---
# This part runs for both existing and newly created projects.
echo -e "\n--- Installing Python dependencies ---"
pip install --upgrade --user google-cloud-billing || handle_error "Failed to install Python libraries."

echo -e "\n--- Running the Billing Enablement Script ---"
python3 billing-enablement.py || handle_error "The billing enablement script failed. See the output above for details."

echo -e "\n--- Full Setup Complete ---"
exit 0
