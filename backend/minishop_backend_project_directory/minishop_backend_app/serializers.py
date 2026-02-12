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
        image_str = obj.__dict__.get('image', '')
        
        if not image_str:
            return None
            
        if 'supabase.co/storage' in image_str:
            return image_str
        
        if image_str and not image_str.startswith('http'):
            request = self.context.get('request')
            if request and obj.image:
                return request.build_absolute_uri(obj.image.url)
            return obj.image.url if obj.image else None
            
        return image_str