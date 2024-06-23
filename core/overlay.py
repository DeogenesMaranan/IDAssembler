import matplotlib
matplotlib.use('Agg')

import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties
import os

class OverlayGenerator:
    def __init__(self):
        pass
    
    def find_optimal_font_size(self, text, font_family, target_width, target_height):
        font_size = 1
        while True:
            prop = FontProperties(family=font_family, size=font_size)
            fig, ax = plt.subplots()
            ax.set_xlim(0, target_width)
            ax.set_ylim(0, target_height)
            ax.axis('off')

            text_obj = ax.text(0, 0, text, fontproperties=prop)
            text_width, text_height = text_obj.get_window_extent(renderer=fig.canvas.get_renderer()).size
            plt.close(fig)
            
            if text_width > target_width or text_height > target_height:
                break
            
            font_size += 1

        return font_size

    def create_template(self, devOnly, canvas_height):
        placeholder =[]

        for item in devOnly:
            if item["type"] == "i-text":
                font_size = self.find_optimal_font_size(item["text"], item["fontFamily"], item["width"], item["height"])
                print('here after font size')
                x = item[item["align"]]
                y = canvas_height - item["top"] - font_size / 4
                print(f"{x}, {y}")
                
                if y < 0:
                    continue

                placement = {
                    'Column': item.get("text", ""),
                    'Font': item.get("fontFamily", ""),
                    'FontSize': font_size,
                    'Align': item.get("align", "left"),
                    'X': x,
                    'Y': y,
                    'Color': item.get("fill", "black")
                }

                placeholder.append(placement)

        return placeholder
    
    def add_content(self, row, template):
        for placement in template:
            column_name = placement['Column']
            if column_name in row:
                placement['text'] = row[column_name]
            else:
                placement['text'] = ''
        return template
    
    def generate_bulk(self, data, devOnly, output_path):
        print(devOnly)
        try:
            canvas_width = 354
            canvas_height = 499
            for row in devOnly:
                print(row['type'])
                if row["type"] == "client_width":
                    canvas_width = int(row["text"])
                elif row["type"] == "client_height":
                    canvas_height = int(row["text"])
                
                if canvas_width and canvas_height:
                    break

            print('template')
            print(f"Canvas width: {canvas_width}, Canvas height: {canvas_height}")
            template = self.create_template(devOnly, canvas_height)
            print('template')
            

            for idx, row in enumerate(data):
                entry = self.add_content(row, template.copy())
                output_file = os.path.join(output_path, f"{format(idx, 'x')}.png")
                
                try:
                    self.generate_image(entry, canvas_width, canvas_height, output_file)
                    print(f"Generated image {output_file}")
                except Exception as e:
                    print(f"Error generating image {output_file}: {str(e)}")
                
        except Exception as e:
            print(f"Error generating bulk images: {str(e)}")

    
    def generate_image(self, entry, canvas_width, canvas_height, output_file):
        fig, ax = plt.subplots(figsize=(canvas_width / 100, canvas_height / 100), dpi=100)
        ax.set_xlim(0, canvas_width)
        ax.set_ylim(0, canvas_height)
        ax.axis('off')


        for item in entry:
            prop = FontProperties(family=item["Font"], size=item['FontSize'])
            x = int(item['X'])
            y = int(item['Y'])
            print(f"{x}, {y}")

            text = ax.text(x, y, item["text"], fontproperties=prop, va='top', ha='left', color=item["Color"], clip_on=True)
            text.set_bbox(dict(facecolor='white', alpha=0.0))
            text_width = text.get_window_extent(renderer=fig.canvas.get_renderer()).width

            if item["Align"] == "center":
                text.set_x(x - text_width / 2)
            elif item["Align"] == "right":
                text.set_x(x - text_width)

        fig.subplots_adjust(left=0, right=1, top=1, bottom=0)
        plt.savefig(output_file, bbox_inches='tight', pad_inches=0, transparent=True)
        plt.close(fig)
        return output_file
    


    # def generate_image(self, data, canvas_width, canvas_height, output_path):
    #     fig, ax = plt.subplots(figsize=(canvas_width / 100, canvas_height / 100), dpi=100)
    #     ax.set_xlim(0, canvas_width)
    #     ax.set_ylim(0, canvas_height)
    #     ax.axis('off')

    #     for item in data:
    #         if item["type"] == "i-text":
    #             font_size = self.find_optimal_font_size(item["text"], item["fontFamily"], item["width"], item["height"])
    #             prop = FontProperties(family=item["fontFamily"], size=font_size)

    #             x = item["left"]
    #             y = canvas_height - item["top"] - (font_size/4)

    #             if y < 0:
    #                 continue

    #             text = ax.text(x, y, item["text"], fontproperties=prop, va='top', ha='left', color=item["fill"], clip_on=True)
    #             text.set_bbox(dict(facecolor='white', alpha=0.0))

    #     fig.subplots_adjust(left=0, right=1, top=1, bottom=0)
    #     plt.savefig(output_path, bbox_inches='tight', pad_inches=0, transparent=True)
    #     plt.close(fig)
    #     return output_path