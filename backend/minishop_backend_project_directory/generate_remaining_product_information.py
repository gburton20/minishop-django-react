import os
import random
import psycopg2
from dotenv import load_dotenv
from openai import OpenAI

load_dotenv()
client = OpenAI()

# Database connection
DATABASE_URL = os.getenv("DATABASE_URL")

# Connect to PostgreSQL
print("Connecting to database...")
conn = psycopg2.connect(DATABASE_URL)
cur = conn.cursor()

# Fetch all products that need additional data
cur.execute("""
    SELECT id, name, category, description, brand, rating, discount_percentage, availability_status 
    FROM minishop_backend_app_product
""")
products = cur.fetchall()

print(f"Found {len(products)} products to update\n")

# Category-appropriate brand mappings
BRANDS = {
    "Clothes": ["Nike", "Adidas", "Zara", "H&M", "Uniqlo", "Gap", "Levi's"],
    "Electronics": ["Sony", "Samsung", "Apple", "LG", "Panasonic", "Dell", "HP"],
    "Furniture": ["IKEA", "West Elm", "Crate & Barrel", "Ashley", "Wayfair"],
    "Shoes": ["Nike", "Adidas", "New Balance", "Puma", "Vans", "Converse"],
    "Miscellaneous": ["Generic Brand", "Store Brand", "Universal", "Classic"]
}

updated_count = 0

for product_id, name, category, description, brand, rating, discount_pct, avail_status in products:
    print(f"Processing product {product_id}: {name}")
    
    # Generate description if missing
    if not description:
        try:
            prompt = f"Write a concise 2-3 sentence product description for an ecommerce site selling: {name}. Category: {category}. Be descriptive but brief."
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[{"role": "user", "content": prompt}],
                max_tokens=100
            )
            description = response.choices[0].message.content.strip()
            print(f"  ✓ Generated description")
        except Exception as e:
            description = f"High-quality {name.lower()} for sale."
            print(f"  ⚠ Using fallback description: {e}")
    
    # Assign brand if missing
    if not brand:
        brand_list = BRANDS.get(category, BRANDS["Miscellaneous"])
        brand = random.choice(brand_list)
        print(f"  ✓ Assigned brand: {brand}")
    
    # Generate rating if missing
    if rating is None:
        rating = round(random.uniform(3.5, 5.0), 2)
        print(f"  ✓ Generated rating: {rating}")
    
    # Generate discount percentage with weighted distribution
    # 50% get 0%, 20% get 10%, 10% get 15%, 10% get 20%, 10% get 50%
    discount_values = [0.00, 10.00, 15.00, 20.00, 50.00]
    discount_weights = [50, 20, 10, 10, 10]  # Proportional weights
    discount_pct = random.choices(discount_values, weights=discount_weights, k=1)[0]
    print(f"  ✓ Set discount: {discount_pct}%")
    
    # Set availability status if missing or default
    if not avail_status or avail_status == '':
        avail_status = random.choice(["In Stock", "In Stock", "In Stock", "Low Stock"])
        print(f"  ✓ Set availability: {avail_status}")
    
    # Update the database
    try:
        cur.execute("""
            UPDATE minishop_backend_app_product
            SET description = %s,
                brand = %s,
                rating = %s,
                discount_percentage = %s,
                availability_status = %s
            WHERE id = %s
        """, (description, brand, rating, discount_pct, avail_status, product_id))
        updated_count += 1
        print(f"  ✓ Updated product {product_id}\n")
    except Exception as e:
        print(f"  ✗ Failed to update product {product_id}: {e}\n")

# Commit changes
conn.commit()
cur.close()
conn.close()

print(f"\n{'='*50}")
print(f"✓ Successfully updated {updated_count} products!")
print(f"{'='*50}")