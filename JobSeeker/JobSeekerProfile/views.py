# Create your views here.
from rest_framework.decorators import api_view,permission_classes, throttle_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.permissions import AllowAny
from rest_framework.throttling import ScopedRateThrottle
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError
from django.contrib.auth import get_user_model
from django.utils.crypto import get_random_string
from .serializers import *
from .utils import send_verification_code
from django.contrib.auth import get_user_model,login,logout
from Accounts.models import CustomUser
User = get_user_model()
from django.views.decorators.csrf import csrf_exempt
from django_ratelimit.decorators import ratelimit




@api_view(['POST'])
@permission_classes([AllowAny])
def signin_jobseeker_api(request, role):
    serializer = JobSeekerSignInSerializer(data=request.data)
    if not serializer.is_valid():
        # ✅ Always return when invalid
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    email = serializer.validated_data.get('email')
    if not email:
        return Response({"error": "Please enter your email."},
                        status=status.HTTP_400_BAD_REQUEST)

    # ✅ Create or get the user
    user, created = CustomUser.objects.get_or_create(
        email=email.lower(),
        defaults={
            "role": role,
            "is_active": True,  
            
        }
    )
    response_data = JobSeekerSignInSerializer(user).data
    

    if not user.is_active:
        return Response({"error": "Your account is not active. Please contact support."},
                        status=status.HTTP_403_FORBIDDEN)

    # ✅ Generate + send code (wrap to avoid NoneType due to exceptions)
    try:
        code = send_verification_code(email)   # <-- your function
    except Exception:
        return Response({"error": "Failed to send verification code."},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # ✅ Save to session
    request.session['verification_code'] = code
    request.session['email'] = email
    request.session['user_id'] = str(user.id)

    msg = ("Account created and verification code sent to "
           if created else "Verification code sent to ") + email

    return Response(
        {"message": msg, "user": {"id": str(user.id), "email": user.email, "role": user.role,"username": user.email.split('@')[0]}},
        status=status.HTTP_200_OK
    )
# job-seeker-signin-end

#job-seeker-email-verify 
@api_view(['POST'])
@ratelimit(key='ip', rate='5/m', block=True)
def otp_verify_jobseeker_api(request):
    input_code = request.data.get('code')
    code = request.session.get('verification_code')
    user_id = request.session.get('user_id')

    if input_code ==code and user_id:
        try:
            user = User.objects.get(id=user_id)
            user.is_verified=True
            user.save(update_fields=['is_verified'])
            # Set backend for login
            login(request, user, backend='django.contrib.auth.backends.ModelBackend')
            request.session.pop('verification_code', None)
            request.session.pop('user_id', None)
            request.session.modified = True
            return Response(
                {
                    "message": "Email verified successfully!",
                    "session_key": request.session.session_key,
                    
                    },
                status=status.HTTP_200_OK
            )
        except User.DoesNotExist:
            return Response(
                {"error": "User not found."},
                status=status.HTTP_404_NOT_FOUND
            )
    else:
        return Response(
            {"error": "Invalid verification code."},
            status=status.HTTP_400_BAD_REQUEST
        )
# end job-seeker-email-verify

@api_view(['POST'])
@permission_classes([AllowAny])
@throttle_classes([ScopedRateThrottle])   # use the scoped rate above
def otp_resend_jobseeker_api(request):
    """
    Resend the email verification code for jobseeker login.
    Priority for email source:
      1) session['email'] (from signin)
      2) request.data['email'] (fallback)
    Regenerates a code, overwrites session, and sends email again.
    """
    # 1) resolve email
    email = (request.session.get('email') or request.data.get('email') or "").strip().lower()
    if not email:
        return Response({"error": "Email required."}, status=status.HTTP_400_BAD_REQUEST)

    # 2) make sure user exists (you’re using CustomUser)
    try:
        user = CustomUser.objects.get(email__iexact=email)
    except CustomUser.DoesNotExist:
        # privacy-preserving: don't reveal account existence
        return Response({"message": "If your account exists, a code has been sent."},
                        status=status.HTTP_200_OK)

    # 3) (re)generate + send code
    try:
        code = send_verification_code(email)   # your existing util
    except Exception:
        return Response({"error": "Failed to send verification code."},
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # 4) refresh session values
    request.session['verification_code'] = code
    request.session['email'] = email
    request.session['user_id'] = str(user.id)

    # 5) (optional) print for quick manual testing
    print("➡️ Resent jobseeker code:", {"email": email, "code": code, "user_id": str(user.id)})

    return Response(
        {"message": "Verification code resent.", "cooldown_seconds": 60},
        status=status.HTTP_200_OK
    )

# attach the throttle scope name so DRF uses "jobseeker_resend" rate
otp_resend_jobseeker_api.throttle_scope = "jobseeker_resend"


@api_view(['POST'])
def sigout_jobseeker_api(request):
    logout(request)
    return Response({"message": "Logged out successfully"},status=status.HTTP_200_OK)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_jobseeker_api(request):
    user=request.user
    return Response({
        "username":user.username,
        "email":user.email,
    })
    
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    u = request.user
    return Response({
        "id": str(u.id),
        "email": u.email,
        "role": getattr(u, "role", None),
        "is_verified": getattr(u, "is_verified", False),
        "username": u.email.split("@")[0] if u.email else None,
    })

