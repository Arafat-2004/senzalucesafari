"""
Batch translation script for Senza Luce Safaris
This script helps identify all hardcoded strings in components
"""

import os
import re

# Components to translate
COMPONENTS = [
    'src/components/home/safari-categories-section.tsx',
    'src/components/home/featured-tours-section.tsx',
    'src/components/home/accommodations-section.tsx',
    'src/components/home/testimonials-section.tsx',
    'src/components/home/faq-section.tsx',
    # Add more as needed
]

def extract_hardcoded_strings(filepath):
    """Extract hardcoded strings from a component file"""
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find strings in JSX
    strings = re.findall(r'>([^<>{}]+)<', content)
    return [s.strip() for s in strings if len(s.strip()) > 3 and not s.startswith('{')]

# Run extraction
for component in COMPONENTS:
    full_path = os.path.join('c:\\Users\\arafa\\Desktop\\safarisSenza\\senzalucesafaris', component)
    if os.path.exists(full_path):
        strings = extract_hardcoded_strings(full_path)
        print(f"\n{component}:")
        for s in strings[:10]:  # Show first 10
            print(f"  - {s}")
