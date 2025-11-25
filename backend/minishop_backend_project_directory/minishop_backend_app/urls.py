from django.urls import path

from . import views

urlpatterns = [
    path("", views.index, name="index"),
    path("<int:product_id>/", views.product_detail, name="detail"),
    path("products/", views.ProductListCreateAPIView.as_view(), name="product-list-create"),
    path("api/profile/", views.ProfileAPIView.as_view(), name="get-profile-info-view"),
    path("api/create-checkout-session/", views.create_checkout_session, name="create_checkout_session"),
    path("api/daily-product/", views.DailyRandomProductAPIView.as_view(), name="daily-random-product"),  # Add this line
]