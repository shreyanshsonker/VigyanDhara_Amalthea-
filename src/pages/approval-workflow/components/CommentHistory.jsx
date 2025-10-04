import React, { useState } from 'react';
import Icon from '../../../components/AppIcon';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/Button';

const CommentHistory = ({ comments, onAddComment }) => {
  const [newComment, setNewComment] = useState('');
  const [isAddingComment, setIsAddingComment] = useState(false);

  const formatDate = (date) => {
    return new Date(date)?.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getCommentTypeIcon = (type) => {
    switch (type) {
      case 'approval':
        return 'CheckCircle';
      case 'rejection':
        return 'XCircle';
      case 'request':
        return 'MessageCircle';
      case 'system':
        return 'Info';
      default:
        return 'MessageCircle';
    }
  };

  const getCommentTypeColor = (type) => {
    switch (type) {
      case 'approval':
        return 'text-success';
      case 'rejection':
        return 'text-error';
      case 'request':
        return 'text-primary';
      case 'system':
        return 'text-muted-foreground';
      default:
        return 'text-primary';
    }
  };

  const handleAddComment = () => {
    if (newComment?.trim()) {
      onAddComment({
        id: Date.now(),
        author: {
          name: 'Current User',
          avatar: 'https://randomuser.me/api/portraits/men/1.jpg',
          role: 'Manager'
        },
        content: newComment?.trim(),
        type: 'request',
        timestamp: new Date()?.toISOString()
      });
      setNewComment('');
      setIsAddingComment(false);
    }
  };

  return (
    <div className="bg-card border border-border rounded-lg p-6">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-card-foreground">Comment History</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setIsAddingComment(!isAddingComment)}
          iconName="Plus"
          iconPosition="left"
        >
          Add Comment
        </Button>
      </div>
      {/* Add Comment Form */}
      {isAddingComment && (
        <div className="mb-6 p-4 bg-muted rounded-lg">
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e?.target?.value)}
            placeholder="Add your comment..."
            className="w-full p-3 border border-border rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            rows={3}
          />
          <div className="flex items-center justify-end space-x-2 mt-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setIsAddingComment(false);
                setNewComment('');
              }}
            >
              Cancel
            </Button>
            <Button
              variant="default"
              size="sm"
              onClick={handleAddComment}
              disabled={!newComment?.trim()}
            >
              Add Comment
            </Button>
          </div>
        </div>
      )}
      {/* Comments List */}
      <div className="space-y-4">
        {comments?.length === 0 ? (
          <div className="text-center py-8">
            <Icon name="MessageCircle" size={48} className="text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">No comments yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Comments and feedback will appear here
            </p>
          </div>
        ) : (
          comments?.map((comment) => (
            <div key={comment?.id} className="flex items-start space-x-3 p-4 bg-muted/50 rounded-lg">
              <Image
                src={comment?.author?.avatar}
                alt={comment?.author?.name}
                className="w-10 h-10 rounded-full"
              />
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-2">
                  <span className="font-medium text-card-foreground">
                    {comment?.author?.name}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {comment?.author?.role}
                  </span>
                  <div className="w-1 h-1 bg-muted-foreground rounded-full" />
                  <span className="text-xs text-muted-foreground">
                    {formatDate(comment?.timestamp)}
                  </span>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Icon 
                    name={getCommentTypeIcon(comment?.type)} 
                    size={16} 
                    className={`mt-0.5 ${getCommentTypeColor(comment?.type)}`} 
                  />
                  <p className="text-sm text-card-foreground leading-relaxed">
                    {comment?.content}
                  </p>
                </div>

                {/* Attachments */}
                {comment?.attachments && comment?.attachments?.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {comment?.attachments?.map((attachment, index) => (
                      <div key={index} className="flex items-center space-x-2 bg-card border border-border rounded-lg p-2">
                        <Icon name="Paperclip" size={14} className="text-muted-foreground" />
                        <span className="text-xs text-card-foreground">{attachment?.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
      {/* Quick Response Templates */}
      {isAddingComment && (
        <div className="mt-4 pt-4 border-t border-border">
          <p className="text-sm font-medium text-muted-foreground mb-2">Quick Responses:</p>
          <div className="flex flex-wrap gap-2">
            {[
              "Please provide additional documentation",
              "Approved with conditions",
              "Requires manager review",
              "Receipt unclear, please resubmit"
            ]?.map((template, index) => (
              <Button
                key={index}
                variant="ghost"
                size="sm"
                onClick={() => setNewComment(template)}
                className="text-xs"
              >
                {template}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CommentHistory;