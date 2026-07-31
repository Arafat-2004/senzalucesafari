import os
from svglib.svglib import svg2rlg
from reportlab.graphics import renderPM
from reportlab.lib.colors import Color

# Paths
base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
svg_path = os.path.join(base_dir, 'public', 'icons', 'notification-icon.svg')
icon_path = os.path.join(base_dir, 'public', 'icons', 'notification-icon.png')
badge_path = os.path.join(base_dir, 'public', 'icons', 'notification-badge.png')

# Transparency background
transparent = Color(0, 0, 0, 0)

def render_svg(out_path, size):
    # Load fresh drawing to avoid cumulative scaling
    drawing = svg2rlg(svg_path)
    
    # Scale drawing
    scale_factor = size / 512.0
    drawing.width = size
    drawing.height = size
    drawing.scale(scale_factor, scale_factor)
    
    # Render drawing with transparent background
    renderPM.drawToFile(drawing, out_path, fmt='PNG', bg=transparent)

print("Rendering 192x192 icon...")
render_svg(icon_path, 192)
print("Rendering 72x72 badge...")
render_svg(badge_path, 72)
print("Completed successfully!")
