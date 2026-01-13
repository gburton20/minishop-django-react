from django.http import HttpResponse
import requests

def image_proxy(request, image_path):
    """
    Proxy images from Supabase Storage to avoid CORS issues.
    Fetches the image from Supabase and serves it through Django.
    """
    # Construct the full Supabase URL
    supabase_url = f"https://vabuicprfcumalgyecxi.supabase.co/storage/v1/object/public/product-images/{image_path}"
    
    try:
        # Fetch the image from Supabase
        response = requests.get(supabase_url, timeout=10)
        response.raise_for_status()
        
        # Return the image with appropriate content type
        content_type = response.headers.get('Content-Type', 'image/png')
        return HttpResponse(response.content, content_type=content_type)
        
    except requests.RequestException as e:
        # Return 404 if image not found
        return HttpResponse(f"Image not found: {str(e)}", status=404)
