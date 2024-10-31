import requests
from dotenv import load_dotenv, find_dotenv
import os

env = find_dotenv()


load_dotenv(env)


def fetch_and_save_company_data():
    url = "https://linkedin-data-api.p.rapidapi.com/get-company-details"
    headers = {
        # "X-RapidAPI-Key": os.getenv("X_RAPIDAPI_KEY"),
        "X-RapidAPI-Key": "65503c7690msh4032d1dad082317p1e0bc1jsn824ed00f5bb0",
        "X-RapidAPI-Host": "linkedin-data-api.p.rapidapi.com"
    }

    company_list = [
        "samatwaiq","thiqah-sa", 'mozn', 'lucidya', 'lean-sa', "sadeem-wireless-sensing-systems",
        'quant-sa', 'machinestalk', 'tamkeen-technologies', 'hazen-ai', "elm", "elevatusio",
        "intelmatix", "ringneck", "tahakom", "kendaai", "neo-locus", "neuralwize", "deevoanalytics-deevo",
        "memorality", "najeeb-ai", "eyegoai", "fathom-io", "alkhwarizmi", "araby-ai",
        "jahez-international", "feelix-ai", "aidai", "acelyticsai", "lisanai", "nearmotion", "foodbit",
        "mawdoo3-com", "wakeb-data", "quality-support-solutions-co-ltd", "sindbad-tech", "thya-technology",
        "retailo-app", "vetworkapp", "digitalpetroleum", "nybl", "scai-sa", "lendosa", "data-volt", "sa-geotech",
        "al-moammar-information-systems", "detasad", "zenith-arabia-ai", "intdv", "techgropse",
        "unitxlabs", "desaisivltd", "master-works", "falconviz", "firnasaero", "aramco", "stc", "saudielectricity",
        "snbalahli", "bankalbilad", "alawwalsab", "saudi-investment-bank", "alinma-bank", "bankaljazira",
        "bsf_sa", "pifsaudi", "sdaia-ksa", "mofksa", "saudia-airlines", "roshnksa", "riyad-bank", "alrajhibank",
        "zatcasa", "exproksa", "saudi-central-bank-sama", "sabic", "red-sea-global", "maaden", "7roads", "quicklisten",
        "deeplayersai", "taipui", "nozolwalletsa", "computinggate", "sdm-advanced-solutions", "summarizex", "invdro",
        "fanzapp-io", "zidapp", "sallaapp", "carewave-ai", "whitehelmet", "arabic-computer-systems", "saudi-tadawul-group",
        "hungerstation-com", "nana-app", "saudi-industrial-development-fund", "payllion", "misbah-ai", "nommas", "hudhud-ai", "ailaai", "communico-ai",

        "foodics", "geidea", "leantechnologies", "trysary", "transviti", "tamara", "tabbypay", "rayacx", "satmicrosystems",
        "gaia-accelerator", "braincellsa", "aisc-sa", "near-pay", "hakbah", "datalexing", "icm-ai", "alareebict",
        "robotics-llc", "afi-robotics", "quantumplatform", "miqyas", "liven-sa", "nearmotion", "tweeq", "unitxtech",
        "idrak-ai", "carewave-ai", "qaff-inc", "ballurha", "moddakirapp", "amplifai-health", "ertikazsolutions",
        "ayenplatform", "aictecsa", "mustadem", "sarsat", "wajeezapp", "unifonic", "flowardco", "tryotocom",
        "rasan-information-technology", "tawuniya", "solutionsbystc", "bupaarabia", "retailo-app", "cognna",
        "takamul-smart-technology-ksa", "atinumgroup", "labayhapp", "paytabs-holding-company", "iditventures", "samatwaiq",
        "thakaa-med", "inlightsai", "shiftat-شفتات"
    ]

    for company_name in company_list:
        querystring = {"username": company_name}
        response = requests.get(url, headers=headers, params=querystring)
        if response.status_code == 200:
            data = response.json().get('data', {})
            if data:
                try:
                    print(f"Creating Company: {data}")
                    create_company(data)
                    print(f"Successfully processed: {company_name}")
                except Exception as e:
                    print(f"Error processing {company_name}: {e}")
            else:
                print(f"No data found for {company_name}")
        else:
            print(
                f"API request failed for {company_name} with status code {response.status_code}")


def create_company(data):
    api_url = os.getenv("BACKEND_URL") + \
        "/api/v1/talent/companies/create-from-json/"
    response = requests.post(api_url, json=data)
    print(f"Creating Company: {response.status_code}")
    print(response.text)  # Print response content
    if response.status_code == 200:
        print(f"Successfully created: {data.get('name')}")
    else:
        print(f"Failed to create company: {response.text}")


fetch_and_save_company_data()
