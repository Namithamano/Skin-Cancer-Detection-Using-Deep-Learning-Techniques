import csv


def get_full_row(short_name, csv_file):

    with open(csv_file, "r") as file:
        reader = csv.reader(file)
        for row in reader:
            if row[0] == short_name:
                return row
    return None


csv_file = "types.csv"
short_name_to_find = "bcc"

full_row = get_full_row(short_name_to_find, csv_file)

if full_row:
    short_name, full_name, description, symptoms, treatment = full_row
    print(f"Full Name: {full_name}")
    print(f"Description: {description}")
    print(f"Symptoms: {symptoms}")
    print(f"Treatment: {treatment}")
else:
    print(f"Short name '{short_name_to_find}' not found in the CSV file.")
