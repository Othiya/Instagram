import { useState } from 'react';

export default function RepostModal({ post, existingCaption, onConfirm, onDelete, onCancel }) {
  const [caption, setCaption] = useState(existingCaption || '');

  return (
    <div className="ig-modal-overlay" onClick={e => e.target === e.currentTarget && onCancel()}>
      <div className="ig-repost-sheet">

        {/* Close button */}
        <button className="ig-rs-close" onClick={onCancel}>✕</button>

        <h2 className="ig-sheet-title">Add a caption</h2>

        {/* Post preview */}
        <div className="ig-repost-preview">
          <img src={post.imageUrl} alt="preview" className="ig-repost-preview-img"/>
          <div className="ig-repost-preview-meta">
            <span className="ig-repost-preview-author">@{post.author}</span>
            <span className="ig-repost-preview-caption">{post.caption}</span>
          </div>
        </div>

        {/* Caption textarea */}
        <textarea
          className="ig-repost-textarea"
          placeholder="Write something about this post…"
          value={caption}
          onChange={e => setCaption(e.target.value)}
          maxLength={200}
          autoFocus
        />

        {/* Done / Cancel */}
        <div className="ig-sheet-actions">
          <button className="ig-sheet-cancel" onClick={onCancel}>Cancel</button>
          <button className="ig-sheet-confirm" onClick={() => onConfirm(caption)}>
            Done
          </button>
        </div>

        {/* Delete repost link */}
        <button className="ig-rs-delete-link" onClick={onDelete}>
          Remove repost
        </button>

      </div>
    </div>
  );
}