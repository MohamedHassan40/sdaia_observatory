import requests
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Fetches universities and their AI works data from OpenAlex API'

    def handle(self, *args, **kwargs):
        def get_universities_in_saudi_arabia():
            page_size = 200
            page = 1
            max_pages = 1
            count = 0
            university_ids = []

            while page <= max_pages:
                url = f'https://api.openalex.org/institutions?filter=country_code:sa,type:education&per-page={page_size}&page={page}'
                response = requests.get(url)
                data = response.json()
                count = data['meta']['count']
                max_pages = count // page_size + 1

                for university in data['results']:
                    university_ids.append([
                        university['id'].split('/')[-1],
                        university['display_name']
                    ])

                page += 1

            return university_ids

        def get_ai_works_per_university():
            university_ids = get_universities_in_saudi_arabia()
            ai_works_per_university = {}

            for university_id in university_ids[:5]:
                print(university_id)

                current_page = 1
                max_pages = 1
                count = 0
                page_size = 200

                ai_works_per_university[university_id[1]] = {}

                # url = https://api.openalex.org/works?filter=institutions.id:I28022161,concepts.id:"https://openalex.org/C41008148"|"https://openalex.org/C56297635"

                while current_page <= max_pages:
                    print(
                        f"Fetching page {current_page} of {max_pages} for {university_id[1]}")
                    ai_ml_filter = f'filter=institutions.id:{university_id[0]},concepts.id:"https://openalex.org/C41008148"|"https://openalex.org/C56297635",from_publication_date:2013-01-01'
                    ai_ml_url = f'https://api.openalex.org/works?{ai_ml_filter}&page={current_page}&per-page={page_size}'
                    ai_ml_response = requests.get(ai_ml_url)
                    ai_ml_data = ai_ml_response.json()
                    count = ai_ml_data['meta']['count']
                    max_pages = count // page_size + 1

                    for work in ai_ml_data['results']:
                        year = int(work['publication_date'].split('-')[0])
                        ai_works_per_university[university_id[1]][year] = ai_works_per_university[university_id[1]].get(
                            year, 0) + 1

                    current_page += 1

            return ai_works_per_university

        # Execute the data fetching and print the results
        ai_works = get_ai_works_per_university()
        for university, works in ai_works.items():
            self.stdout.write(f"University: {university}")
            for year, count in sorted(works.items()):
                self.stdout.write(f"  Year: {year}, Works: {count}")

        with open('ai_works.json', 'w') as f:
            f.write(str(ai_works))
