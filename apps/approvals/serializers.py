from rest_framework import serializers
from .models import ApprovalWorkflow, ApprovalHistory, BulkApproval, ApprovalTemplate


class ApprovalWorkflowSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApprovalWorkflow
        fields = '__all__'


class ApprovalHistorySerializer(serializers.ModelSerializer):
    class Meta:
        model = ApprovalHistory
        fields = '__all__'


class BulkApprovalSerializer(serializers.ModelSerializer):
    class Meta:
        model = BulkApproval
        fields = '__all__'


class ApprovalTemplateSerializer(serializers.ModelSerializer):
    class Meta:
        model = ApprovalTemplate
        fields = '__all__'
