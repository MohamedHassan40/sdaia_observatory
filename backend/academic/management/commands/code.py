from django.core.management.base import BaseCommand
# Import other necessary module
import requests
from django.utils.dateparse import parse_datetime, parse_date
from talent.models import Company, Location, FundingRound, Investor, FundingData


def fetch_and_save_company_data():
    list_of_companies = [
        "mozn",
        "thiqah-sa",
        "sadeem-wireless-sensing-systems",
        "quant-sa",
        "lucidya",
        "hazen-ai",
        "basserahit",
        "lean-sa",
        "machinestalk",
        "tamkeen-technologies",
        "scai-sa",
        # "wakeb-data",
        # "foodics",
        # "elevatusio",
        # "elm",
        # "nana-app",
        # "lendosa",
        # "geidea",
        # "nybl",
        # "zidapp",
        # "sindbad-tech",
        # "leantechnologies",
        # "trysary",
        # "al-moammar-information-systems",
        # "intelmatix",
        # "transviti",
        # "tamara",
        # "tabbypay",
        # "rayacx",
        # "detasad",
        # "gaia-accelerator",
        # "quality-support-solutions-co-ltd",
        # "zenith-arabia",
        # "ringneck",
        # "tahakom",
        # "braincellsa",
        # "aisc-sa",
        # "near-pay",
        # "kendaai",
        # "icm-ai",
        # "ailaai",
        # "neo-locus",
        # "jahez-international",
        # "hudhud-ai",
        # "master-works",
        # "alareeb-ict",
        # "satmicrosystems",
        # "falconviz",
        # "alkhwarizmi",
        # "araby-ai",
        # "qaff-inc",
        # "carewave-ai",
        # "idrak-ai",
        # "feelix-ai",
        # "misbah-ai",
        # "7roads",
        # "aidai",
        # "acelyticsai",
        # "paytabs-holding-company",
        # "labayhapp",
        # "deevoanalytics-deevo",
        # "takamul-smart-technology-ksa",
        # "cognna",
        # "qalam-ai",
        # "retailo-app",
        # "rasan-information-technology",
        # "tryotocom",
        # "najeeb-ai",
        # "flowardco",
        # "taipui",
        # "nommas",
        # "jmminnovations",
        # "use-tamam",
        # "rasmal",
        # "morni",
        # "fordeal",
        # "digitalpetroleum",
        # "learnatnoon",
        # "ewaantech",
        # "barq-app-sa",
        # "yasminaai"
    ]

    url = "https://linkedin-api8.p.rapidapi.com/get-company-details"
    headers = {
        "X-RapidAPI-Key": "65503c7690msh4032d1dad082317p1e0bc1jsn824ed00f5bb0",
        "X-RapidAPI-Host": "linkedin-api8.p.rapidapi.com"
    }

    for company_name in list_of_companies:
        querystring = {"username": company_name}
        response = requests.get(url, headers=headers, params=querystring)
        # data = sampleResponse['data']
        # response = sampleResponse

        data = response.json()['data']
        # ]

        if response.json().get('success', False):
            funding_data = data.get('fundingData', {})
            last_funding_round = funding_data.get('lastFundingRound', {})

            # Handle Funding Round and Investors
            funding_round_instance = None
            if last_funding_round:
                investors = []
                for investor in last_funding_round.get('leadInvestors', []):
                    investor_instance, _ = Investor.objects.get_or_create(
                        name=investor['name'],
                        investor_crunchbase_url=investor.get(
                            'investorCrunchbaseUrl', '')
                    )
                    investors.append(investor_instance)

                funding_round_instance, _ = FundingRound.objects.get_or_create(
                    funding_type=last_funding_round.get('fundingType', ''),
                    money_raised_amount=last_funding_round.get(
                        'moneyRaised', {}).get('amount', 0),
                    money_raised_currency=last_funding_round.get(
                        'moneyRaised', {}).get('currencyCode', ''),
                    announced_on=parse_date(
                        f"{last_funding_round['announcedOn']['year']}-{last_funding_round['announcedOn']['month']}-{last_funding_round['announcedOn']['day']}"),
                    funding_round_crunchbase_url=last_funding_round.get(
                        'fundingRoundCrunchbaseUrl', '')
                )
                funding_round_instance.investors.set(investors)

            # Handle Funding Data
            funding_data_instance = None
            if funding_data:
                funding_data_instance = FundingData(
                    updated_at=parse_datetime(funding_data['updatedDate']),
                    num_funding_rounds=funding_data['numFundingRounds'],
                    last_funding_round=funding_round_instance
                )
                funding_data_instance.save()

            # Create or update the company
            company_instance, created = Company.objects.update_or_create(
                company_id=str(data['id']),
                defaults={
                    'name': data['name'],
                    'description': data['description'],
                    'website_url': data.get('website', ''),
                    'logo_url': data['Images']['logo'],
                    'cover_image_url': data['Images']['cover'],
                    'founded_year': data['founded']['year'],
                    'employee_count': data['staffCount'],
                    'universal_name': data['universalName'],
                    'follower_count': data['followerCount'],
                    'funding_data': funding_data_instance if 'funding_data_instance' in locals() else None
                }
            )

            # Handle locations
            for location_data in data['locations']:
                location, created = Location.objects.update_or_create(
                    country=location_data['country'],
                    city=location_data['city'],
                    defaults={
                        'geographic_area': location_data.get('geographicArea', ''),
                        'postal_code': location_data.get('postalCode', ''),
                        'line1': location_data.get('line1', ''),
                        'line2': location_data.get('line2', ''),
                        'description': location_data.get('description', ''),
                        'is_headquarter': location_data.get('headquarter', False),
                    }
                )
                # Add or update many-to-many relationship
                location.company.add(company_instance)

            print(f"Processed company: {company_instance.name}")


class Command(BaseCommand):
    help = 'Fetches data from an external API and stores it in the database'

    def handle(self, *args, **options):
        fetch_and_save_company_data()
        # self.stdout.write(self.style.SUCCESS('Successfully updated company data'))
