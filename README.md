# Lumina AI Studio

## Setup & Configuration

### 1. Get Google Gemini API Key
- Go to [Google AI Studio](https://aistudio.google.com/app/apikey).
- Create a new API Key.

### 2. Configure Environment Variables

**For Local Development:**
1. Create a file named `.env` in the root directory.
2. Add your key:
   ```env
   API_KEY=your_google_gemini_api_key_here
   ```

**For Vercel Deployment:**
1. Go to your project settings on Vercel.
2. Navigate to **Environment Variables**.
3. Add a new variable with Key `API_KEY` and your actual API key as the Value.
4. **Redeploy** your application for the changes to take effect.

### 3. Running Locally
**Important:** Because this project uses Serverless Functions for the backend, you must use the Vercel CLI to run it locally. `npm run dev` will only start the frontend and API calls will fail.

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

### Error: Quota Exceeded / Limit: 0
If you receive an error message about `Quota exceeded` or `limit: 0`, this is a restriction from Google, not the app.
- **Billing Required:** The `gemini-2.5-flash-image` model often requires you to enable Billing on your Google Cloud Project, even if you are using the free tier quota.
- **Solution:** Go to [Google AI Studio Billing](https://aistudio.google.com/app/billing) or the Google Cloud Console and verify a payment method is attached to your project.