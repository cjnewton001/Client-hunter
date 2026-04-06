# Client Hunter 🎯

Client Hunter is a modern, AI-powered CRM designed for high-performance sales teams and individual entrepreneurs. It streamlines the process of discovering, tracking, and closing business leads with a focus on speed, intelligence, and beautiful design.

![Client Hunter Preview](https://picsum.photos/seed/crm/1200/600)

## ✨ Features

- **AI-Powered Lead Scoring**: Automatically analyze business potential using Gemini AI.
- **Strategic Outreach**: Generate personalized email templates and outreach strategies.
- **Sales Funnel Analytics**: Visualize your pipeline from discovery to closed deals.
- **Activity Timeline**: Log every interaction (calls, emails, meetings) with your clients.
- **Smart Reminders**: Never miss a follow-up with automated overdue alerts.
- **Data Portability**: Export your entire client list to CSV with one click.
- **Light & Dark Mode**: A beautiful, "intriguing" dark mode for late-night hunting.
- **Responsive Design**: Fully optimized for desktop and mobile workflows.

## 🚀 Tech Stack

- **Frontend**: React 18, Vite, TypeScript
- **Styling**: Tailwind CSS 4
- **Animations**: Motion (Framer Motion)
- **Icons**: Lucide React
- **Backend/Database**: Firebase (Firestore, Authentication)
- **AI Engine**: Google Gemini API (@google/genai)

## 🛠️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- A Firebase project
- A Google Gemini API key

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/client-hunter.git
   cd client-hunter
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Environment Setup**:
   Create a `.env` file in the root directory and add your credentials:
   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   GEMINI_API_KEY=your_gemini_api_key
   ```

4. **Run the development server**:
   ```bash
   npm run dev
   ```

5. **Build for production**:
   ```bash
   npm run build
   ```

## 📂 Project Structure

```text
src/
├── components/        # Reusable UI components
│   ├── ui/           # Base UI elements
│   ├── BusinessCard  # Lead display card
│   ├── Dashboard     # Main CRM interface
│   ├── Hero          # Landing page section
│   └── Navbar        # Global navigation
├── firebase.ts        # Firebase configuration & helpers
├── types.ts           # TypeScript interfaces
└── App.tsx            # Main application entry
```

## 🛡️ Security Rules

The project uses Firestore Security Rules to ensure data privacy. Each user can only access and modify their own leads.

```javascript
match /businesses/{businessId} {
  allow read, write: if request.auth != null && request.auth.uid == resource.data.ownerUid;
}
```

## 📄 License

This project is licensed under the Apache-2.0 License.

---

Built with ❤️ by [Your Name/Team]
