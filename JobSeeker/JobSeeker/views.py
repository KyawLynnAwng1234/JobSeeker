# Create your views here.
from rest_framework.decorators import api_view,permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from django.db import IntegrityError
from django.contrib.auth import get_user_model
from django.utils.crypto import get_random_string
from Jobseekerprofile.forms import jobseekerRegisterForm,jobseekerSiginForm
from Jobseekerprofile.utils import send_verification_code
from rest_framework.response import Response
from django.contrib.auth import get_user_model,login,logout



User = get_user_model()

#job-seeker-register
@api_view(['POST'])
def register_jobseeker_api(request,role):
    form = jobseekerRegisterForm(request.data)                                                                                                                                                 
    if form.is_valid():
        email = form.cleaned_data['email']
        code = send_verification_code(email)
        request.session['verification_code'] = code
        request.session['email'] = email
        username = email.split('@')[0]
        random_password = get_random_string(length=6)
        
        if not username:
            return Response({"error": "Please enter your email"},status=status.HTTP_400_BAD_REQUEST)

        try:
            user = User.objects.create_user(
                username=username,
                password=random_password,
                email=email,
                role=role,
                is_active=False
            )
            request.session['user_id'] = user.id
            return Response({"message": "User created successfully. Please verify your email."}, status=status.HTTP_201_CREATED)
        except IntegrityError as e:
            if "Duplicate entry" in str(e):
                return Response({"error": "Email or username already exists."}, status=status.HTTP_400_BAD_REQUEST)
            else:
                return Response({"error": "An unexpected error occurred."}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return Response(form.errors, status=status.HTTP_400_BAD_REQUEST)
#end job-seeker-register

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
# end job-seeker-register

#job-seeker-sigin

@api_view(['POST'])
def sigin_jobseeker_api(request, role):
    form = jobseekerSiginForm(request.data)  # request.data for DRF
    if form.is_valid():
        email = form.cleaned_data['email']
        print(email)
        if not email:
            return Response(
                {"error": "Please enter your email."},
                status=status.HTTP_400_BAD_REQUEST
            )

        username = email.split('@')[0]
        
        try:
            user = User.objects.get(email=email)
            if not user.is_active:
                return Response(
                    {"error": "Your account is not active. Please register first."},
                    status=status.HTTP_403_FORBIDDEN
                )

            # Generate verification code & send
            code = send_verification_code(email)
            request.session['verification_code'] = code
            request.session['email'] = email
            request.session['user_id'] = user.id

            return Response(
                {"message": f"Verification code sent to {email}"},
                status=status.HTTP_200_OK
            )

        except User.DoesNotExist:
            return Response(
                {"error": "This email is not registered. Please register first."},
                status=status.HTTP_404_NOT_FOUND
            )

    return Response(
        {"error": form.errors},
        status=status.HTTP_400_BAD_REQUEST
    )
#job-seeker-register




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


