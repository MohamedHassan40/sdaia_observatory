
#!/bin/bash

while true
do
  # Activate the virtual environment
  source /home/aabdeen/sdaia-ai-observatory/venv/bin/activate

  # Run all Python modules in the helpers directory
  python -m helpers.fetchOECDNews
  python -m helpers.blogs
  python -m helpers.companyTwitter
  python -m helpers.news
  python -m helpers.twitterSearch
  python -m helpers.products

  # Deactivate the virtual environment
  deactivate

  # Log the completion time
  echo "Run completed at $(date)" >> /home/aabdeen/sdaia-ai-observatory/scrapers/scrapers2.log

  # Sleep for 3 hours (10800 seconds)
  sleep 10800
done
