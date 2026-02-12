from django.http import HttpResponse
import requests

def image_proxy(request, image_path):
    """
    Proxy images from Supabase Storage to avoid CORS issues.
    Fetches the image from Supabase and serves it through Django.
    """
    supabase_url = f"https://vabuicprfcumalgyecxi.supabase.co/storage/v1/object/public/product-images/{image_path}"
    
    try:
        response = requests.get(supabase_url, timeout=10)
        response.raise_for_status()
        
        content_type = response.headers.get('Content-Type', 'image/png')
        return HttpResponse(response.content, content_type=content_type)
        
    except requests.RequestException as e:
        return HttpResponse(f"Image not found: {str(e)}", status=404)
