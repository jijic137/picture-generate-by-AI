# Lumina AI Studio

An elegant AI image generation app powered by **FLUX.1-schnell** via Hugging Face.

## Setup & Configuration

### 1. Get Hugging Face Token (Free)
1. Register or Login at [Hugging Face](https://huggingface.co/).
2. Go to [Settings -> Access Tokens](https://huggingface.co/settings/tokens).
3. Click **Create new token**.
4. Select **Read** permissions (or Write, both work).
5. Copy your new token (starts with `hf_`).

### 2. Configure Environment Variables

**For Vercel Deployment:**
1. Go to your project settings on Vercel.
2. Navigate to **Environment Variables**.
3. Add a new variable:
   - **Key**: `API_KEY`
   - **Value**: `Your_Hugging_Face_Token_Here`
4. **Redeploy** your application for the changes to take effect.

**For Local Development:**
1. Create a file named `.env` in the root directory.
2. Add your key:
   ```env
   API_KEY=hf_xxxxxxxxxxxxxxxxxxxxxxxx
   ```

### 3. Running Locally
**Important:** Because this project uses Serverless Functions for the backend, you must use the Vercel CLI.

```bash
# 1. Install dependencies
npm install

# 2. Install Vercel CLI globally (if not installed)
npm install -g vercel

# 3. Run the app
vercel dev
```

The app will be available at http://localhost:3000.

## Troubleshooting

### "Model is loading" (503 Error)
Since we are using the free Hugging Face Inference API, the model ("cold boot") might take a few seconds to load if it hasn't been used recently.
- **Solution**: Just wait 20-30 seconds and click "Generate" again. It will work once loaded.

### "Rate limit exceeded"
The free API has rate limits. If you generate too many images too quickly, just wait a minute before trying again.
