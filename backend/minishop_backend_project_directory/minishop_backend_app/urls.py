from django.urls import path

from . import views
from .image_proxy_view import image_proxy

urlpatterns = [
    path("", views.index, name="index"),
    path("<int:product_id>/", views.product_detail, name="detail"),
    path("products/", views.ProductListCreateAPIView.as_view(), name="product-list-create"),
    path("profile/", views.ProfileAPIView.as_view(), name="get-profile-info-view"),  # ← Removed "api/"
    path("create-checkout-session/", views.create_checkout_session, name="create_checkout_session"),  # ← Removed "api/"
    path("daily-product/", views.DailyRandomProductAPIView.as_view(), name="daily-random-product"),  # ← Removed "api/"
    path("images/<path:image_path>", image_proxy, name="image-proxy"),
]