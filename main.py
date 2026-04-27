from fastapi import FastAPI, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from azure.identity import ClientSecretCredential
from msgraph import GraphServiceClient
from msgraph.generated.users.item.send_mail.send_mail_post_request_body import SendMailPostRequestBody
from msgraph.generated.models.message import Message
from msgraph.generated.models.item_body import ItemBody
from msgraph.generated.models.body_type import BodyType
from msgraph.generated.models.recipient import Recipient
from msgraph.generated.models.email_address import EmailAddress

load_dotenv()

app = FastAPI()

# Azure AD Credentials from .env
CLIENT_ID = os.getenv("AZURE_CLIENT_ID")
TENANT_ID = os.getenv("AZURE_TENANT_ID")
CLIENT_SECRET = os.getenv("AZURE_CLIENT_SECRET")
SENDER_EMAIL = os.getenv("SENDER_EMAIL") # The email address in your tenant sending the mail

# Initialize Graph Client if credentials exist
graph_client = None
if CLIENT_ID and TENANT_ID and CLIENT_SECRET:
    try:
        credential = ClientSecretCredential(
            tenant_id=TENANT_ID,
            client_id=CLIENT_ID,
            client_secret=CLIENT_SECRET
        )
        scopes = ['https://graph.microsoft.com/.default']
        graph_client = GraphServiceClient(credentials=credential, scopes=scopes)
        print("Microsoft Graph Client initialized successfully.")
    except Exception as e:
        print(f"Error initializing Graph API: {e}")
else:
    print("Warning: Missing Azure AD credentials in .env file. Email functionality will not work.")

# Pydantic model for contact form data
class ContactForm(BaseModel):
    name: str
    email: str
    subject: str
    message: str

# API Endpoint to handle contact form submission
@app.post("/api/contact")
async def send_contact_email(form_data: ContactForm):
    if not graph_client or not SENDER_EMAIL:
        raise HTTPException(status_code=500, detail="Email service is not configured properly on the server.")
    
    try:
        # Build the email content
        html_content = f"""
        <html>
            <body>
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> {form_data.name}</p>
                <p><strong>Email:</strong> {form_data.email}</p>
                <p><strong>Subject:</strong> {form_data.subject}</p>
                <br>
                <p><strong>Message:</strong></p>
                <p>{form_data.message.replace(chr(10), '<br>')}</p>
            </body>
        </html>
        """

        message = Message(
            subject=f"DoMoreLabs Contact Form: {form_data.subject}",
            body=ItemBody(
                content_type=BodyType.Html,
                content=html_content
            ),
            to_recipients=[
                Recipient(
                    email_address=EmailAddress(
                        address=SENDER_EMAIL # Sending to ourselves as a notification
                    )
                )
            ],
            reply_to=[
                Recipient(
                    email_address=EmailAddress(
                        address=form_data.email # Reply directly to the person who filled the form
                    )
                )
            ]
        )

        request_body = SendMailPostRequestBody(
            message=message,
            save_to_sent_items=False
        )

        # Send the mail as the SENDER_EMAIL user
        await graph_client.users.by_user_id(SENDER_EMAIL).send_mail.post(request_body)

        return {"message": "Email sent successfully"}

    except Exception as e:
        print(f"Failed to send email: {str(e)}")
        raise HTTPException(status_code=500, detail="Failed to send email. Please try again later.")

# Mount the static files (css, js, assets, etc.)
app.mount("/css", StaticFiles(directory="css"), name="css")
app.mount("/js", StaticFiles(directory="js"), name="js")
app.mount("/assets", StaticFiles(directory="assets"), name="assets")

# Serve specific HTML pages
@app.get("/")
async def root():
    return FileResponse("index.html")

@app.get("/{filename}.html")
async def get_html_page(filename: str):
    file_path = f"{filename}.html"
    if os.path.exists(file_path):
        return FileResponse(file_path)
    return FileResponse("index.html") # or 404

# Catch-all to serve index.html for SPA-like navigation, or just standard routing
@app.get("/{full_path:path}")
async def catch_all(full_path: str):
    # Attempt to serve if it directly matches an html file
    if os.path.exists(full_path):
        return FileResponse(full_path)
    # Default fallback
    return FileResponse("index.html")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
