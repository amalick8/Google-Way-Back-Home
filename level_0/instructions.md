---
id: way-back-home-level-0
title: Generate Space Explorer Avatar with Nano Banana 🍌
summary: Generate your unique space explorer avatar using multi-turn image generation with Gemini
authors: Ayo Adedeji
duration: 10
layout: paginated
award_behavior: AWARD_BEHAVIOR_ENABLE

---
# Way Back Home - Level 0: Identify Yourself

## The Distress Signal
Duration: 1 min

![Header](img/01-01-header.gif)

Your escape pod tears through the atmosphere of an unknown world. Warning lights flash across every panel. The navigation system is fried. Communications are down. As the pod's emergency protocols engage, the AI assistant crackles to life:

> *"Survivor detected. Emergency landing successful. Initiating rescue beacon protocol..."*
>
> *"WARNING: Identity verification required. The galactic rescue network cannot locate unregistered explorers. Please confirm your identity to activate your beacon."*

You look out the viewport. An alien landscape stretches to the horizon—strange rock formations, unfamiliar vegetation, an oddly-colored sky. Somewhere out there, other survivors from your mission are scattered across this planet's surface.

But first things first: **you need to exist in the system.**

### What You'll Build

In this level, you'll create your unique space explorer identity using **multi-turn image generation** with Google's Gemini image generation models (also known as [Nano Banana](https://gemini.google/overview/image-generation/) 🍌). Your avatar will appear on the global rescue map, visible to all other survivors at your workshop event.

![architecture](img/01-02-architecture.png)

### What You'll Learn

| Concept | Description |
|---------|-------------|
| **Multi-turn Image Generation** | How to maintain character consistency across multiple image generations using chat sessions |
| **Prompt Engineering for Images** | Crafting effective prompts for stylized, consistent outputs with specific constraints |
| **Gemini Image API (Nano Banana)** | Using Gemini's native image generation capabilities via the Python SDK |
| **Chat Sessions** | Leveraging conversation context for iterative refinement and character consistency |

By the end of this level, you will have:

✅ Generated a **portrait** of your explorer using text-to-image AI  
✅ Created a consistent **map icon** using multi-turn conversation  
✅ Registered your identity with the rescue network  
✅ Appeared on the live world map alongside other explorers

Let's get you on the map! 📍

## Prepare Your Environment
Duration: 2 mins

### Access Cloud Shell

First, we'll open Cloud Shell, which is a browser-based terminal with the Google Cloud SDK and other essential tools pre-installed.

### Need Google Cloud Credits?
> • **If you are attending an instructor-led workshop**: Your instructor will provide you with a credit code. Please use the one they provide.  
> • **If you are working through this Codelab on your own**: You can redeem a free Google Cloud credit to cover the workshop costs. Please [click this link](https://goo.gle/way-back-home-credits) to get a credit and follow the steps in the video guide below to apply it to your account.  
>[![Watch the video](img/02-01-redeem-google-cloud-credits.png)](https://youtu.be/dR-NrgMTADs)  
>

Click **Activate Cloud Shell** at the top of the Google Cloud Console (it's the terminal icon in the top-right navigation bar).

![cloud shell](img/02-02-cloud-shell.png)

Find your Google Cloud Project ID:

- Open the Google Cloud Console: [https://console.cloud.google.com](https://console.cloud.google.com)  
- Select the project you want to use for this workshop from the project dropdown at the top of the page.  
- Your Project ID is displayed in the Project info card on the Dashboard  
![project id](img/02-03-project-id.png)

Once Cloud Shell opens, verify you're authenticated:

```bash
# Check that you are logged in
gcloud auth list
```

You should see your account listed as `(ACTIVE)`.

### Configure Your Project

Set your Google Cloud project. Replace `YOUR_PROJECT_ID` with your actual project ID (visible in the Cloud Console project selector):

```bash
gcloud config set project YOUR_PROJECT_ID
```

Verify the project is set correctly:

```bash
export PROJECT_ID=$(gcloud config get-value project)
echo "Using project: $PROJECT_ID"
```

You should see your project ID printed (not `(unset)`). If you see `(unset)`, re-run the `gcloud config set project` command above.

### Enable Required APIs

Enable the Vertex AI API for image generation:

```bash
gcloud services enable aiplatform.googleapis.com
```

### Clone the Repository

Clone the Way Back Home repository and navigate to the project:

```bash
git clone https://github.com/google-americas/way-back-home.git
cd way-back-home
```

### Install Dependencies

Navigate to Level 0 and install the required Python packages:

```bash
cd level_0
uv sync
```

The key dependencies are:

| Package | Purpose |
|---------|---------|
| `google-genai` | Gemini API client for image generation |
| `requests` | HTTP client for API calls to Mission Control |
| `Pillow` | Image processing and file handling |

### Verify Setup

Run a quick verification to ensure everything is configured correctly:

```bash
cd $HOME/way-back-home
python scripts/verify_setup.py
```

You should see:

```
✓ Google Cloud project configured: your-project-id
✓ Vertex AI API enabled
✓ Python environment ready (uv)
✓ Ready to proceed!
```

<aside class="negative">
<strong>Troubleshooting</strong>

If verification fails:
<ul>
<li><strong>Project not configured:</strong> Run <code>gcloud config set project YOUR_PROJECT_ID</code></li>
<li><strong>API not enabled:</strong> Run <code>gcloud services enable aiplatform.googleapis.com</code></li>
<li><strong>Missing dependencies:</strong> Re-run <code>uv sync</code> from the <code>level_0</code> directory</li>
</ul>
</aside>

### What You Just Completed

✓ Opened Cloud Shell  
✓ Configured your Google Cloud project  
✓ Enabled Vertex AI APIs  
✓ Cloned the codelab repository  
✓ Installed Python dependencies with `uv`  
✓ Verified your setup  

**Next:** Connect to Mission Control and claim your explorer name.

## Connect to Mission Control
Duration: 2 mins

### Run the Setup Script

The setup script connects you to the Way Back Home rescue network and reserves your explorer identity. Run it from the project root:

```bash
cd $HOME/way-back-home
chmod +x scripts/setup.sh
./scripts/setup.sh
```

You'll be prompted for two pieces of information.

### Enter Your Event Code

The event code identifies which workshop event you're participating in. 

**If you're at a workshop:** Enter the event code from the QR code, slide, or your workshop instructor.

```
🚀 Welcome to Way Back Home!

Enter event code (from QR/slide): devfest-nyc-26
Validating event...
✓ Connected to: DevFest NYC 2026
```

**If you're learning on your own:** Enter `sandbox` to join the public learning environment.

```
🚀 Welcome to Way Back Home!

Enter event code (from QR/slide): sandbox
Validating event...
✓ Connected to: Way Back Home Sandbox
```

<aside class="positive">
<strong>The Sandbox Environment</strong>

The <code>sandbox</code> event is a permanent public environment for self-learners. You'll share the map with other learners from around the world—it's a great way to see you're not alone on this journey! The sandbox resets weekly, so don't worry about cluttering it up.
</aside>

<aside class="negative">
<strong>Event Not Found?</strong>

Double-check your event code. It's case-sensitive and usually follows a pattern like <code>city-event-year</code>. If you're at a workshop, ask your instructor. If you're learning solo, use <code>sandbox</code>.
</aside>

<aside class="positive">
<strong>How Event Validation Works</strong>

When you enter your event code, the setup script calls the Mission Control API to verify the event exists:

<code>GET https://api.waybackhome.dev/events/devfest-nyc-26</code>

The API checks a database of active workshop events. If valid, it returns the event name and configuration. This ensures you're connecting to a real, active workshop session.
</aside>

### Choose Your Explorer Name

Pick a unique name for your explorer. This is how you'll appear on the world map and leaderboard.

```
Choose your explorer name: AstroAyo
✓ Username available!
```

If your chosen name is already taken by another participant at the same event:

```
Choose your explorer name: SpaceExplorer
⚠️  That name is taken. Try another.
Choose your explorer name: SpaceExplorer42
✓ Username available!
```

### Setup Complete

Once complete, you'll see confirmation:

```
Initializing your explorer profile...

✓ Environment configured!
  Explorer ID: a1b2c3d4
  Starting coordinates: (47, 23)

Next: cd level_0 && python customize.py
```

<aside class="positive">
<strong>What Just Happened?</strong>

The setup script made several API calls to Mission Control:

1. <strong>Validated your event code</strong> — Confirmed the workshop event exists and is active
2. <strong>Checked username availability</strong> — Ensured no one else at your event has claimed that name
3. <strong>Reserved your identity</strong> — Created a participant slot with a unique ID
4. <strong>Assigned starting coordinates</strong> — Placed you at a random location on the planet surface
5. <strong>Saved configuration</strong> — Wrote all details to <code>config.json</code> in the project root
</aside>

### Navigate to Level 0

Now navigate to the Level 0 directory (your dependencies are already installed from Module 2):

```bash
cd level_0
```

<aside class="negative">
<strong>Environment Reminder</strong>

If you opened a new terminal, run <code>uv sync</code> from the <code>level_0</code> directory to ensure your environment is ready. All <code>python</code> commands below can also be run with <code>uv run python</code> to automatically use the correct environment.
</aside>

### Examine Your Configuration

Take a look at what was saved (config.json is in the project root):

```bash
cat ../config.json
```

```json
{
    "event_code": "devfest-nyc-26",
    "event_name": "DevFest NYC 2026",
    "username": "AstroAyo",
    "participant_id": "a1b2c3d4",
    "starting_x": 47,
    "starting_y": 23,
    "api_base": "https://api.waybackhome.dev",
    "project_id": "your-project-id"
}
```

This configuration file will be used by subsequent scripts to identify you to the rescue network.

### What You Just Completed

✓ Connected to Mission Control API  
✓ Reserved your unique explorer name  
✓ Received your participant ID and starting coordinates  
✓ Configuration saved for subsequent steps  

**Next:** Customize your explorer's appearance.

## Customize Your Explorer
Duration: 1 min

### Run the Customization Script

Before generating your avatar, you'll make a few choices about your explorer's appearance:

```bash
uv run python customize.py
```

### Select Your Suit Color

Choose a color for your explorer's space suit:

```
🎨 Let's create your explorer identity!

Select suit color:
  1. Deep Blue
  2. Crimson Red
  3. Forest Green
  4. Royal Purple
  5. Solar Gold
  6. Silver

Choice [1-6, default=6]: 1
✓ Deep Blue selected
```

### Describe Your Explorer (Optional)

You can provide a brief description of your explorer's appearance, or press Enter for a random assignment:

```
Brief description of your explorer (or Enter for random):
Example: 'short dark hair, glasses, friendly smile'
> short dark hair, glasses, determined expression

✓ Preferences saved!
```

If you press Enter without typing anything, you'll get randomized traits:

```
> 
✓ Random traits: confident expression, short styled hair
```

<aside class="positive">
<strong>Tips for Good Descriptions</strong>

Keep your description focused on visible physical traits:
<ul>
<li><strong>Good:</strong> "curly red hair, freckles, warm smile"</li>
<li><strong>Good:</strong> "silver hair in a bun, sharp eyes, weathered face"</li>
<li><strong>Avoid:</strong> Lengthy backstories or non-visual traits</li>
</ul>

The AI will interpret your description when generating the portrait, so clear visual details work best.
</aside>

### Configuration Updated

Your preferences are now saved:

```
✓ Preferences saved!
Next: Open generator.py and follow the codelab instructions
```

Verify the updated configuration:

```bash
cat ../config.json
```

You'll see your preferences added:

```json
{
    "event_code": "devfest-nyc-26",
    "event_name": "DevFest NYC 2026",
    "username": "AstroAyo",
    "participant_id": "a1b2c3d4",
    "starting_x": 47,
    "starting_y": 23,
    "api_base": "https://api.waybackhome.dev",
    "project_id": "your-project-id",
    "suit_color": "deep blue with silver accents",
    "appearance": "short dark hair, glasses, determined expression"
}
```

### What You Just Completed

✓ Selected your suit color  
✓ Defined your explorer's appearance  
✓ Configuration ready for image generation  

**Next:** The main event—writing the image generation code!

## Build the Avatar Generator
Duration: 4 mins

This is the core learning module. You'll write Python code that generates your unique explorer avatar using Gemini's multi-turn image generation capabilities (Nano Banana).

### Open the Generator File

Open the avatar generator in the Cloud Shell Editor:

```bash
cloudshell edit generator.py
```

Or click **Open Editor** in Cloud Shell and navigate to `generator.py` in the `level_0` folder.

### Understanding the File Structure

The file has starter code and three placeholder sections where you'll add your implementation:

```python
"""
Level 0: Avatar Generator

This module generates your unique space explorer avatar using
multi-turn image generation with Gemini (Nano Banana) for
character consistency across portrait and icon.
"""

from google import genai
from google.genai import types
from PIL import Image
import json
import os
import io

# Load configuration from setup (config.json is in project root)
CONFIG_PATH = "../config.json"

with open(CONFIG_PATH) as f:
    config = json.load(f)

USERNAME = config["username"]
SUIT_COLOR = config["suit_color"]
APPEARANCE = config["appearance"]

# Initialize the Gemini client for Vertex AI
client = genai.Client(
    vertexai=True,
    project=os.environ.get("GOOGLE_CLOUD_PROJECT", config.get("project_id")),
    location="us-central1"
)


def generate_explorer_avatar() -> dict:
    """
    Generate portrait and icon using multi-turn chat for consistency.
    
    The key technique here is using a CHAT SESSION rather than independent
    API calls. This allows Gemini to "remember" the character it created
    in the first turn, ensuring the icon matches the portrait.
    
    Returns:
        dict with portrait_path and icon_path
    """
    
    # MODULE_5_STEP_1_CREATE_CHAT_SESSION
    # TODO: Create a chat session for multi-turn generation
    chat = None  # Replace this line
    
    # MODULE_5_STEP_2_GENERATE_PORTRAIT
    # TODO: Generate the explorer portrait
    portrait_image = None  # Replace this section
    
    # MODULE_5_STEP_3_GENERATE_ICON
    # TODO: Generate a consistent map icon
    icon_image = None  # Replace this section
    
    return {
        "portrait_path": "outputs/portrait.png",
        "icon_path": "outputs/icon.png"
    }


if __name__ == "__main__":
    # Create outputs directory if it doesn't exist
    os.makedirs("outputs", exist_ok=True)
    
    print(f"Generating avatar for {USERNAME}...")
    result = generate_explorer_avatar()
    print(f"✅ Avatar created!")
    print(f"   Portrait: {result['portrait_path']}")
    print(f"   Icon: {result['icon_path']}")
```

You'll replace the three `TODO` sections with your implementation.

<aside class="positive">
<strong>Key Concept: Multi-Turn Chat for Character Consistency</strong>

The secret to generating consistent characters across multiple images is using a <strong>chat session</strong>. When you generate an image in a chat, Gemini remembers what it created. Subsequent messages in the same chat can reference "this character" or "the same person" and Gemini will maintain visual consistency.

This is fundamentally different from making separate, independent API calls—those would produce different-looking characters each time because there's no shared context.

<pre><code>
Independent calls:           Chat session:
┌─────────┐                  ┌─────────┐
│ Call 1  │ → Person A       │ Turn 1  │ → Person A
└─────────┘                  │         │
┌─────────┐                  │ Turn 2  │ → Person A (same!)
│ Call 2  │ → Person B       │         │
└─────────┘   (different!)   └─────────┘
</code></pre>
</aside>

### Step 1: Create the Chat Session

Find the placeholder `MODULE_5_STEP_1_CREATE_CHAT_SESSION` and replace the line `chat = None  # Replace this line` with:

```python
    # MODULE_5_STEP_1_CREATE_CHAT_SESSION
    # Create a chat session to maintain character consistency across generations.
    # The chat session preserves context between turns, so Gemini "remembers"
    # what it generated and can create consistent variations.
    chat = client.chats.create(
        model="gemini-2.5-flash-image",  # Nano Banana - Gemini with image generation
        config=types.GenerateContentConfig(
            response_modalities=["TEXT", "IMAGE"]
        )
    )
```

<aside class="positive">
<strong>Understanding the Code</strong>

<ul>
<li><code>client.chats.create()</code> — Creates a new conversation session that maintains context across multiple turns</li>
<li><code>model="gemini-2.5-flash-image"</code> — Uses the Gemini 2.5 Flash model with native image generation (Nano Banana)</li>
<li><code>response_modalities=["TEXT", "IMAGE"]</code> — Tells Gemini we want both text explanations and generated images in responses. This is required for image generation.</li>
</ul>
</aside>

### Step 2: Generate the Portrait

Find `MODULE_5_STEP_2_GENERATE_PORTRAIT` and replace `portrait_image = None  # Replace this section` with the following code:

```python
    # MODULE_5_STEP_2_GENERATE_PORTRAIT
    # First turn: Generate the explorer portrait.
    # This establishes the character that will be referenced in subsequent turns.
    portrait_prompt = f"""Create a stylized space explorer portrait.

Character appearance: {APPEARANCE}
Name on suit patch: "{USERNAME}"
Suit color: {SUIT_COLOR}

CRITICAL STYLE REQUIREMENTS:
- Digital illustration style, clean lines, vibrant saturated colors
- Futuristic but weathered space suit with visible mission patches
- Background: Pure solid white (#FFFFFF) - absolutely no gradients, patterns, or elements
- Frame: Head and shoulders only, 3/4 view facing slightly left
- Lighting: Soft diffused studio lighting, no harsh shadows
- Expression: Determined but approachable
- Art style: Modern animated movie character portrait (similar to Pixar or Dreamworks style)

The white background is essential - the avatar will be composited onto a map."""

    print("🎨 Generating your portrait...")
    portrait_response = chat.send_message(portrait_prompt)
    
    # Extract the image from the response.
    # Gemini returns a response with multiple "parts" - we need to find the image part.
    portrait_image = None
    for part in portrait_response.candidates[0].content.parts:
        if part.inline_data is not None:
            # Found the image! Convert from bytes to PIL Image and save.
            image_bytes = part.inline_data.data
            portrait_image = Image.open(io.BytesIO(image_bytes))
            portrait_image.save("outputs/portrait.png")
            break
    
    if portrait_image is None:
        raise Exception("Failed to generate portrait - no image in response")
    
    print("✓ Portrait generated!")
```

<aside class="positive">
<strong>Prompt Engineering Tips</strong>

Notice how the prompt is carefully structured:

1. <strong>Subject definition</strong> — "Create a stylized space explorer portrait" tells Gemini exactly what we want
2. <strong>Variable injection</strong> — We insert the user's choices ({APPEARANCE}, {USERNAME}, {SUIT_COLOR})
3. <strong>Style requirements</strong> — Specific artistic direction ("digital illustration", "Pixar or Dreamworks style")
4. <strong>Technical constraints</strong> — White background, specific framing, lighting

The <strong>pure white background</strong> constraint is crucial for the Way Back Home experience—it allows avatars to be cleanly composited onto the map without color clashing or fringing artifacts.
</aside>

<aside class="positive">
<strong>Understanding Response Parsing</strong>

Gemini's response contains multiple "parts":
<ul>
<li><strong>Text parts</strong> — The model's commentary or explanation</li>
<li><strong>Image parts</strong> — Generated images as binary data (<code>inline_data</code>)</li>
</ul>

We iterate through the parts looking for <code>inline_data</code>, which contains the raw image bytes. We then convert these bytes to a PIL Image for saving.
</aside>

### Step 3: Generate the Map Icon

Find `MODULE_5_STEP_3_GENERATE_ICON` and replace `icon_image = None  # Replace this section` with:

```python
    # MODULE_5_STEP_3_GENERATE_ICON
    # Second turn: Generate a consistent icon for the map.
    # Because we're in the same chat session, Gemini remembers the character
    # from the portrait and will maintain visual consistency.
    icon_prompt = """Now create a circular map icon of this SAME character.

CRITICAL REQUIREMENTS:
- SAME person, SAME face, SAME expression, SAME suit — maintain perfect consistency with the portrait
- Tighter crop: just the head and very top of shoulders
- Background: Pure solid white (#FFFFFF)
- Optimized for small display sizes (will be used as a 64px map marker)
- Keep the exact same art style, colors, and lighting as the portrait
- Square 1:1 aspect ratio

This icon must be immediately recognizable as the same character from the portrait."""

    print("🖼️  Creating map icon...")
    icon_response = chat.send_message(icon_prompt)
    
    # Extract the icon image from the response
    icon_image = None
    for part in icon_response.candidates[0].content.parts:
        if part.inline_data is not None:
            image_bytes = part.inline_data.data
            icon_image = Image.open(io.BytesIO(image_bytes))
            icon_image.save("outputs/icon.png")
            break
    
    if icon_image is None:
        raise Exception("Failed to generate icon - no image in response")
    
    print("✓ Icon generated!")
```

<aside class="positive">
<strong>Key Concept: Consistency Through Context</strong>

Notice how the icon prompt says "this SAME character" and emphasizes "SAME person, SAME face, SAME expression, SAME suit."

Because we're in the <strong>same chat session</strong>, Gemini knows exactly which character we're referring to—the one it just created in the previous turn. The model maintains this context automatically.

If we had started a new chat session or made an independent API call, Gemini would generate a completely different-looking person because it would have no memory of the previous generation.
</aside>

### Your Completed Code

After adding all three sections, your `generate_explorer_avatar()` function should look like this:

```python
def generate_explorer_avatar() -> dict:
    """
    Generate portrait and icon using multi-turn chat for consistency.
    
    The key technique here is using a CHAT SESSION rather than independent
    API calls. This allows Gemini to "remember" the character it created
    in the first turn, ensuring the icon matches the portrait.
    
    Returns:
        dict with portrait_path and icon_path
    """
    
    # MODULE_5_STEP_1_CREATE_CHAT_SESSION
    # Create a chat session to maintain character consistency across generations.
    # The chat session preserves context between turns, so Gemini "remembers"
    # what it generated and can create consistent variations.
    chat = client.chats.create(
        model="gemini-2.5-flash-image",  # Nano Banana - Gemini with image generation
        config=types.GenerateContentConfig(
            response_modalities=["TEXT", "IMAGE"]
        )
    )
    
    # MODULE_5_STEP_2_GENERATE_PORTRAIT
    # First turn: Generate the explorer portrait.
    # This establishes the character that will be referenced in subsequent turns.
    portrait_prompt = f"""Create a stylized space explorer portrait.

Character appearance: {APPEARANCE}
Name on suit patch: "{USERNAME}"
Suit color: {SUIT_COLOR}

CRITICAL STYLE REQUIREMENTS:
- Digital illustration style, clean lines, vibrant saturated colors
- Futuristic but weathered space suit with visible mission patches
- Background: Pure solid white (#FFFFFF) - absolutely no gradients, patterns, or elements
- Frame: Head and shoulders only, 3/4 view facing slightly left
- Lighting: Soft diffused studio lighting, no harsh shadows
- Expression: Determined but approachable
- Art style: Modern animated movie character portrait (similar to Pixar or Dreamworks style)

The white background is essential - the avatar will be composited onto a map."""

    print("🎨 Generating your portrait...")
    portrait_response = chat.send_message(portrait_prompt)
    
    # Extract the image from the response.
    # Gemini returns a response with multiple "parts" - we need to find the image part.
    portrait_image = None
    for part in portrait_response.candidates[0].content.parts:
        if part.inline_data is not None:
            # Found the image! Convert from bytes to PIL Image and save.
            image_bytes = part.inline_data.data
            portrait_image = Image.open(io.BytesIO(image_bytes))
            portrait_image.save("outputs/portrait.png")
            break
    
    if portrait_image is None:
        raise Exception("Failed to generate portrait - no image in response")
    
    print("✓ Portrait generated!")
    
    # MODULE_5_STEP_3_GENERATE_ICON
    # Second turn: Generate a consistent icon for the map.
    # Because we're in the same chat session, Gemini remembers the character
    # from the portrait and will maintain visual consistency.
    icon_prompt = """Now create a circular map icon of this SAME character.

CRITICAL REQUIREMENTS:
- SAME person, SAME face, SAME expression, SAME suit — maintain perfect consistency with the portrait
- Tighter crop: just the head and very top of shoulders
- Background: Pure solid white (#FFFFFF)
- Optimized for small display sizes (will be used as a 64px map marker)
- Keep the exact same art style, colors, and lighting as the portrait
- Square 1:1 aspect ratio

This icon must be immediately recognizable as the same character from the portrait."""

    print("🖼️  Creating map icon...")
    icon_response = chat.send_message(icon_prompt)
    
    # Extract the icon image from the response
    icon_image = None
    for part in icon_response.candidates[0].content.parts:
        if part.inline_data is not None:
            image_bytes = part.inline_data.data
            icon_image = Image.open(io.BytesIO(image_bytes))
            icon_image.save("outputs/icon.png")
            break
    
    if icon_image is None:
        raise Exception("Failed to generate icon - no image in response")
    
    print("✓ Icon generated!")
    
    return {
        "portrait_path": "outputs/portrait.png",
        "icon_path": "outputs/icon.png"
    }
```

### Save Your File

Make sure to save `generator.py`:  

- **Cloud Shell Editor:** Ctrl+S (Windows/Linux) or Cmd+S (Mac)  
- **vim:** Press Escape, then type `:wq` and Enter

### What You Just Built

✓ Created a chat session for multi-turn image generation  
✓ Crafted a detailed prompt for portrait generation with style constraints  
✓ Generated a consistent map icon using conversation context  
✓ Learned to parse image data from Gemini responses  

**Key Concepts Mastered:**

| Concept | What You Learned |
|---------|-----------------|
| **Chat Sessions** | `client.chats.create()` maintains context across multiple turns |
| **Response Modalities** | `["TEXT", "IMAGE"]` enables image generation in responses |
| **Prompt Structure** | Subject → Variables → Style → Technical Constraints |
| **Character Consistency** | Same chat session = same character across images |
| **Response Parsing** | Extracting images from `inline_data` in response parts |

**Next:** Run your code and see yourself on the map!

## Generate and Register
Duration: 2 mins

### Set Your Project ID

Make sure your project ID is available as an environment variable:

```bash
export GOOGLE_CLOUD_PROJECT=$(gcloud config get-value project)
```

### Run the Identity Creator

Now run the main script that orchestrates generation, upload, and registration:

```bash
uv run python create_identity.py
```

You'll see the generation progress in real-time:

Note: it may take up to 5 seconds for your avatar to appear on the live map, so refresh if you don't see yourself immediately on the map.
```
🚀 Creating identity for AstroAyo...

🎨 Generating your portrait...
✓ Portrait generated!
🖼️  Creating map icon...
✓ Icon generated!

☁️  Uploading to mission database...
✓ Avatar uploaded!

📍 Registering with rescue network...
✓ Registration complete!

╔═══════════════════════════════════════════════════════════════╗
║                    ✅ IDENTITY CONFIRMED!                      ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  Explorer: AstroAyo                                           ║
║  Location: (47, 23) — unconfirmed                             ║
║                                                               ║
║  🗺️  You're now on the map!                                   ║
║  https://waybackhome.dev/e/devfest-nyc-26                     ║
║                                                               ║
║  NEXT: Proceed to Level 1 to pinpoint your exact location!   ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
```

<aside class="positive">
<strong>What Just Happened?</strong>

The <code>create_identity.py</code> script (provided for you) performed several steps:

1. <strong>Called your code</strong> — Executed <code>generate_explorer_avatar()</code> from <code>generator.py</code>
2. <strong>Uploaded images</strong> — Sent your portrait and icon to the Mission Control API
3. <strong>Registered your identity</strong> — Updated your participant record with avatar URLs
4. <strong>Confirmed success</strong> — Your avatar is now live on the world map!

You wrote the image generation logic. The script handled the networking and registration on your behalf.
</aside>

### View Your Generated Avatar

Check out your generated images locally:

```bash
# List the generated files
ls -la outputs/

# Download to view on your local machine
cloudshell download outputs/portrait.png
cloudshell download outputs/icon.png
```

Or view them directly in the Cloud Shell Editor by navigating to the `outputs/` folder and clicking on the image files.

The generated portrait and icon will look something like these images:

![example portrait](img/06-01-portrait.png)
![example icon](img/06-02-icon.png)

### See Yourself on the Map!

Open the world map URL shown in your output:

**https://waybackhome.dev/e/{your-event-code}**

For example: `https://waybackhome.dev/e/devfest-nyc-26`

Find your avatar on the map! You'll see:

- Your **icon** marking your position on the planet surface
- Your **explorer name** as a label below your icon
- A **dimmed beacon** pulsing slowly around your marker

![example avatar on map](img/06-03-avatar-on-map.png)

Click on your marker to see your full portrait in the detail card.

<aside class="positive">
<strong>Why is the beacon dim?</strong>

Your location is currently "unconfirmed" — you're somewhere in the region of coordinates (47, 23), but the rescue network doesn't know your <em>exact</em> position yet. You crash-landed, remember?

In <strong>Level 1: Pinpoint Your Location</strong>, you'll analyze your surroundings using a multi-agent system to confirm your precise coordinates. Once confirmed, your beacon will light up brightly so rescue teams can find you!
</aside>

### Not Happy with Your Avatar? Regenerate!

If you'd like a different avatar, you can regenerate it:

```bash
# Option 1: Change your appearance settings first
uv run python customize.py

# Option 2: Just regenerate with current settings
uv run python create_identity.py
```

Each time you run `create_identity.py`, it generates a **completely new** avatar (new chat session = new character) and updates your registration. Feel free to iterate until you're happy with the result!

<aside class="positive">
<strong>Why Each Run Creates a Different Character</strong>

When you run <code>create_identity.py</code> again, it creates a <em>new</em> chat session. Since there's no previous context, Gemini generates a fresh character.

This is actually desirable here—it lets you regenerate if you don't like the first result. The consistency technique (multi-turn chat) ensures portrait and icon match <em>within</em> a single run, but each run produces a unique character.
</aside>

### Troubleshooting

<aside class="negative">
<strong>Common Issues</strong>

<strong>"Failed to generate portrait - no image in response"</strong>
<ul>
<li>The model may have declined to generate the image due to content policies. Try running again.</li>
<li>Check that your appearance description doesn't contain restricted content.</li>
<li>Ensure you're using a model that supports image generation (<code>gemini-2.5-flash-image</code>).</li>
</ul>

<strong>"ModuleNotFoundError: No module named 'google.genai'"</strong>
<ul>
<li>Re-run <code>uv sync</code> from the <code>level_0</code> directory to ensure dependencies are installed</li>
<li>Use <code>uv run python generator.py</code> to automatically run in the correct environment</li>
</ul>

<strong>"Permission denied" or authentication errors</strong>
<ul>
<li>Ensure your project is set: <code>export GOOGLE_CLOUD_PROJECT=$(gcloud config get-value project)</code></li>
<li>Check that Vertex AI API is enabled: <code>gcloud services enable aiplatform.googleapis.com</code></li>
</ul>

<strong>"Upload failed" or API errors</strong>
<ul>
<li>Check your internet connection in Cloud Shell.</li>
<li>Verify the event is still active (events expire after the workshop ends).</li>
<li>Ask your workshop instructor if the Mission Control API is operational.</li>
</ul>

<strong>Avatar doesn't appear on the map</strong>
<ul>
<li>Give it 5-10 seconds—the map polls for updates periodically.</li>
<li>Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R).</li>
<li>Verify registration completed without errors in your terminal output.</li>
</ul>
</aside>

### What You Just Completed

✓ Generated your unique explorer portrait  
✓ Created a consistent map icon  
✓ Uploaded assets to Mission Control  
✓ Registered your identity with the rescue network  
✓ Appeared on the live world map!  

**Congratulations, explorer!** You now exist in the rescue network. Your beacon is active (though dim), and other survivors can see you on the map.

## Conclusion
Duration: 1 min

### What You Built

In just 10 minutes, you created a complete avatar generation system using multi-turn AI image generation:

```
┌─────────────────────────────────────────────────────────────┐
│                     Your Creation                           │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   📝 Input                       🖼️  Output                  │
│   ──────────                     ────────                    │
│   • Explorer name                • Stylized portrait         │
│   • Suit color                   • Consistent map icon       │
│   • Appearance description       • Live map presence         │
│                                                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│   🧠 Techniques You Used                                     │
│   ──────────────────────                                    │
│   • Multi-turn chat sessions for character consistency      │
│   • Structured prompt engineering with style constraints    │
│   • Response parsing to extract generated images            │
│   • API integration for cloud registration                  │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

### Key Takeaways

| Lesson | Why It Matters |
|--------|---------------|
| **Chat sessions maintain context** | Essential for generating consistent characters across multiple images without variation drift |
| **Prompt structure matters** | Clear constraints (white background, specific style, framing) produce predictable, production-ready results |
| **Multi-turn beats independent calls** | Each message in a chat builds on previous context, enabling iterative refinement and consistency |
| **Response modalities control output** | Setting `["TEXT", "IMAGE"]` is required for image generation—without it, you only get text |

### Cost Summary

For this level, you generated 2 images using Gemini 2.5 Flash (Nano Banana):

| Item | Tokens | Cost |
|------|--------|------|
| Portrait (1024×1024) | ~1,290 output tokens | ~$0.039 |
| Icon (1024×1024) | ~1,290 output tokens | ~$0.039 |
| **Total** | ~2,580 tokens | **~$0.08** |

<aside class="positive">
<strong>Alternative: Nano Banana Pro</strong>

For higher quality output, you could use <code>gemini-3-pro-image-preview</code> (Nano Banana Pro) instead. This produces more detailed, higher-fidelity images but costs approximately <strong>$0.27</strong> for portrait + icon (using 1K resolution).

For workshops with many participants, Nano Banana (Gemini 2.5 Flash) offers an excellent quality-to-cost ratio.
</aside>

### The Journey Continues

Your explorer identity is confirmed, but there's a problem: **your location is unconfirmed.**

Look at the world map—your beacon is dim, pulsing slowly. The rescue network knows you exist, but they don't know exactly where you are. You could be anywhere within a vast region of the planet's surface.

In **Level 1: Pinpoint Your Location**, you'll:

- Build a **multi-agent system** using Google's Agent Development Kit (ADK)
- Create **MCP servers** for geological, botanical, and astronomical analysis
- Process **multimodal input** (images from your crash site)
- Generate a **topographical map** of your confirmed location using AI
- **Light up your beacon** for real — so rescue teams can find you!

Level 1 introduces significantly more advanced concepts: multi-agent orchestration, the Model Context Protocol (MCP), and production deployment patterns. You'll go from using a single model feature to building a complete agentic system.

### Clean Up (Optional)

If you want to clean up local files (run from the `level_0` directory):

```bash
rm -rf outputs/
deactivate  # Exit virtual environment
```

Your registration with the rescue network persists—you'll still appear on the map even after deleting local files. The images are stored in the cloud, not locally.

### Resources

- [Gemini Image Generation Documentation](https://ai.google.dev/gemini-api/docs/image-generation)
- [Prompt Engineering Guide for Images](https://ai.google.dev/gemini-api/docs/image-generation#prompt-guide)
- [Nano Banana Announcement Blog](https://blog.google/technology/ai/nano-banana-pro/)
- [Way Back Home Repository](https://github.com/google-americas/way-back-home)
- [Level 1: Pinpoint Your Location](https://codelabs.developers.google.com/way-back-home-level-1/instructions)

---

**Your beacon awaits confirmation. See you in Level 1, explorer.** 🚀

## Bonus: Photo-Based Avatar (Optional)
Duration: 3 mins

<aside class="positive">
<strong>Optional Section</strong>

This bonus module shows how to use a real photo as the basis for your avatar, transforming it into the stylized space explorer aesthetic using Gemini's image-to-image capabilities. Skip this if you're happy with your text-generated avatar!
</aside>

### When to Use Photo-to-Avatar

You might prefer this approach if:

- You want your avatar to actually resemble you
- You have a specific photo you'd like to stylize
- You want to explore Gemini's image-to-image transformation capabilities

### How It Works

Instead of generating a character purely from text description, you provide a photo and ask Gemini to transform it while preserving the person's likeness:

![photo-to-avatar flow](img/08-01-photo-to-avatar-flow.png)

### Upload Your Photo

First, upload a photo to Cloud Shell:

1. In Cloud Shell, click the three-dot menu (⋮) in the terminal toolbar
2. Select **Upload**
3. Choose a clear headshot photo (JPEG or PNG)
4. Note the uploaded path (e.g., `/home/your-username/my_photo.jpg`)

### Modify the Generator

To use a photo, you'll modify the portrait generation step in `generator.py`. Replace the text-only prompt with a multimodal prompt that includes your photo:

```python
    # MODULE_5_STEP_2_GENERATE_PORTRAIT (Photo-based version)
    
    # Load your photo
    photo_path = "/home/your-username/my_photo.jpg"  # Update this path!
    user_photo = Image.open(photo_path)
    
    # Convert photo to bytes for the API
    photo_buffer = io.BytesIO()
    user_photo.save(photo_buffer, format="JPEG")
    photo_bytes = photo_buffer.getvalue()
    
    portrait_prompt = f"""Transform this person into a stylized space explorer portrait.

PRESERVE from the original photo:
- The person's facial features, face shape, and likeness
- Their general expression and personality
- Any distinctive features (glasses, facial hair, etc.)

TRANSFORM with this style:
- Digital illustration style, clean lines, vibrant saturated colors
- Add a futuristic space suit with the name "{USERNAME}" on a shoulder patch
- Suit color: {SUIT_COLOR}
- Background: Pure solid white (#FFFFFF) - no gradients or elements
- Frame: Head and shoulders, 3/4 view
- Lighting: Soft diffused studio lighting
- Art style: Modern animated movie character (Pixar/Dreamworks aesthetic)

The result should be clearly recognizable as THIS specific person, but illustrated as a heroic space explorer."""

    print("🎨 Transforming your photo into an explorer portrait...")
    
    # Send both the prompt AND the image
    portrait_response = chat.send_message([
        portrait_prompt,
        types.Part.from_bytes(data=photo_bytes, mime_type="image/jpeg")
    ])
    
    # Rest of the extraction code stays the same...
```

### Multi-Turn Consistency Still Works

The multi-turn approach works the same way with photo-based generation:

- **Turn 1**: Photo + prompt → Stylized portrait (your likeness, illustrated)
- **Turn 2**: "Create icon of this SAME character" → Consistent icon

Because the chat session remembers the stylized version it created (not the original photo), the icon will match the transformed portrait perfectly.

### Privacy Considerations

<aside class="negative">
<strong>Privacy Note</strong>

When you upload a photo:
<ul>
<li>The photo is sent to Vertex AI (Google Cloud) for processing</li>
<li>The <em>stylized result</em> (not your original photo) is stored on the rescue network</li>
<li>Only use photos you're comfortable having processed by AI services</li>
<li>The text-based generation (no photo) is always available as a privacy-preserving alternative</li>
</ul>
</aside>

### Try It in Vertex AI Studio

You can also experiment with photo transformation interactively in the Google Cloud Console before writing code:

1. Navigate to [Vertex AI Studio](https://console.cloud.google.com/vertex-ai/studio/multimodal)
2. Select a Gemini model with image capabilities
3. Upload your photo using the attachment button
4. Enter the transformation prompt
5. Iterate on the style until you're happy with the result

This interactive approach is great for experimenting with prompts and seeing results in real-time before committing to code!

### What You Learned (Bonus)

✓ How to use image-to-image transformation with Gemini  
✓ Sending multimodal content (text + image) in a single message  
✓ Preserving likeness while applying artistic style transfer  
✓ Privacy considerations for photo-based AI generation