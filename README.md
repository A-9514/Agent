# OnboardFlow - AI-Powered Onboarding Assistant

## 1. Overview
OnboardFlow is an intelligent agent designed to streamline the employee onboarding process. By leveraging Google's Gemini AI, it automatically generates personalized onboarding content—such as welcome emails, role-specific checklists, and culture guides—helping HR teams and managers create a warm and organized experience for new hires.

## 2. Features & Limitations
**Features:**
* **AI Content Generation:** Creates welcome emails, checklists, and guides instantly.
* **Tone Customization:** Adjusts the output to match professional, casual, or enthusiastic corporate vibes.
* **Real-time Interaction:** Users receive immediate feedback and content from the AI agent.
* **Responsive Design:** Works seamlessly on desktop and mobile browsers.

**Limitations:**
* Currently relies on the free tier of Gemini API (rate limits may apply).
* Does not permanently save data to a database (session-based only).

## 3. Tech Stack & APIs Used
* **Frontend:** React, TypeScript, Vite
* **Styling:** CSS / Tailwind (if applicable)
* **AI Model:** Google Gemini API (`@google/genai`)
* **Deployment:** Vercel
* **Version Control:** Git & GitHub

## 4. Setup & Run Instructions (Locally)
To run this project on your local machine:

1.  **Clone the repository:**
    ```bash
    git clone [https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git](https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git)
    cd YOUR-REPO-NAME
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure Environment Variables:**
    * Create a `.env.local` file in the root directory.
    * Add your Google Gemini API key:
        ```
        VITE_GEMINI_API_KEY=your_api_key_here
        ```

4.  **Run the development server:**
    ```bash
    npm run dev
    ```
5.  Open your browser and navigate to `http://localhost:5173`.

## 5. Potential Improvements
* **Database Integration:** Connect to Firebase or Supabase to save onboarding templates.
* **PDF Export:** Allow users to download the generated checklists as PDF files.
* **Slack Integration:** Send the welcome messages directly to company Slack channels.
