from django.shortcuts import render
from django.http import HttpResponse
from rest_framework import status
from rest_framework.pagination import PageNumberPagination
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import Product
from .serializers import ProductSerializer

# Add these imports for Stripe
import stripe
import json
import random
from datetime import date
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.db import connection

# Set your Stripe secret key from Django settings
stripe.api_key = settings.STRIPE_SECRET_KEY

# Debug: Print the key to verify it's loaded (remove this in production)
print(f"Stripe key loaded: {settings.STRIPE_SECRET_KEY[:12]}..." if settings.STRIPE_SECRET_KEY else "No Stripe key found!")

def index(request):
    return HttpResponse("Hello, world. You're at the minishop_backend_project_settings index.")
def product_detail(request, product_id):
    return HttpResponse("You're looking at product %s." % product_id)

class ProductListCreateAPIView(APIView):
    def get_permissions(self):
        if self.request.method == 'GET':
            return [AllowAny()]
        return [IsAuthenticated()]
    def get(self, request):
        paginator = PageNumberPagination()
        paginator.page_size = 15  
        products = Product.objects.all()
        result_page = paginator.paginate_queryset(products, request)
        serializer = ProductSerializer(result_page, many=True)
        return paginator.get_paginated_response(serializer.data)
    def post(self, request):
        serializer = ProductSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ProfileAPIView(APIView):
    def get(self, request):
        user = request.user
        if user.is_authenticated:
            auth_header = request.META.get('HTTP_AUTHORIZATION', None)
            if auth_header and auth_header.startswith('Bearer '):
                import jwt
                token = auth_header.split(' ')[1]
                try:
                    claims = jwt.decode(token, options={"verify_signature": False, "verify_aud": False})
                    updated = False
                    if 'email' in claims and user.email != claims['email']:
                        user.email = claims['email']
                        updated = True
                    if 'given_name' in claims and user.first_name != claims['given_name']:
                        user.first_name = claims['given_name']
                        updated = True
                    if 'family_name' in claims and user.last_name != claims['family_name']:
                        user.last_name = claims['family_name']
                        updated = True
                    if updated:
                        user.save()
                except Exception:
                    pass
            data = {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "first_name": user.first_name,
                "last_name": user.last_name,
            }
            return Response(data, status=status.HTTP_200_OK)
        else:
            return Response({"detail": "Authentication credentials were not provided."}, status=status.HTTP_401_UNAUTHORIZED)

class DailyRandomProductAPIView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request):
        try:
            products = Product.objects.all()
            if not products.exists():
                return Response({"detail": "No products available"}, status=status.HTTP_404_NOT_FOUND)
            
            # Use today's date as seed for consistent daily randomness
            today = date.today()
            seed_value = int(today.strftime('%Y%m%d'))
            random.seed(seed_value)
            
            # Get random product
            product_count = products.count()
            random_index = random.randint(0, product_count - 1)
            daily_product = products[random_index]
            
            serializer = ProductSerializer(daily_product)
            return Response(serializer.data, status=status.HTTP_200_OK)
            
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        finally:
            # Close the connection explicitly
            connection.close()

# Add this new Stripe checkout view
@csrf_exempt
@require_http_methods(["POST"])
def create_checkout_session(request):
    try:
        # Debug: Check if Stripe key is available
        if not settings.STRIPE_SECRET_KEY:
            return JsonResponse({'error': 'Stripe secret key not configured'}, status=500)
            
        print(f"Using Stripe key: {settings.STRIPE_SECRET_KEY[:12]}...")  # Debug log
        
        data = json.loads(request.body)
        items = data.get('items', [])
        
        print(f"Received items: {items}")  # Debug log
        
        # Create line items for Stripe
        line_items = []
        for item in items:
            # Build product_data dynamically to avoid empty strings
            product_data = {
                'name': item['name'],
            }
            
            # Only add description if it's not empty
            description = item.get('description', '').strip()
            if description:
                product_data['description'] = description
            
            # Only add images if they exist and are not empty
            image = item.get('image', '').strip()
            if image:
                product_data['images'] = [image]
            
            line_items.append({
                'price_data': {
                    'currency': 'usd',
                    'product_data': product_data,
                    'unit_amount': int(float(item['price']) * 100),  # Convert to cents
                },
                'quantity': item['quantity'],
            })
        
        print(f"Created line items: {line_items}")  # Debug log
        
        # Create Stripe checkout session
        checkout_session = stripe.checkout.Session.create(
            payment_method_types=['card'],
            line_items=line_items,
            mode='payment',
            success_url='http://localhost:5173/success?session_id={CHECKOUT_SESSION_ID}',
            cancel_url='http://localhost:5173/cart',
        )
        
        print(f"Created session: {checkout_session.id}")  # Debug log
        print(f"Checkout URL: {checkout_session.url}")  # Debug log
        
        # Return both the session ID and the checkout URL
        return JsonResponse({
            'id': checkout_session.id,
            'url': checkout_session.url
        })
        
    except Exception as e:
        print(f"Error creating checkout session: {str(e)}")  # Debug log
        return JsonResponse({'error': str(e)}, status=400)