"""
Generate complete translation structure for all 5 languages
This script creates the full JSON structure for Italian, German, French, and Spanish
based on the English master file
"""
import json
import os

# Read English master file
with open('messages/en.json', 'r', encoding='utf-8') as f:
    en_data = json.load(f)

# Language configurations
languages = {
    'it': {
        'name': 'Italian',
        'file': 'messages/it.json'
    },
    'de': {
        'name': 'German',
        'file': 'messages/de.json'
    },
    'fr': {
        'name': 'French',
        'file': 'messages/fr.json'
    },
    'es': {
        'name': 'Spanish',
        'file': 'messages/es.json'
    }
}

# For now, duplicate English structure (professional translation would replace values)
for lang_code, lang_info in languages.items():
    # Deep copy the English structure
    lang_data = json.loads(json.dumps(en_data))

    # Write to file with proper formatting
    with open(lang_info['file'], 'w', encoding='utf-8') as f:
        json.dump(lang_data, f, indent=4, ensure_ascii=False)

    print(
        f"✅ Generated {lang_info['name']} translation file: {lang_info['file']}")

print("\n✨ All translation files generated successfully!")
print("📝 Note: These files currently contain English text.")
print("🔄 Next step: Replace with professional translations for each language.")
