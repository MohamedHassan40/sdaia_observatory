from rest_framework import serializers
from rest_framework import viewsets
from .models import Source, Article


class ArticleSerializer(serializers.ModelSerializer):
    source = serializers.PrimaryKeyRelatedField(
        queryset=Source.objects.all(), required=False)
    class Meta:
        model = Article
        fields = '__all__'


class SourceSerializer(serializers.ModelSerializer):
    articles = ArticleSerializer(many=True, read_only=True)

    class Meta:
        model = Source
        fields = '__all__'

