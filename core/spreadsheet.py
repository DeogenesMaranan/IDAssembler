import pandas as pd
import os

def save_excel_file(data, filename):
    column_headers = [obj['text'] for obj in data if obj['type'] != 'image']
    df_data = pd.DataFrame(columns=column_headers)
    df_positions = pd.DataFrame(data)

    with pd.ExcelWriter(filename, engine='xlsxwriter') as writer:
        df_data.to_excel(writer, sheet_name='data', index=False)
        df_positions.to_excel(writer, sheet_name='DeveloperOnly', index=False)
        worksheet_positions = writer.sheets['DeveloperOnly']
        worksheet_positions.protect(password='DeveloperOnly')
        worksheet_positions.hide()

    print(f"Data converted and saved to {filename}")

def save_to_excel(data, filename, backup_subdir='backup'):
    save_excel_file(data, filename)

    project_dir, base_filename = os.path.split(filename)
    backup_dir = os.path.join(project_dir, backup_subdir)
    os.makedirs(backup_dir, exist_ok=True)
    backup_filename = os.path.join(backup_dir, base_filename)

    save_excel_file(data, backup_filename)