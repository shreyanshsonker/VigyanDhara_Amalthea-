from rest_framework import generics
from rest_framework.permissions import IsAuthenticated
from .models import ExpenseAnalytics, CategoryAnalytics, EmployeeAnalytics, ApprovalAnalytics, Report, DashboardWidget, Alert
from .serializers import ExpenseAnalyticsSerializer, CategoryAnalyticsSerializer, EmployeeAnalyticsSerializer, ApprovalAnalyticsSerializer, ReportSerializer, DashboardWidgetSerializer, AlertSerializer


class ExpenseAnalyticsView(generics.ListAPIView):
    queryset = ExpenseAnalytics.objects.all()
    serializer_class = ExpenseAnalyticsSerializer
    permission_classes = [IsAuthenticated]


class CategoryAnalyticsView(generics.ListAPIView):
    queryset = CategoryAnalytics.objects.all()
    serializer_class = CategoryAnalyticsSerializer
    permission_classes = [IsAuthenticated]


class EmployeeAnalyticsView(generics.ListAPIView):
    queryset = EmployeeAnalytics.objects.all()
    serializer_class = EmployeeAnalyticsSerializer
    permission_classes = [IsAuthenticated]


class ApprovalAnalyticsView(generics.ListAPIView):
    queryset = ApprovalAnalytics.objects.all()
    serializer_class = ApprovalAnalyticsSerializer
    permission_classes = [IsAuthenticated]


class ReportListView(generics.ListCreateAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]


class ReportDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]


class ReportGenerateView(generics.CreateAPIView):
    queryset = Report.objects.all()
    serializer_class = ReportSerializer
    permission_classes = [IsAuthenticated]


class DashboardView(generics.ListAPIView):
    queryset = ExpenseAnalytics.objects.all()
    serializer_class = ExpenseAnalyticsSerializer
    permission_classes = [IsAuthenticated]


class DashboardWidgetListView(generics.ListCreateAPIView):
    queryset = DashboardWidget.objects.all()
    serializer_class = DashboardWidgetSerializer
    permission_classes = [IsAuthenticated]


class DashboardWidgetDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = DashboardWidget.objects.all()
    serializer_class = DashboardWidgetSerializer
    permission_classes = [IsAuthenticated]


class AlertListView(generics.ListCreateAPIView):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer
    permission_classes = [IsAuthenticated]


class AlertDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer
    permission_classes = [IsAuthenticated]
