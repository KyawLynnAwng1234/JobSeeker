from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
from rest_framework import status
from .serializers import EmployerPreRegisterSerializer
from django.contrib.auth.hashers import make_password
from django.shortcuts import redirect

from django.contrib.auth import get_user_model

from .models import EmployerProfile
from .serializers import EmployerRegisterSerializer, EmployerPreRegisterSerializer
from .utils import send_verification_email
from django.utils.http import urlsafe_base64_decode
from django.contrib.auth.tokens import default_token_generator
from django.contrib.auth import login,authenticate

User = get_user_model()

# Pre-register employer (collect email & password)
@api_view(['POST'])
def preregister_employer_api(request):
    serializer = EmployerPreRegisterSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        # Save temporarily in session (like original code)
        request.session['user_email'] = email
        request.session['user_password'] = password

        # Instead of redirect, return JSON response
        return Response(
            {
                "message": "Pre-registration successful",
                "next": "registeremployerpage",# frontend can redirect
                "role": "employer",
                "email": email
            },
            status=status.HTTP_200_OK
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# Complete registration (collect profile info)


# register employerprofile
@api_view(["POST"])
def register_employer_api(request, role):
    serializer = EmployerRegisterSerializer(data=request.data)
    if serializer.is_valid():
        profile_data = serializer.validated_data["profile"]

        # email & password from session (pre-register step)
        email = request.session.get("user_email")
        raw_password = request.session.get("user_password")
        if not email or not raw_password:
            return Response(
                {"error": "Session expired. Please pre-register again."},
                status=status.HTTP_400_BAD_REQUEST
            )

        username = email.split("@")[0]

        # create user
        user = User.objects.create(
            email=email,
            role=role,
            password=make_password(raw_password),
            is_active=False,
            is_verified=False
        )
        user.set_password(raw_password)   # <-- correct way
        user.save()

        # create employer profile
        employer_profile = EmployerProfile.objects.create(user=user, **profile_data)

        # log them in (session)
        login(request, user)

        # send verification email
        send_verification_email(request, user)
        request.session["pending_activation"] = True

        # prepare response data
        response_data = {
           
          
            "profile": {
                "message": "Employer registered successfully. Verification email sent.",
                "id": str(employer_profile.id),
                "first_name": employer_profile.first_name,
                "last_name": employer_profile.last_name,
                "business_name": employer_profile.business_name,
                "city": employer_profile.city,

                # add other fields you need to expose
            }
        }

        # ✅ print for debugging (will show in Django runserver console)
        print("➡️ Employer registration response:", response_data)

        return Response(response_data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# end register employerprofile


#sign in employer
@api_view(["POST"])
def login_api(request):
    email = request.data.get("email")
    password = request.data.get("password")

    user = authenticate(request, email=email, password=password)
    if user is not None:
        if not user.is_verified:   # check your custom flag
            return Response({"detail": "Please verify your email first."}, status=status.HTTP_403_FORBIDDEN)

        login(request, user)  # ✅ sets sessionid cookie
        return Response({"detail": "Login successful"}, status=status.HTTP_200_OK)

    return Response({"detail": "Invalid credentials"}, status=status.HTTP_400_BAD_REQUEST)
#end sign in employer


# employer Email verification
@api_view(["GET"])
def emailverify_employer_api(request, uidb64, token):
    try:
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
    except (User.DoesNotExist, ValueError, TypeError, OverflowError):
        user = None

    if user is not None and default_token_generator.check_token(user,token):
        if not user.is_active:
            user.is_active = True
            user.is_verified=True
            user.save()
        return redirect("/employer/dashboard")

        
        
    else:
        return Response(
            {"error": "Verification link is invalid or expired."},
            status=status.HTTP_400_BAD_REQUEST
        )
#end email verify

#resend verification email
@api_view(["POST"])
@permission_classes([AllowAny])  # not logged in — fine
def resend_verification_api(request):
    """
    Resend verification email.
    Priority:
      1) email from session (pre-register stored it as 'user_email')
      2) email from POST body
    """
    # 1) get email from session first
    email = (request.session.get("user_email") or "").strip()

    # 2) if no session email, accept from POST body
    if not email:
        email = (request.data.get("email") or "").strip()

    if not email:
        return Response({"detail": "Email required."}, status=status.HTTP_400_BAD_REQUEST)

    # 3) look up user case-insensitively
    try:
        user = User.objects.get(email__iexact=email)
    except User.DoesNotExist:
        # don’t reveal whether an email exists
        return Response({"detail": "If your account exists, we sent a verification email."}, status=200)

    # 4) already verified?
    if getattr(user, "is_verified", False):
        return Response({"detail": "Your email is already verified."}, status=200)

    # 5) send email
    send_verification_email(request, user)

    # optional: flag to show UI hints
    request.session["pending_activation"] = True

    return Response({"detail": "Verification email sent."}, status=200)
#end resend email verification link

