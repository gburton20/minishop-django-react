from rest_framework import serializers
from .models import Product
import re

class ProductSerializer(serializers.ModelSerializer):
    image = serializers.SerializerMethodField()
    
    class Meta:
        model = Product
        fields = '__all__'
    
    def get_image(self, obj):
        """Return image URLs - Supabase URLs directly for speed"""
        # Access the raw database value, not the ImageField's processed value
        image_str = obj.__dict__.get('image', '')
        
        if not image_str:
            return None
            
        # If it's a Supabase URL, return it directly (public bucket, should work)
        if 'supabase.co/storage' in image_str:
            return image_str
        
        # For local media files, use Django's ImageField behavior
        if image_str and not image_str.startswith('http'):
            request = self.context.get('request')
            if request and obj.image:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url if obj.image else None
            
        return image_str