from rest_framework import serializers
from .models import ExpenseAnalytics, CategoryAnalytics, EmployeeAnalytics, ApprovalAnalytics, Report, DashboardWidget, Alert


class ExpenseAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ExpenseAnalytics
        fields = '__all__'


class CategoryAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryAnalytics
        fields = '__all__'


class EmployeeAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = EmployeeAnalytics
        fields = '__all__'


class ApprovalAnalyticsSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApprovalAnalytics
        fields = '__all__'


class ReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = Report
        fields = '__all__'


class DashboardWidgetSerializer(serializers.ModelSerializer):
    class Meta:
        model = DashboardWidget
        fields = '__all__'


class AlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = Alert
        fields = '__all__'
