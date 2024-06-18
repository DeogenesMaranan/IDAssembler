import pandas as pd

def save_to_excel(data, filename):
  column_headers = [obj['text'] for obj in data if obj['type'] != 'group']
  df_data = pd.DataFrame(columns=column_headers)
  
  df_positions = pd.DataFrame(data)

  with pd.ExcelWriter(filename, engine='xlsxwriter') as writer:
    df_data.to_excel(writer, sheet_name='data', index=False)
    df_positions.to_excel(writer, sheet_name='DeveloperOnly', index=False)

    worksheet_positions = writer.sheets['DeveloperOnly']
    worksheet_positions.protect(password='DeveloperOnly')
    worksheet_positions.hide()

  print("Data converted and saved to", filename)
