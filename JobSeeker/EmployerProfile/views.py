from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .serializers import EmployerPreRegisterSerializer
from django.contrib.auth.hashers import make_password

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


#register employerprofile
@api_view(["POST"])
def register_employer_api(request, role):
    serializer = EmployerRegisterSerializer(data=request.data)
    if serializer.is_valid():
        profile_data = serializer.validated_data["profile"]

        # email & password from session (pre-register step)
        email = request.session.get("user_email")
        raw_password = request.session.get("user_password")
        if not email or not raw_password:
            return Response({"error": "Session expired. Please pre-register again."},
                            status=status.HTTP_400_BAD_REQUEST)
        username = email.split("@")[0]
        # create user
        user = User.objects.create(
            email=email,
            username=username,
            role=role,
            password=make_password(raw_password),
            is_active=False,
            is_verified=False
        )
        user.set_password(raw_password)   # <-- correct way
        user.save()
        # create employer profile
        EmployerProfile.objects.create(user=user, **profile_data)
        login(request, user)
        # send verification email
        send_verification_email(request, user)
        request.session["pending_activation"] = True
        return Response(
            {
                "message": "Employer registered successfully. Verification email sent.",
                "user": {"id": str(user.id), "email": user.email, "role": user.role}
            },
            status=status.HTTP_201_CREATED
        )

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
#end register employerprofile

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

    if user is not None and default_token_generator.check_token(user, token):
        if not user.is_active:
            user.is_active = True
            user.is_verified=True
            user.save()

        return Response(
            {"message": "Your email has been verified successfully! You can create job now"},
            status=status.HTTP_200_OK
        )
    else:
        return Response(
            {"error": "Verification link is invalid or expired."},
            status=status.HTTP_400_BAD_REQUEST
        )
#end email verify
