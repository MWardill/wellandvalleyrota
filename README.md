# Welland Valley Rota

A volunteer rota and scheduling application for the Welland Valley Art Society.

This application is built with **Next.js** (App Router), styled with **Tailwind CSS** and **DaisyUI**, secured with **Auth.js (NextAuth)**, and uses **Google Sheets** as a lightweight, accessible database.

---

## 🛠️ Data Persistence (Google Sheets)

Instead of a traditional SQL database, this application uses a Google Spreadsheet to store and retrieve data (such as Exhibition details and volunteer shifts). This makes it extremely easy for non-technical administrators to view or manually correct data directly in Excel/Google Sheets format.

**How it works:**
1. A **Google Cloud Service Account** acts as an invisible "bot" user.
2. The specific Google Spreadsheet ID is provided to the app via environment variables.
3. You must share your Google Sheet with the Service Account email address (give it "Editor" permissions), just like you would share a document with a human.
4. When the app needs data, it uses the Google Sheets API to read/write rows. It will automatically create required tabs (e.g., `Exhibitions`) and headers if they don't already exist!

---

## 🚀 How to Run the Application Locally

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or newer)
- A Google Cloud Project (for OAuth and Sheets API)
- A Google Spreadsheet

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment Variables
Create a file named `.env.local` in the root of the project. You will need to populate it with the following keys:

```ini
# --- NextAuth Configuration ---
# Generate a secret using: npx auth secret
AUTH_SECRET="your_generated_secret"
AUTH_URL="http://localhost:3000"

# --- Google OAuth (For Logging In) ---
AUTH_GOOGLE_ID="your_google_oauth_client_id"
AUTH_GOOGLE_SECRET="your_google_oauth_client_secret"

# Comma-separated list of emails allowed to access settings/admin areas
ALLOWED_EMAILS="email1@gmail.com,email2@gmail.com"

# --- Google Sheets API (For Database) ---
GOOGLE_SERVICE_ACCOUNT_EMAIL="your-service-account@your-project.iam.gserviceaccount.com"
# Note: The private key MUST be wrapped in quotes and contain \n characters for newlines
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY_HERE\n-----END PRIVATE KEY-----\n"
GOOGLE_SHEET_ID="your_google_spreadsheet_id"
```

### 3. Start the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌍 How to Deploy the Application

This project is optimized for deployment on **Vercel**. The deployment process is fully automated.

### Initial Setup
1. Log in to [Vercel](https://vercel.com).
2. Click **Add New** -> **Project**.
3. Connect your GitHub account and import this repository.
4. In the configuration screen, expand the **Environment Variables** section and paste in all the variables from your `.env.local` file.
5. Click **Deploy**.

### Ongoing Deployments
Because Vercel is connected to your GitHub repository, **deployments are completely automatic**. 

Whenever you push code changes to the `main` branch on GitHub (or edit a file directly on the GitHub website), Vercel will instantly detect the change, build the application, and push it live to production. 

You can track the build progress via the small colored dot (🟡/🟢/🔴) next to your commit in GitHub, or by logging into the Vercel dashboard. To help you track which version is currently live, the bottom right corner of the live website will always display the short Git Commit Hash (e.g., `rev a1b2c3d`) that corresponds to the exact code deployed!

---

## 🧪 Running Tests
The project uses Vitest for unit testing.
```bash
npm run test
```
