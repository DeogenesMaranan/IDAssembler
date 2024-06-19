import matplotlib
matplotlib.use('Agg')

import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties

class OverlayGenerator:
    def __init__(self):
        pass
    
    def find_optimal_font_size(self, text, font_family, target_width, target_height):
        fig, ax = plt.subplots()
        ax.set_xlim(0, target_width)
        ax.set_ylim(0, target_height)
        ax.axis('off')

        font_size = 1
        while True:
            prop = FontProperties(family=font_family, size=font_size)
            text_width, text_height = ax.text(0, 0, text, fontproperties=prop).get_window_extent(renderer=fig.canvas.get_renderer()).size
            if text_width > target_width or text_height > target_height:
                break
            font_size += 1

        plt.close(fig)
        return font_size
    
    def generate_image(self, data, canvas_width, canvas_height, output_path):
        fig, ax = plt.subplots(figsize=(canvas_width / 100, canvas_height / 100), dpi=100)
        ax.set_xlim(0, canvas_width)
        ax.set_ylim(0, canvas_height)
        ax.axis('off')

        for item in data:
            if item["type"] == "i-text":
                font_size = self.find_optimal_font_size(item["text"], item["fontFamily"], item["width"], item["height"])
                prop = FontProperties(family=item["fontFamily"], size=font_size)
                
                x = item[item["align"]]
                y = canvas_height - item["top"] - font_size / 4
                
                if y < 0:
                    continue

                text = ax.text(x, y, item["text"], fontproperties=prop, va='top', ha='left', color=item["fill"], clip_on=True)  # Adjusted ha parameter
                text.set_bbox(dict(facecolor='white', alpha=0.0))
                text_width = text.get_window_extent(renderer=fig.canvas.get_renderer()).width
                if item["align"] == "center":
                    text.set_x(x + text_width / 2)  # Adjusted center alignment
                elif item["align"] == "right":
                    text.set_x(x - text_width)  # Adjusted right alignment

        fig.subplots_adjust(left=0, right=1, top=1, bottom=0)
        plt.savefig(output_path, bbox_inches='tight', pad_inches=0, transparent=True)
        plt.close(fig)
        return output_path
