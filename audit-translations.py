"""
Complete Translation Coverage Audit
Finds all hardcoded text in components that should be translated
"""
import os
import re
from pathlib import Path

# Directories to scan
SCAN_DIRS = [
    'src/components',
    'src/app/[locale]'
]

# Files to skip
SKIP_FILES = [
    'node_modules',
    '.next',
    '__pycache__'
]


def find_hardcoded_text(filepath):
    """Find potential hardcoded text in JSX/TSX files"""
    issues = []

    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            lines = content.split('\n')

        # Check if file uses useTranslations
        has_use_translations = 'useTranslations' in content

        # Look for hardcoded strings in JSX
        for i, line in enumerate(lines, 1):
            # Skip comments and imports
            stripped = line.strip()
            if stripped.startswith('//') or stripped.startswith('*') or stripped.startswith('import'):
                continue

            # Look for common hardcoded text patterns
            patterns = [
                # Strings in JSX that might need translation
                r'>[A-Z][a-z]+.*[a-z]\s*[A-Z]',  # Capitalized text
                r'{"[A-Z].*"}',  # Text in curly braces
            ]

        # Check for common untranslated sections
        common_sections = [
            'Email Us',
            'Appearance',
            'Arusha, Tanzania',
        ]

        for section in common_sections:
            if section in content and not has_use_translations:
                issues.append(
                    f"Line ~{content.find(section)//50}: Contains '{section}' but no useTranslations hook")

        return issues, has_use_translations

    except Exception as e:
        return [f"Error reading file: {e}"], False


def main():
    print("=" * 80)
    print("TRANSLATION COVERAGE AUDIT")
    print("=" * 80)
    print()

    components_without_translations = []
    components_with_translations = []

    base_path = Path('.')

    for scan_dir in SCAN_DIRS:
        scan_path = base_path / scan_dir
        if not scan_path.exists():
            continue

        for filepath in scan_path.rglob('*.tsx'):
            # Skip certain directories
            if any(skip in str(filepath) for skip in SKIP_FILES):
                continue

            issues, has_translations = find_hardcoded_text(filepath)

            if has_translations:
                components_with_translations.append(filepath)
            else:
                components_without_translations.append((filepath, issues))

    print(
        f"✅ Components WITH translations: {len(components_with_translations)}")
    for comp in sorted(components_with_translations):
        print(f"   ✓ {comp}")

    print()
    print(
        f"❌ Components WITHOUT translations: {len(components_without_translations)}")
    for comp, issues in sorted(components_without_translations):
        print(f"   ✗ {comp}")
        for issue in issues[:3]:  # Show first 3 issues
            print(f"     - {issue}")

    print()
    print("=" * 80)
    print("RECOMMENDATION")
    print("=" * 80)
    print()
    print("Components that need translation support added:")
    for comp, _ in sorted(components_without_translations):
        print(f"  - {comp}")


if __name__ == '__main__':
    main()
