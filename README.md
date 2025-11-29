<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1nH1d7onYYnoCHBCPc2ViRbqWxn08XjbE

## Run Locally

**Prerequisites:** Node.js (frontend) and Python 3.10+ (backend)


1. Install frontend dependencies: `npm install`
2. (Optional) Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Start the backend API
   - Create and activate a virtualenv
   - Install `backend/requirements.txt`
   - Run: `uvicorn backend.server:app --reload --host 0.0.0.0 --port 8000`
4. Run the app: `npm run dev`
   - To proxy API calls during dev, set `VITE_BACKEND_URL=http://localhost:8000`
