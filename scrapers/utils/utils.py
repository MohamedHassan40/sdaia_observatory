from dateutil import parser

def convert_date_to_iso_format(date_str):
    try:
        # Parse the date string into a datetime object
        dt = parser.parse(date_str)
        # Format the datetime object in the desired format
        # return dt.strftime('%Y-%m-%dT%H:%M:%S')
        return dt.strftime('%Y-%m-%d')

    except ValueError as e:
        # Handle the error if the date format is so unusual that dateutil can't parse it
        print(f"Failed to parse date '{date_str}': {str(e)}")
        return None

def linkedindate_to_iso_date(date_str):
    # {'year': 2022, 'month': 6, 'day': 0}
    try:
        year = date_str.get('year', 0)
        month = date_str.get('month', 0)
        day = date_str.get('day', 0)
        if year:
            return f"{year}-{month}-{day}"
        else:
            return None
    except Exception as e:
        print(f"Failed to parse date '{date_str}': {str(e)}")
        return None
