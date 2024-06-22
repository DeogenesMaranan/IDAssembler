import os
import pandas as pd

class SpreadSheetManager:
    def save_spreadsheet_file(data, filename):
        column_headers = [obj['text'] for obj in data if obj['type'] == 'i-text']
        df_data = pd.DataFrame(columns=column_headers)
        df_positions = pd.DataFrame(data)

        with pd.ExcelWriter(filename, engine='xlsxwriter') as writer:
            df_data.to_excel(writer, sheet_name='data', index=False)
            df_positions.to_excel(writer, sheet_name='DeveloperOnly', index=False)
            worksheet_positions = writer.sheets['DeveloperOnly']
            worksheet_positions.protect(password='DeveloperOnly')
            worksheet_positions.hide()

        print(f"Data converted and saved to {filename}")

    def save_to_spreadsheet(data, filename, backup_subdir='backup'):
        SpreadSheetManager.save_spreadsheet_file(data, filename)

        project_dir, full_base_filename = os.path.split(filename)
        base_filename, ext = os.path.splitext(full_base_filename)

        for obj in data:
            if obj['type'] == 'image':
                image_folder_name = os.path.join(project_dir, f"{base_filename}_{obj['text']}")
                os.makedirs(image_folder_name, exist_ok=True)

        backup_dir = os.path.join(project_dir, backup_subdir)
        os.makedirs(backup_dir, exist_ok=True)
        backup_filename = os.path.join(backup_dir, full_base_filename)

        SpreadSheetManager.save_spreadsheet_file(data, backup_filename)

    import pandas as pd

    def load_spreadsheet_developer_only(self, filename):
        with pd.ExcelFile(filename) as xls:
            df_positions = pd.read_excel(xls, sheet_name='DeveloperOnly')

        df_positions = df_positions.fillna("<empty>")

        data = []

        for _, row in df_positions.iterrows():
            obj = row.to_dict()
            data.append(obj)

        return data


    def load_spreadsheet_data(self, filename):
        with pd.ExcelFile(filename) as xls:
            df_data = pd.read_excel(xls, sheet_name='data')
            
        data = []
        
        for _, row in df_data.iterrows():
            row_dict = row.to_dict()
            data.append(row_dict)

        return data