# Create your views here.
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
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


#job-seeker-sigin
@csrf_exempt
@api_view(['POST'])
def signin_jobseeker_api(request, role):
    serializer = JobSeekerSignInSerializer(data=request.data)
    if serializer.is_valid():
        email = serializer.validated_data['email']

        if not email:
            return Response(
                {"error": "Please enter your email."},
                status=status.HTTP_400_BAD_REQUEST
            )

        username = email.split('@')[0]

        # ✅ get_or_create သုံးပြီး တူညီတဲ့ email ရှိမရှိစစ်
        user, created = CustomUser.objects.get_or_create(
            email=email,
            defaults={
                "role": role,           # parameter ထဲက role ကိုသုံး
                "is_active": True
            }
        )

        # inactive ဆိုရင် error ပြ
        if not user.is_active:
            return Response(
                {"error": "Your account is not active. Please contact support."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Verification code generate & send
        code = send_verification_code(email)
        request.session['verification_code'] = code
        request.session['email'] = email
        request.session['user_id'] = str(user.id)

        if created:
            msg = f"Account created and verification code sent to {email}"
        else:
            msg = f"Verification code sent to {email}"

        return Response(
            {"message": msg, "user": {"id": str(user.id), "email": user.email, "role": user.role}},
            status=status.HTTP_200_OK
        )

#job-seeker-sigin-end

#job-seeker-email-verify 
@api_view(['POST'])
def email_verify_jobseeker_api(request):
    input_code = request.data.get('code')
    code = request.session.get('verification_code')
 
    user_id = request.session.get('user_id')
    print(input_code)
    print(code)
    if input_code ==code and user_id:
        try:
            user = User.objects.get(id=user_id)
            user.is_active = True
            user.save()

            # Set backend for login
            user.backend = 'django.contrib.auth.backends.ModelBackend'
            login(request, user)

            return Response(
                {"message": "Email verified successfully!"},
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
def current_user(request):
    if request.user.is_authenticated:
        return Response({
            "username": request.user.username,
            "email": request.user.email,
        })
    return Response({"username": None, "email": None})