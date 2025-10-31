# The file should contain this code:
import json
import os
from django.core.management.base import BaseCommand
from django.conf import settings
from minishop_backend_app.models import Product

class Command(BaseCommand):
    help = 'Import dummy products from JSON file'

    def add_arguments(self, parser):
        parser.add_argument(
            '--file',
            type=str,
            default='/Users/georgeburton/Downloads/dummy_products_all_categories_title_images.json',
            help='Path to the JSON file containing dummy products'
        )
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Clear existing products before importing'
        )

    def handle(self, *args, **options):
        file_path = options['file']
        
        if not os.path.exists(file_path):
            self.stdout.write(
                self.style.ERROR(f'File not found: {file_path}')
            )
            return

        if options['clear']:
            self.stdout.write('Clearing existing products...')
            Product.objects.all().delete()
            self.stdout.write(
                self.style.SUCCESS('Existing products cleared')
            )

        try:
            with open(file_path, 'r') as file:
                products_data = json.load(file)

            created_count = 0
            skipped_count = 0

            for product_data in products_data:
                # Check if product already exists
                if Product.objects.filter(name=product_data['title']).exists():
                    self.stdout.write(
                        self.style.WARNING(f'Product "{product_data["title"]}" already exists, skipping...')
                    )
                    skipped_count += 1
                    continue

                # Create the product
                product = Product.objects.create(
                    name=product_data['title'],
                    category=product_data['category'],
                    price=product_data['price'],
                )
                
                self.stdout.write(f'Created product: {product.name}')
                created_count += 1

            self.stdout.write(
                self.style.SUCCESS(
                    f'Successfully imported {created_count} products. '
                    f'Skipped {skipped_count} existing products.'
                )
            )

        except Exception as e:
            self.stdout.write(
                self.style.ERROR(f'Error importing products: {str(e)}')
            )