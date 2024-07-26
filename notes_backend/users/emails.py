from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.urls import reverse
from notes.settings import settings


def send_signup_email(user) -> bool:
    path = reverse("email-verification", args=(user.token.token,))
    context = {
        "app_name": settings.APP_NAME,
        "username": user.username,
        "verification_link": f"{settings.BACKEND_HOST}{path}",
        "app_host": settings.BACKEND_HOST,
    }

    subject = f"Verify Your { settings.APP_NAME } Account"
    plain_content = render_to_string(template_name="emails/signup.txt", context=context)
    html_content = render_to_string(template_name="emails/signup.html", context=context)

    message = EmailMultiAlternatives(
        subject=subject,
        body=plain_content,
        from_email="noreply@notes.tech",
        to=[user.email],
    )
    message.attach_alternative(content=html_content, mimetype="text/html")

    # send return 1 on success and 0 on failure. Convert to boolean so caller can resend if needed.
    return bool(message.send(fail_silently=True))
