import datetime

from django.db import models
from django.utils import timezone

# Product model
class Product(models.Model):
    # Core identifying fields
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    
    # Descriptive fields
    description = models.TextField(blank=True, null=True)
    brand = models.CharField(max_length=100, blank=True, null=True)
    
    # Pricing fields
    price = models.DecimalField(max_digits=10, decimal_places=2)
    discount_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)  # NEW
    
    # Product metadata
    rating = models.DecimalField(max_digits=3, decimal_places=2, blank=True, null=True)
    availability_status = models.CharField(max_length=50, default='In Stock')
    
    # Media
    image = models.URLField(blank=True, null=True)
    
    # System/auto fields
    created_at = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey('auth.User', on_delete=models.CASCADE, related_name='products', null=True, blank=True)
    
    def __str__(self):
        return self.name
    def was_added_recently(self):
        return self.created_at >= timezone.now() - datetime.timedelta(days=1)
    
    class Meta:
        ordering = ['id']