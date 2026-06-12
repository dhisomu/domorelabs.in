# Setting Up Microsoft Graph API for Email Sending

To allow your Python FastAPI application to send emails using Microsoft Graph API, you need to register an application in your Microsoft 365 / Azure environment.

Here is the step-by-step guide to generating the credentials needed for your `.env` file.

---

### Step 1: Sign in to Azure Portal
1. Go to the [Microsoft Entra admin center](https://entra.microsoft.com/) (formerly Azure Active Directory).
2. Sign in with the admin account for the Microsoft 365 tenant where the `SENDER_EMAIL` exists.

### Step 2: Register a New Application
1. In the left sidebar, go to **Identity** > **Applications** > **App registrations**.
2. Click on **New registration**.
3. **Name**: Enter a name for your app (e.g., `DoMoreLabs-Website-Mailer`).
4. **Supported account types**: Select "Accounts in this organizational directory only (Single tenant)".
5. **Redirect URI**: Leave this blank (not needed for this type of backend API).
6. Click **Register**.

### Step 3: Get your Client ID and Tenant ID
After registration, you will be on the app's Overview page.
1. Find the **Application (client) ID**. Copy this and paste it as `AZURE_CLIENT_ID` in your `.env` file.
2. Find the **Directory (tenant) ID**. Copy this and paste it as `AZURE_TENANT_ID` in your `.env` file.

### Step 4: Create a Client Secret
1. On the left menu of your app, click on **Certificates & secrets**.
2. Under the "Client secrets" tab, click **New client secret**.
3. **Description**: Give it a name (e.g., `API Secret`).
4. **Expires**: Choose an expiration period (e.g., 6 months, 12 months). *Note: You will need to generate a new secret and update your `.env` file when this expires.*
5. Click **Add**.
6. **CRITICAL:** Copy the string under the **Value** column (NOT the Secret ID). **This is your `AZURE_CLIENT_SECRET`**. Paste it securely into your `.env` file immediately, as it will be hidden once you leave the page.

### Step 5: Grant API Permissions (Mail.Send)
Because your Python server runs in the background (Daemon App) and doesn't ask a specific user to log in every time it sends a contact form email, it needs "Application Permissions".

1. On the left menu of your app, click on **API permissions**.
2. Click **Add a permission**.
3. Select **Microsoft Graph**.
4. Select **Application permissions** (NOT Delegated permissions).
5. In the search box, type `Mail.Send` and check the box next to it under the "Mail" category.
6. Click **Add permissions** at the bottom.

### Step 6: Grant Admin Consent
This is the most important step. Just adding the permission isn't enough; an admin must authorize the app to use it.
1. On the API permissions screen, you will see a button near the top that says **Grant admin consent for [Your Directory Name]**.
2. Click it. The "Status" column next to `Mail.Send` should change to a green checkmark saying "Granted".

### Step 7: Configure your .env file
Now that you have all the pieces, make sure your `.env` file inside your `domorelabs` folder looks like this:

```env
AZURE_CLIENT_ID="<The Application (client) ID you copied>"
AZURE_TENANT_ID="<The Directory (tenant) ID you copied>"
AZURE_CLIENT_SECRET="<The Client Secret Value you copied>"
SENDER_EMAIL="<The exact Microsoft 365 email you want emails to come from, e.g., info@domorewithus.com>"
```

### Important Note on Security
Giving an app `Mail.Send` application permission means this script has the power to send emails from **any** user in your Microsoft 365 organization. Ensure you never commit your `.env` file to a public repository (I have already confirmed `.env` is ignored in your `.gitignore` configuration)!
