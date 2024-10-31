import datetime
from django.shortcuts import render
from django.http import JsonResponse
from rest_framework.views import APIView
from django.shortcuts import get_object_or_404
from rest_framework import viewsets

from .utils import linkedindate_to_iso_date,correctSingleQuoteJSON
from .models import Company, CompanyBlog, CompanyNewsAndEvents, CompanySpecialities, CompanyProducts, EmployeeUrl, Tweet, Courses, HonorAndAwards, Language, LicenseAndCertifications, Location, Address, Projects, Skills, Experience, TweetSymbol, UserProfile, Education, VolunteerAndAwards
from .serializers import CompanyBlogSerializer, CompanyNewsAndEventsSerializer, CompanyProductSerializer, CompanySerializer, CourseSerializer, EmployeeUrlSerializer, LicenseAndCertificationsSerializer, TweetSerializer, LocationSerializer, AddressSerializer, SkillSerializer, ExperienceSerializer, UserProfileSerializer, EducationSerializer,SkillsSerializer
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework import status
from django.db import transaction
import json


class CompanyViewSet(viewsets.ModelViewSet):
    queryset = Company.objects.all()
    serializer_class = CompanySerializer

    def list(self, request):
        queryset = Company.objects.filter(is_verified=True).prefetch_related('location_set')

        total_verified_companies = queryset.count()
        total_public_companies = queryset.filter(company_type='public').count()
        total_private_companies = queryset.filter(company_type='private').count()
        total_nonprofit_companies = queryset.filter(company_type='nonprofit').count()
        total_not_specified_companies = queryset.filter(company_type='not_specified').count()

        response_data = {
            'total_verified_companies': total_verified_companies,
            'total_public_companies': total_public_companies,
            'total_private_companies': total_private_companies,
            'total_nonprofit_companies': total_nonprofit_companies,
            'total_not_specified_companies': total_not_specified_companies,
        }

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            response_data['results'] = serializer.data
            return self.get_paginated_response(response_data)

        serializer = self.get_serializer(queryset, many=True)
        response_data['results'] = serializer.data
        return Response(response_data)

    @action(detail=False, methods=['get'], url_path='by-linkedin-username/(?P<name>.+)')
    def retrieve_by_linkedin_username(self, request, name=None):
        queryset = Company.objects.all().prefetch_related('location_set')
        company = get_object_or_404(queryset, linkedin_username=name)
        serializer = CompanySerializer(company)
        return JsonResponse(serializer.data)

    @action(detail=False, methods=['POST'], url_path='by-linkedin-username')
    def create_by_linkedin_username(self, request):
        serializer = CompanySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = Company.objects.all().prefetch_related('location_set')
        # queryset = Company.objects.prefetch_related('news_and_events', 'locations', 'products', 'jobs', 'blogs', 'company_tweets', 'company_tweet_symbols').all()
        company = get_object_or_404(queryset, pk=pk)
        serializer = CompanySerializer(company)
        return JsonResponse(serializer.data)

    def create(self, request):
        serializer = CompanySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        # create specialities

        return JsonResponse(serializer.data)

    @action(detail=False, methods=['post'], url_path='create-from-json')
    def create_from_json(self, request):
        print("Received request")
        try:
            # Assuming data is sent in the request body
            json_data = json.loads(request.body)
            serializer = CompanySerializer(data=json_data)

            if serializer.is_valid():
                print("Serializer is valid", serializer)
                with transaction.atomic():
                    name = json_data.get('name')
                    linkedin_username = json_data.get('universalName')
                    industry = json_data.get('industries')[0]
                    tagline = json_data.get('tagline')
                    description = json_data.get('description')
                    company_type = json_data.get('type')
                    images = json_data.get('Images', {})
                    logo = images.get('logo', '')
                    cover = images.get('cover', '')
                    employees = json_data.get('staffCount')
                    website_url = json_data.get('website')
                    founded_year = json_data.get('founded', {}).get('year')
                    follower_count = json_data.get('followerCount')

                    company, created = Company.objects.update_or_create(
                        linkedin_username=linkedin_username,
                        defaults={
                            'name': name,
                            'industry': industry,
                            'tagline': tagline,
                            'description': description,
                            # 'company_type': company_type,
                            'logo_url': logo,
                            'cover_image_url': cover,
                            'employee_count': employees,
                            'website_url': website_url,
                            'founded_year': founded_year,
                            'follower_count': follower_count
                        }
                    )

                    # Handle nested specialties
                    specialities_data = json_data.get('specialities', [])
                    for speciality_data in specialities_data:
                        CompanySpecialities.objects.update_or_create(
                            company=company,
                            name=speciality_data
                        )

                    # Handle locations
                    locations_data = json_data.get('locations', [])
                    for location_data in locations_data:
                        Location.objects.update_or_create(
                            company=company,
                            country=location_data.get('country'),
                            city=location_data.get('city'),
                            line1=location_data.get('line1', ''),
                            line2=location_data.get('line2', ''),
                            description=location_data.get('description', ''),
                            is_headquarter=location_data.get(
                                'headquarter', False),
                            postal_code=location_data.get('postalCode', '')
                        )

                    return JsonResponse({'status': 'success', 'created': created}, status=status.HTTP_201_CREATED)
            else:
                return JsonResponse({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON'}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        def update(self, request, pk=None):
            try:
                print("Updating company with id", pk)
                company = Company.objects.get(pk=pk)
                serializer = CompanySerializer(
                    instance=company, data=request.data)
                if serializer.is_valid():
                    serializer.save()
                    return JsonResponse(serializer.data)
                else:
                    return JsonResponse({'error': serializer.errors}, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                print(e)
                return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        def destroy(self, request, pk=None):
            company = Company.objects.get(pk=pk)
            company.delete()
            return JsonResponse({'message': 'Company deleted successfully!'}, status=204)

        def partial_update(self, request, pk=None):
            print("Updating company with id", pk)
            company = Company.objects.get(pk=pk)
            serializer = CompanySerializer(
                instance=company, data=request.data, partial=True)
            serializer.is_valid(raise_exception=True)
            serializer.save()
            return JsonResponse(serializer.data)


class TweetsViewSet(viewsets.ModelViewSet):
    queryset = Tweet.objects.all()
    serializer_class = TweetSerializer

    def list(self, request):
        # get all tweets and order by created_at descending
        queryset = Tweet.objects.all().order_by('-created_at')

        
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return JsonResponse(serializer.data, safe=False)

    @action(detail=False, methods=['get'], url_path='by-company/(?P<company_id>\d+)')
    def list_by_company(self, request, company_id=None):
        """
        This view allows users to get all tweets related to a specific company by company_id.
        """
        if not company_id:
            return Response({"error": "Company ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            company = Company.objects.get(pk=company_id)
        # except Company.DoesNotExist:
        except Exception:
            return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)

        tweets = Tweet.objects.filter(company=company).order_by('-created_at')
        serializer = self.get_serializer(tweets, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['POST'], url_path='create-from-json/(?P<company_id>\d+)')
    def create_from_json(self, request, company_id=None):
        try:
            # Assuming data is sent in the request body
            json_data = json.loads(request.body)
            print(len(json_data))

            company = Company.objects.get(pk=company_id)

            if not company:
                company = None

            with transaction.atomic():
                for tweet_data in json_data:
                    if tweet_data.get('content') and tweet_data['content'].get('itemContent'):
                        content = tweet_data['content']['itemContent']
                        if 'TimelineTweet' in content['itemType']:
                            tweet_result = content.get(
                                'tweet_results', {}).get('result', {})
                            


                            legacy = tweet_result.get('legacy', {})

                            if legacy:
                                tweet_id = tweet_result.get('rest_id')
                                created_at = legacy.get('created_at')
                                full_text = legacy.get('full_text')
                                favorite_count = legacy.get(
                                    'favorite_count', 0)
                                retweet_count = legacy.get('retweet_count', 0)
                                conversation_id = legacy.get(
                                    'conversation_id_str')
                                lang = legacy.get('lang')
                                possibly_sensitive = legacy.get(
                                    'possibly_sensitive', False)

                                tweet, created = Tweet.objects.update_or_create(
                                    tweet_id=tweet_id,
                                    defaults={
                                        'company': company,
                                        'created_at': datetime.datetime.strptime(created_at, "%a %b %d %H:%M:%S %z %Y") if created_at else None,
                                        # Make datetime timezone-aware
                                        'added_at': datetime.datetime.now(datetime.timezone.utc),
                                        'full_text': full_text,
                                        'favorite_count': favorite_count,
                                        'retweet_count': retweet_count,
                                        'conversation_id': conversation_id,
                                        'lang': lang,
                                        'possibly_sensitive': possibly_sensitive,
                                    }
                                )
                                if created:
                                    print(
                                        f"Saved tweet {tweet.tweet_id} for {company.name}")

                                # Handle symbols
                                entities = legacy.get('entities', {})
                                symbols = entities.get('symbols', [])
                                for symbol_data in symbols:
                                    # check if the symbol already exists
                                    symbol = TweetSymbol.objects.filter(
                                        symbol=symbol_data['text']).first()
                                    if not symbol:
                                        symbol = TweetSymbol.objects.create(
                                            symbol=symbol_data['text'],
                                            created_at=datetime.datetime.now(
                                                datetime.timezone.utc),
                                            times_mentioned=1
                                        
                                        )
                                    else:
                                        symbol.times_mentioned += 1
                                        symbol.save()
                                    # Correct way to add to many-to-many relationship
                                    tweet.symbols.add(symbol)

                                # Handle hashtags
                                hashtags = entities.get('hashtags', [])
                                for hashtag_data in hashtags:
                                    # check if the hashtag already exists
                                    hashtag_symbol = TweetSymbol.objects.filter(
                                        symbol="#" + hashtag_data['text']).first()
                                    if not hashtag_symbol:
                                        hashtag_symbol = TweetSymbol.objects.create(
                                            symbol="#" + hashtag_data['text'],
                                            created_at=datetime.datetime.now(
                                                datetime.timezone.utc),
                                            times_mentioned=1
                                        )
                                    else:
                                        hashtag_symbol.times_mentioned += 1
                                        hashtag_symbol.save()
                                    # Correct way to add to many-to-many relationship
                                    tweet.symbols.add(hashtag_symbol)

                return JsonResponse({'status': 'success', 'created': created}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['POST'], url_path='create-tweet-from-json')
    def create_tweet(self, request):
        try:
            # Assuming data is sent in the request body
            json_data = json.loads(request.body)
            print(len(json_data))

            with transaction.atomic():
                for tweet_data in json_data:
                    if tweet_data.get('content') and tweet_data['content'].get('itemContent'):
                        content = tweet_data['content']['itemContent']
                        if 'TimelineTweet' in content['itemType']:
                            print("Reached legacy")
                            tweet_result = content.get(
                                'tweet_results', {}).get('result', {})
                            legacy = tweet_result.get('legacy', {})

                                                    
                            user = tweet_result.get('core', {})
                            print(user)
                            if user:
                                user_results = user.get('user_results', {})
                                if user_results:
                                    username = user_results.get('result', {}).get('legacy', {}).get('screen_name')


                            if legacy:
                                tweet_id = tweet_result.get('rest_id')
                                created_at = legacy.get('created_at')
                                full_text = legacy.get('full_text')
                                favorite_count = legacy.get(
                                    'favorite_count', 0)
                                retweet_count = legacy.get('retweet_count', 0)
                                conversation_id = legacy.get(
                                    'conversation_id_str')
                                lang = legacy.get('lang')
                                possibly_sensitive = legacy.get(
                                    'possibly_sensitive', False)

                                tweet, created = Tweet.objects.update_or_create(
                                    tweet_id=tweet_id,
                                    defaults={
                                        'created_at': datetime.datetime.strptime(created_at, "%a %b %d %H:%M:%S %z %Y") if created_at else None,
                                        # Make datetime timezone-aware
                                        'added_at': datetime.datetime.now(datetime.timezone.utc),
                                        'full_text': full_text,
                                        'favorite_count': favorite_count,
                                        'retweet_count': retweet_count,
                                        'conversation_id': conversation_id,
                                        'lang': lang,
                                        'possibly_sensitive': possibly_sensitive,
                                        "company_twitter_username": username
                                    }
                                )
                                if created:
                                    print(
                                        f"Saved tweet {tweet.tweet_id} for ")

                                # Handle symbols
                                entities = legacy.get('entities', {})
                                symbols = entities.get('symbols', [])
                                for symbol_data in symbols:
                                    # check if the symbol already exists
                                    symbol = TweetSymbol.objects.filter(
                                        symbol=symbol_data['text']).first()
                                    if not symbol:
                                        symbol = TweetSymbol.objects.create(
                                            symbol=symbol_data['text'],
                                            created_at=datetime.datetime.now(
                                                datetime.timezone.utc),
                                            times_mentioned=1
                                        )
                                    else:
                                        symbol.times_mentioned += 1
                                        symbol.save()
                                    # Correct way to add to many-to-many relationship
                                    tweet.symbols.add(symbol)

                                # Handle hashtags
                                hashtags = entities.get('hashtags', [])
                                for hashtag_data in hashtags:
                                    # check if the hashtag already exists
                                    hashtag_symbol = TweetSymbol.objects.filter(
                                        symbol="#" + hashtag_data['text']).first()
                                    if not hashtag_symbol:
                                        hashtag_symbol = TweetSymbol.objects.create(
                                            symbol="#" + hashtag_data['text'],
                                            created_at=datetime.datetime.now(
                                                datetime.timezone.utc),
                                            times_mentioned=1
                                        )
                                    else:
                                        hashtag_symbol.times_mentioned += 1
                                        hashtag_symbol.save()
                                    # Correct way to add to many-to-many relationship
                                    tweet.symbols.add(hashtag_symbol)

                return JsonResponse({'status': 'success', 'created': created}, status=status.HTTP_201_CREATED)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)

    def retrieve(self, request, pk=None):
        queryset = Tweet.objects.all().order_by('-created_at')
        Tweet = get_object_or_404(queryset, pk=pk)
        serializer = TweetSerializer(Tweet)
        return JsonResponse(serializer.data)

    def create(self, request):
        serializer = TweetSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)

    def update(self, request, pk=None):
        Tweet = Tweet.objects.get(pk=pk)
        serializer = TweetSerializer(
            instance=Tweet, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)

    def destroy(self, request, pk=None):
        Tweet = Tweet.objects.get(pk=pk)
        Tweet.delete()
        return JsonResponse({'message': 'Tweet deleted successfully!'}, status=204)

    def partial_update(self, request, pk=None):
        Tweet = Tweet.objects.get(pk=pk)
        serializer = TweetSerializer(
            instance=Tweet, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)


class CompanyNewsViewSet(viewsets.ModelViewSet):
    queryset = CompanyNewsAndEvents.objects.all()
    serializer_class = CompanyNewsAndEventsSerializer

    def list(self, request):
        queryset = CompanyNewsAndEvents.objects.all()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return JsonResponse(serializer.data, safe=False)

    @action(detail=False, methods=['get'], url_path='by-company/(?P<company_id>\d+)')
    def list_by_company(self, request, company_id=None):
        """
        This view allows users to get all news and events related to a specific company by company_id.
        """
        if not company_id:
            return Response({"error": "Company ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            company = Company.objects.get(pk=company_id)
        # except Company.DoesNotExist:
        except Exception:
            return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)

        news_and_events = CompanyNewsAndEvents.objects.filter(company=company)
        serializer = self.get_serializer(news_and_events, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = CompanyNewsAndEvents.objects.all()
        companyNews = get_object_or_404(queryset, pk=pk)
        serializer = CompanyNewsAndEventsSerializer(companyNews)
        return JsonResponse(serializer.data)

    def create(self, request):
        serializer = CompanyNewsAndEventsSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)

    def update(self, request, pk=None):
        companyNews = CompanyNewsAndEvents.objects.get(pk=pk)
        serializer = CompanyNewsAndEventsSerializer(
            instance=companyNews, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)

    def destroy(self, request, pk=None):
        companyNews = CompanyNewsAndEvents.objects.get(pk=pk)
        companyNews.delete()
        return JsonResponse({'message': 'News deleted successfully!'}, status=204)

    def partial_update(self, request, pk=None):
        companyNews = CompanyNewsAndEvents.objects.get(pk=pk)
        serializer = CompanyNewsAndEventsSerializer(
            instance=companyNews, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)


class CompanyBlogsViewSet(viewsets.ModelViewSet):
    queryset = CompanyBlog.objects.all()
    serializer_class = CompanyBlogSerializer

    def list(self, request):
        queryset = CompanyBlog.objects.all()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return JsonResponse(serializer.data, safe=False)

    @action(detail=False, methods=['get'], url_path='by-company/(?P<company_id>\d+)')
    def list_by_company(self, request, company_id=None):
        """
        This view allows users to get all news and events related to a specific company by company_id.
        """
        if not company_id:
            return Response({"error": "Company ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            company = Company.objects.get(pk=company_id)
        # except Company.DoesNotExist:
        except Exception:
            return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)

        news_and_events = CompanyBlog.objects.filter(company=company)
        serializer = self.get_serializer(news_and_events, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = CompanyBlog.objects.all()
        companyBlog = get_object_or_404(queryset, pk=pk)
        serializer = CompanyBlogSerializer(companyBlog)
        return JsonResponse(serializer.data)

    def create(self, request):
        serializer = CompanyBlogSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)

    def update(self, request, pk=None):
        companyBlog = CompanyBlog.objects.get(pk=pk)
        serializer = CompanyBlogSerializer(
            instance=companyBlog, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)

    def destroy(self, request, pk=None):
        companyBlog = CompanyBlog.objects.get(pk=pk)
        companyBlog.delete()
        return JsonResponse({'message': 'News deleted successfully!'}, status=204)

    def partial_update(self, request, pk=None):
        companyBlog = CompanyBlog.objects.get(pk=pk)
        serializer = CompanyBlogSerializer(
            instance=companyBlog, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)


class CompanyProductViewSet(viewsets.ModelViewSet):
    queryset = CompanyProducts.objects.all()
    serializer_class = CompanyProductSerializer

    def list(self, request):
            queryset = CompanyProducts.objects.all()
            page = self.paginate_queryset(queryset)
            total_products = queryset.count()
            total_ai_products = queryset.filter(product_type='AI').count()
            total_badges = queryset.values('badge').distinct().count()
            
            response_data = {
                'total_products': total_products,
                'total_ai_products': total_ai_products,
                'total_badges': total_badges,
            }

            if page is not None:
                serializer = self.get_serializer(page, many=True)
                response_data['results'] = serializer.data
                return self.get_paginated_response(response_data)

            serializer = self.get_serializer(queryset, many=True)
            response_data['results'] = serializer.data
            return Response(response_data)

    @action(detail=False, methods=['get'], url_path='by-company/(?P<company_id>\d+)')
    def list_by_company(self, request, company_id=None):
        """
        This view allows users to get all news and events related to a specific company by company_id.
        """
        if not company_id:
            return Response({"error": "Company ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            company = Company.objects.get(pk=company_id)
        # except Company.DoesNotExist:
        except Exception:
            return Response({"error": "Company not found"}, status=status.HTTP_404_NOT_FOUND)

        news_and_events = CompanyProducts.objects.filter(company=company)
        serializer = self.get_serializer(news_and_events, many=True)
        return Response(serializer.data)

    def retrieve(self, request, pk=None):
        queryset = CompanyProducts.objects.all()
        companyProduct = get_object_or_404(queryset, pk=pk)
        serializer = CompanyProductSerializer(companyProduct)
        return JsonResponse(serializer.data)

    def create(self, request):
        serializer = CompanyProductSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)

    def update(self, request, pk=None):
        companyProduct = CompanyProducts.objects.get(pk=pk)
        serializer = CompanyProductSerializer(
            instance=companyProduct, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)

    def destroy(self, request, pk=None):
        companyProduct = CompanyProducts.objects.get(pk=pk)
        companyProduct.delete()
        return JsonResponse({'message': 'News deleted successfully!'}, status=204)

    def partial_update(self, request, pk=None):
        companyProduct = CompanyProducts.objects.get(pk=pk)
        serializer = CompanyProductSerializer(
            instance=companyProduct, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse


class LocationViewSet(viewsets.ModelViewSet):
    queryset = Location.objects.all()
    serializer_class = LocationSerializer

    def list(self, request, company_id=None):
        queryset = Location.objects.all()
        if company_id:
            queryset = queryset.filter(company=company_id)
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return JsonResponse(serializer.data, safe=False)

    def retrieve(self, request, pk=None):
        queryset = Location.objects.all()
        location = get_object_or_404(queryset, pk=pk)
        serializer = LocationSerializer(location)
        return JsonResponse(serializer.data)

    def create(self, request):
        serializer = LocationSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)

    def update(self, request, pk=None):
        location = Location.objects.get(pk=pk)
        serializer = LocationSerializer(instance=location, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)

    def destroy(self, request, pk=None):
        location = Location.objects.get(pk=pk)
        location.delete()
        return JsonResponse({'message': 'Location deleted successfully!'}, status=204)

    def partial_update(self, request, pk=None):
        location = Location.objects.get(pk=pk)
        serializer = LocationSerializer(
            instance=location, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)


class UserProfileViewSet(viewsets.ModelViewSet):
    queryset = UserProfile.objects.all()
    serializer_class = UserProfileSerializer

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return JsonResponse(serializer.data, safe=False)

    def retrieve(self, request, pk=None, *args, **kwargs):
        queryset = self.get_queryset()
        user_profile = get_object_or_404(queryset, pk=pk)
        serializer = self.get_serializer(user_profile)
        return JsonResponse(serializer.data)

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            self.perform_create(serializer)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def update(self, request, pk=None, *args, **kwargs):
        user_profile = get_object_or_404(UserProfile, pk=pk)
        serializer = self.get_serializer(user_profile, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return JsonResponse(serializer.data)
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def destroy(self, request, pk=None, *args, **kwargs):
        user_profile = get_object_or_404(UserProfile, pk=pk)
        user_profile.delete()
        return JsonResponse({'message': 'User profile deleted successfully!'}, status=status.HTTP_204_NO_CONTENT)

    @action(detail=False, methods=['post'], url_path='create-from-json')
    def create_from_json(self, request):
        try:
            
            data = request.body

            
            
            
            json_data = json.loads(data)

           
           


            
            with transaction.atomic():
                urn = json_data.get('urn')

                # current_company = json_data.get('currentCompany')
                
                current_company = json_data.get('position')[0]
                print("Current company", current_company)
                company, created = Company.objects.update_or_create(
                    # name=current_company.get('companyName'),
                    linkedin_username=current_company.get('companyUsername'),

                    defaults={
                        'logo_url': current_company.get('companyLogo'),
                        "name": current_company.get('companyName'),
                    }
                )
                print(company)

                existing_employee_url = EmployeeUrl.objects.filter(
                    url= "https://www.linkedin.com/in/"+json_data.get('username')).first()
                print("Reached here")
                
                if not existing_employee_url:
                    
                    pass
                

                user_profile, created = UserProfile.objects.update_or_create(
                    urn=urn,
                    
                    defaults={
                        'first_name': json_data.get('firstName'),
                        'last_name': json_data.get('lastName'),
                        'user_name': json_data.get('username'),
                        'headline': json_data.get('headline'),
                        'public_identifier': json_data.get('publicIdentifier'),
                        'profile_pic': json_data.get('profilePicture'),
                        "employee_url": existing_employee_url,
                        "employee_data_json":json_data,
                        "current_company": company,
                        
                    }
                )

                # Handle nested addresses
                addresses_data = json_data.get('addresses', [])

                if addresses_data:
                    for address_data in addresses_data:
                        Address.objects.update_or_create(
                            user=user_profile,
                            full_address=address_data.get('full_address'),
                            defaults={
                                'country': address_data.get('country'),
                                'city': address_data.get('city')
                            }
                        )

                print("Reached here")

                # Handle nested experiences
                experiences_data = json_data.get('position', [])
                if experiences_data:
                    try:
                        for experience_data in experiences_data:
                            # check if company already exists
                            company, created = Company.objects.update_or_create(
                                # name=experience_data.get('companyName'),
                                linkedin_username=current_company.get('companyUsername'),
                                defaults={
                                    'logo_url': experience_data.get('companyLogo'),
                                    'linkedin_username': experience_data.get('companyUsername')
                                }
                            )
                            Experience.objects.update_or_create(
                                # user_profile=user_profile,
                                user=user_profile,
                                title=experience_data.get('title'),
                                defaults={
                                    'company': company,
                                    'description': experience_data.get('description'),
                                    'location': experience_data.get('location'),
                                    'start': linkedindate_to_iso_date(experience_data.get('start')),
                                    'end': linkedindate_to_iso_date(experience_data.get('end')),
                                    'employment_type': experience_data.get('employmentType')
                                }
                            )
                    except Exception as e:
                        print(e)

                skills_data = json_data.get('skills', [])
                if skills_data:
                    for skill_data in skills_data:
                        skill_name = skill_data.get('name')
                        # get or create skill
                        existing_skill = Skills.objects.filter(
                            name=skill_name).first()
                        if not existing_skill:
                            skill, created = Skills.objects.update_or_create(
                                name=skill_name,
                                defaults={
                                    'times_mentioned': 1
                                }
                            )
                            # Link the skill to the user profile
                            user_profile.skills.add(skill)
                        else:
                            existing_skill.times_mentioned += 1
                            existing_skill.save()
                            user_profile.skills.add(existing_skill)

                languages_data = json_data.get('languages', [])
                if languages_data:
                    for language_data in languages_data:
                        language_name = language_data.get('name')
                        existing_language = Language.objects.filter(
                            name=language_name).first()
                        if not existing_language:
                            if language_name:  # Ensure there is a name to avoid creating unnamed language entries
                                language, created = Language.objects.update_or_create(
                                    name=language_name,  # This is used as the lookup field
                                    defaults={
                                        'times_mentioned': 1
                                        
                                    }
                                )
                                # Link the language to the user profile
                                user_profile.languages.add(language)
                        else:
                            existing_language.times_mentioned += 1
                            existing_language.save()
                            user_profile.languages.add(existing_language)
                # Handle nested education
                educations_data = json_data.get('educations', [])
                if educations_data:
                    for education_data in educations_data:
   
                        
                            
                        Education.objects.update_or_create(
                            user=user_profile,
                            schoolName=education_data.get('schoolName'),
                            defaults={
                                'field_of_study': education_data.get('fieldOfStudy'),
                                'degree': education_data.get('degree'),
                                'start': linkedindate_to_iso_date(education_data.get('start')),
                                'end': linkedindate_to_iso_date(education_data.get('end')),
                                'description': education_data.get('description')
                            }
                        )

                volunteer_and_awards_data = json_data.get('volunteering', [])
                if volunteer_and_awards_data:
                    for volunteer_and_awards in volunteer_and_awards_data:
                        VolunteerAndAwards.objects.update_or_create(
                            user=user_profile,
                            title=volunteer_and_awards.get('title'),
                            defaults={
                                'company_link': volunteer_and_awards.get('companyLink'),
                                'start': linkedindate_to_iso_date(volunteer_and_awards.get('start')),
                                'end': linkedindate_to_iso_date(volunteer_and_awards.get('end')),
                                'company_name': volunteer_and_awards.get('companyName'),
                            }
                        )

                license_and_certifications_data = json_data.get(
                    'certifications', [])
                if license_and_certifications_data:
                    for license_and_certifications in license_and_certifications_data:
                        LicenseAndCertifications.objects.update_or_create(
                            user=user_profile,
                            name=license_and_certifications.get('name'),
                            defaults={
                                'authority': license_and_certifications.get('authority'),
                                'start': linkedindate_to_iso_date(license_and_certifications.get('start')),
                                'end': linkedindate_to_iso_date(license_and_certifications.get('end')),

                            }
                        )

                honors_and_awards_data = json_data.get('honors', [])
                if honors_and_awards_data:
                    for honors_and_awards in honors_and_awards_data:
                        HonorAndAwards.objects.update_or_create(
                            user=user_profile,
                            title=honors_and_awards.get('title'),
                            defaults={
                                'issuer': honors_and_awards.get('issuer'),
                                'description': honors_and_awards.get('description')
                            }
                        )

                courses_data = json_data.get('courses', [])
                if courses_data:
                    for course_data in courses_data:
                        Courses.objects.update_or_create(
                            user=user_profile,
                            name=course_data.get('name'),
                            defaults={
                                'number': course_data.get('number'),
                            }
                        )

                projects_data_container = json_data.get('projects', [])
                projects_data = projects_data_container.get('items', [])
                if projects_data:
                    print(projects_data)
                    for project_data in projects_data:
                        Projects.objects.update_or_create(
                            user=user_profile,
                            title=project_data.get('title'),
                            defaults={
                                'description': project_data.get('description'),
                                'start': linkedindate_to_iso_date(project_data.get('start')),
                                'end': linkedindate_to_iso_date(project_data.get('end')),
                            }
                        )

                return JsonResponse({'status': 'success', 'created': created}, status=status.HTTP_201_CREATED)

        except Exception as e:

            return JsonResponse({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class EmployeeUrlViewSet(viewsets.ModelViewSet):
    queryset = EmployeeUrl.objects.all()
    serializer_class = EmployeeUrlSerializer

    def list(self, request):
        queryset = EmployeeUrl.objects.all()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)

        serializer = self.get_serializer(queryset, many=True)
        return JsonResponse(serializer.data, safe=False)

    def retrieve(self, request, pk=None):
        queryset = EmployeeUrl.objects.all()
        employeeUrl = get_object_or_404(queryset, pk=pk)
        serializer = EmployeeUrlSerializer(employeeUrl)
        return JsonResponse(serializer.data)

    def create(self, request):
        serializer = EmployeeUrlSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)

    def update(self, request, pk=None):
        employeeUrl = EmployeeUrl.objects.get(pk=pk)
        serializer = EmployeeUrlSerializer(
            instance=employeeUrl, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)

    def destroy(self, request, pk=None):
        employeeUrl = EmployeeUrl.objects.get(pk=pk)
        employeeUrl.delete()
        return JsonResponse({'message': 'employeeUrl deleted successfully!'}, status=204)

    def partial_update(self, request, pk=None):
        employeeUrl = EmployeeUrl.objects.get(pk=pk)
        serializer = EmployeeUrlSerializer(
            instance=employeeUrl, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)

class SkillsViewSet(viewsets.ModelViewSet):
    queryset = Skills.objects.all()
    serializer_class = SkillsSerializer

class EducationViewSet(viewsets.ModelViewSet):
    queryset = Education.objects.all()
    serializer_class = EducationSerializer

class ExperienceViewSet(viewsets.ModelViewSet):
    queryset = Experience.objects.all()
    serializer_class = ExperienceSerializer
    
class CourseViewSet(viewsets.ModelViewSet):
    queryset = Courses.objects.all()
    serializer_class = CourseSerializer

class LicenseAndCertificationViewSet(viewsets.ModelViewSet):
    queryset = LicenseAndCertifications.objects.all()
    serializer_class = LicenseAndCertificationsSerializer    