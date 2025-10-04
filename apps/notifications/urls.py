from django.urls import path
from . import views

urlpatterns = [
    # Notification endpoints will be added here
    path('', views.NotificationListView.as_view(), name='notification-list'),
    path('<int:pk>/', views.NotificationDetailView.as_view(), name='notification-detail'),
    path('mark-read/', views.MarkNotificationsReadView.as_view(), name='mark-notifications-read'),
    path('preferences/', views.NotificationPreferenceView.as_view(), name='notification-preferences'),
    path('templates/', views.NotificationTemplateListView.as_view(), name='notification-template-list'),
    path('templates/<int:pk>/', views.NotificationTemplateDetailView.as_view(), name='notification-template-detail'),
    path('digests/', views.NotificationDigestListView.as_view(), name='notification-digest-list'),
]
