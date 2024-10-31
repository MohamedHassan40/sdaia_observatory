from django.shortcuts import render
from rest_framework import viewsets
from .models import Source, Article
from .serializers import SourceSerializer, ArticleSerializer
from django.http import JsonResponse
from django.shortcuts import get_object_or_404


class SourceViewSet(viewsets.ModelViewSet):
    queryset = Source.objects.all()
    serializer_class = SourceSerializer

    def list(self, request):
        queryset = Source.objects.all()
        serializer = SourceSerializer(queryset, many=True)
        return JsonResponse(serializer.data, safe=False)

    def retrieve(self, request, pk=None):
        queryset = Source.objects.all()
        source = get_object_or_404(queryset, pk=pk)
        serializer = SourceSerializer(source)
        return JsonResponse(serializer.data)

    def create(self, request):
        serializer = SourceSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)

    def update(self, request, pk=None):
        source = Source.objects.get(pk=pk)
        serializer = SourceSerializer(instance=source, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)

    def destroy(self, request, pk=None):
        source = Source.objects.get(pk=pk)
        source.delete()
        return JsonResponse({'message': 'Source deleted successfully!'}, status=204)

    def partial_update(self, request, pk=None):
        source = Source.objects.get(pk=pk)
        serializer = SourceSerializer(
            instance=source, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)


class ArticleViewSet(viewsets.ModelViewSet):
    queryset = Article.objects.all()
    serializer_class = ArticleSerializer

    def list(self, request):

        queryset = Article.objects.all()
        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            return self.get_paginated_response(serializer.data)
        serializer = self.get_serializer(queryset, many=True)
        return JsonResponse(serializer.data, safe=False)


    def retrieve(self, request, pk=None):
        queryset = Article.objects.all()
        article = get_object_or_404(queryset, pk=pk)
        serializer = ArticleSerializer(article)
        return JsonResponse(serializer.data)

    def create(self, request):
        serializer = ArticleSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)

    def update(self, request, pk=None):
        article = Article.objects.get(pk=pk)
        serializer = ArticleSerializer(instance=article, data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)

    def destroy(self, request, pk=None):
        article = Article.objects.get(pk=pk)
        article.delete()
        return JsonResponse({'message': 'Article deleted successfully!'}, status=204)

    def partial_update(self, request, pk=None):
        article = Article.objects.get(pk=pk)
        serializer = ArticleSerializer(
            instance=article, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return JsonResponse(serializer.data)


# Create your views here.
