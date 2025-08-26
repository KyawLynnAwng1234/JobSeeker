
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode
from django.utils.encoding import force_bytes
from django.urls import reverse
from django.core.mail import send_mail
from email.utils import formataddr

def send_verification_email(request, user):
    uid = urlsafe_base64_encode(force_bytes(user.pk))
    token = default_token_generator.make_token(user)
    verification_url = request.build_absolute_uri(
        reverse('employer-emailverifypage',kwargs={'uidb64': uid, 'token': token})
    )
    subject = "Verify your employer account"
    message = f""" Hi {user.email},
    Thanks for registering at JobStreet.
    Please verify your account by clicking the link below:
    {verification_url}
    If you didn't register, you can ignore this message.– JobStreet Team"""
    from_email = formataddr(("JobSeeker", "no-reply@yourdomain.com"))
    send_mail(subject, message, from_email, [user.email])