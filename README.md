# DoMoreLabs Platform

DoMoreLabs is a platform designed to bridge the gap between theoretical knowledge and practical application, empowering institutions, faculty, and students with hands-on industry projects.

This project is built using a lightweight **Python FastAPI** backend serving a highly optimized **Vanilla HTML/CSS/JS** frontend. The platform integrates with the **Microsoft Graph API** to seamlessly handle email communications securely.

---

## 🏗️ Architecture Stack

*   **Frontend:** Vanilla HTML5, Tailwind CSS (via CDN), Vanilla JavaScript, Lucide Icons.
*   **Backend:** Python 3.13+, FastAPI, Uvicorn (ASGI server).
*   **Email Service:** Microsoft Graph API (via `msgraph-sdk` and `azure-identity`).

---

## 📁 Project Structure

```text
domorelabs/
├── backend/                  # (If applicable, future API routes)
├── frontend/                 # (If applicable, future UI components)
├── backup_pages/             # Archives of additional HTML pages (Dashboard, Admin, etc.)
├── assets/                   # Images, logos, and static media
├── css/                      # Custom stylesheets
├── js/                       # Vanilla JavaScript files (e.g., main.js for UI interactivity and AJAX)
├── .venv/                    # Python virtual environment
├── .env                      # Environment variables for Azure AD credentials (Not in version control)
├── requirements.txt          # Python dependencies (fastapi, uvicorn, msgraph-sdk)
├── main.py                   # FastAPI backend application & routing logic
└── index.html                # Main landing page for DoMoreLabs
```

---

## 🚀 Setup & Installation

### 1. Prerequisites
*   **Python 3.10 or higher** installed on your system.
*   An active **Microsoft Azure Account** with a registered application in Microsoft Entra ID (for email functionality).

### 2. Configure the Environment
Clone the repository, then create and activate a Python virtual environment:

```bash
# Windows
python -m venv .venv
.\.venv\Scripts\activate

# macOS/Linux
python3 -m venv .venv
source .venv/bin/activate
```

### 3. Install Dependencies
Install the required Python packages using pip:

```bash
pip install -r requirements.txt
```

### 4. Configure Microsoft Graph API (Email Setup)
Create a `.env` file in the root directory (alongside `main.py`) with the following variables. You must obtain these credentials from your Microsoft Azure App Registration.

```env
# Azure AD Application Credentials
AZURE_CLIENT_ID="your_application_client_id_here"
AZURE_TENANT_ID="your_directory_tenant_id_here"
AZURE_CLIENT_SECRET="your_client_secret_value_here"

# Sender Email (The Microsoft 365 account that will send the emails)
SENDER_EMAIL="info@domorewithus.com"
```

*Note: The Azure App Registration MUST have the `Mail.Send` **Application Permission** granted and consented to by an admin.*

### 5. Running the Application locally
Start the FastAPI server using Uvicorn:

```bash
python -m uvicorn main:app --reload
```

The application will be available at: **http://127.0.0.1:8000**
The interactive API documentation will be at: **http://127.0.0.1:8000/docs**

---

## 🌐 API Endpoints

### `POST /api/contact`
Receives data from the frontend contact form and sends an email via Microsoft Graph API.

**Request Body (JSON):**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "subject": "Partnership Inquiry",
  "message": "We are interested in collaborating with DoMoreLabs..."
}
```

**Response (200 OK):**
```json
{
  "message": "Email sent successfully"
}
```

**Error Handling:**
Returns standard HTTP status codes (e.g., `500 Internal Server Error`) if the email fails to send due to missing credentials, invalid permissions, or networking issues.

---

## 💻 Frontend Adjustments
*   **Tailwind:** The project currently uses Tailwind CSS via CDN (`<script src="https://cdn.tailwindcss.com"></script>`). This is highly effective for development and small projects but should be compiled for heavy production usage if the platform grows.
*   **Styling:** Custom CSS exists in `css/styles.css` for utilities not covered by Tailwind or requiring specific keyframe animations.
*   **Javascript:** All interactivity, such as the mobile menu toggle, smooth scrolling, and the AJAX fetch request handling the contact form, happens inside `js/main.js`. No React or Node.js build steps are required.
