import { useState } from 'react';
import api from '../api/axios';

const bannedWords = ['hate', 'kill', 'slur1', 'slur2'];

export default function CommentItem({ comment, postId }) {
  const [showReplyInput, setShowReplyInput] = useState(false);
  const [replies, setReplies] = useState([]);
  const [repliesLoaded, setRepliesLoaded] = useState(false);
  const [showReplies, setShowReplies] = useState(false);
  const [replyCount, setReplyCount] = useState(0);
  const [replyText, setReplyText] = useState('');
  const [warning, setWarning] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleReplies = async () => {
    if (repliesLoaded) {
      setShowReplies(s => !s);
      return;
    }
    setLoading(true);
    try {
      const res = await api.get(`/comments/${postId}/replies/${comment._id}`);
      setReplies(res.data);
      setReplyCount(res.data.length);
      setRepliesLoaded(true);
      setShowReplies(true);
    } catch {
      setShowReplies(true);
    }
    setLoading(false);
  };

  const submitReply = async () => {
    if (!replyText.trim()) return;
    if (bannedWords.some(w => replyText.toLowerCase().includes(w))) {
      setWarning('⚠️ Inappropriate language detected.');
      return;
    }
    setWarning('');
    try {
      const res = await api.post(`/comments/${postId}`, {
        author: 'you',
        text: replyText,
        parentCommentId: comment._id,
      });
      setReplies(prev => [...prev, res.data]);
      setReplyCount(c => c + 1);
    } catch (err) {
      if (err.response?.data?.warning) {
        setWarning(err.response.data.message);
        return;
      }
      setReplies(prev => [...prev, { _id: Date.now().toString(), author: 'you', text: replyText }]);
      setReplyCount(c => c + 1);
    }
    setReplyText('');
    setShowReplyInput(false);
    setShowReplies(true);
    setRepliesLoaded(true);
  };

  const totalReplies = replyCount || replies.length;

  return (
    <div className="ig-comment-thread">
      {/* Main comment */}
      <div className="ig-comment">
        <div className="ig-comment-body">
          <span className="ig-comment-user">{comment.author}</span>
          {comment.text}
        </div>
        <div className="ig-comment-actions">
          {comment.time && <span className="ig-comment-time">{comment.time}</span>}
          <button className="ig-reply-btn" onClick={() => setShowReplyInput(r => !r)}>
            Reply
          </button>
        </div>
      </div>

      {/* View/hide replies toggle */}
      {(totalReplies > 0 || repliesLoaded) && (
        <button className="ig-view-replies-btn" onClick={toggleReplies}>
          <span className="ig-view-replies-line" />
          {loading ? 'Loading…' : showReplies
            ? `Hide replies`
            : `View ${totalReplies} repl${totalReplies === 1 ? 'y' : 'ies'}`}
        </button>
      )}

      {/* Threaded replies */}
      {showReplies && replies.length > 0 && (
        <div className="ig-replies-thread">
          {replies.map(r => (
            <div key={r._id} className="ig-reply-item">
              <div className="ig-reply-avatar">
                <img src={`https://i.pravatar.cc/28?u=${r.author}`} alt={r.author} />
              </div>
              <div className="ig-reply-body">
                <span className="ig-comment-user">{r.author}</span>
                {r.text}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reply input */}
      {showReplyInput && (
        <div className="ig-reply-input-wrap">
          <div className="ig-reply-avatar-sm">
            <img src="https://i.pravatar.cc/28?img=1" alt="you" />
          </div>
          <input
            autoFocus
            value={replyText}
            onChange={e => { setReplyText(e.target.value); setWarning(''); }}
            onKeyDown={e => e.key === 'Enter' && submitReply()}
            placeholder={`Reply to ${comment.author}…`}
          />
          <button className="ig-reply-post-btn" onClick={submitReply} disabled={!replyText.trim()}>
            Post
          </button>
        </div>
      )}

      {warning && (
        <div className="ig-reply-warning">{warning}</div>
      )}
    </div>
  );
}
