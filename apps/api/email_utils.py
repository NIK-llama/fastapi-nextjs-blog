import logging
from email.message import EmailMessage
from pathlib import Path

import aiosmtplib
from config import settings
from fastapi.templating import Jinja2Templates

logger = logging.getLogger(__name__)

# Initialize templates if directory exists
templates_dir = Path("templates")
if templates_dir.exists():
    templates = Jinja2Templates(directory="templates")
else:
    templates = None


async def send_email(
    to_email: str,
    subject: str,
    plain_text: str,
    html_content: str | None = None,
) -> None:
    message = EmailMessage()
    message["From"] = settings.mail_from
    message["To"] = to_email
    message["Subject"] = subject

    message.set_content(plain_text)

    if html_content:
        message.add_alternative(html_content, subtype="html")

    try:
        await aiosmtplib.send(
            message,
            hostname=settings.mail_server,
            port=settings.mail_port,
            username=settings.mail_username if settings.mail_username else None,
            password=settings.mail_password.get_secret_value() or None,
            start_tls=settings.mail_use_tls,
        )
        logger.info(f"Email sent successfully to {to_email}")
    except Exception as exc:
        logger.error(f"Failed to send email to {to_email}: {exc}", exc_info=True)
        raise exc


async def send_password_reset_email(to_email: str, username: str, token: str) -> None:
    frontend_base = settings.frontend_url.rstrip("/")
    reset_url = f"{frontend_base}/reset-password?token={token}"

    html_content = None
    if templates and (Path("templates/email/password_reset.html").exists()):
        try:
            template = templates.env.get_template("email/password_reset.html")
            html_content = template.render(reset_url=reset_url, username=username)
        except Exception as err:
            logger.warning(f"Could not render email template: {err}")

    if not html_content:
        html_content = f"""
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>Reset Your Password</title>
</head>
<body style="font-family: sans-serif; padding: 20px; background: #f4f6f9;">
  <div style="max-width: 560px; margin: 0 auto; background: #ffffff; padding: 32px; border-radius: 12px; border: 1px solid #e1e8ed;">
    <h2>Password Reset Request</h2>
    <p>Hi <strong>{username}</strong>,</p>
    <p>You requested to reset your password for your FastAPI Blog account. Click the button below to set a new password:</p>
    <p style="text-align: center; margin: 24px 0;">
      <a href="{reset_url}" style="background-color: #2563eb; color: #ffffff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: bold; inline-block;">Reset Password</a>
    </p>
    <p>Or copy and paste this link into your browser:</p>
    <p style="word-break: break-all; color: #2563eb;"><a href="{reset_url}">{reset_url}</a></p>
    <p>This link will expire in 1 hour.</p>
  </div>
</body>
</html>"""

    plain_text = f"""Hi {username},

You requested to reset your password. Click the link below to set a new password:

{reset_url}

This link will expire in 1 hour.

If you didn't request this, you can safely ignore this email.

Best regards,
The FastAPI Blog Team
"""

    await send_email(
        to_email=to_email,
        subject="Reset Your Password - FastAPI Blog",
        plain_text=plain_text,
        html_content=html_content,
    )
