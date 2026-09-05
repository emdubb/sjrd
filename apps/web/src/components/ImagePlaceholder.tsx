interface ImagePlaceholderProps {
  label: string;
  aspectRatio?: string;
}

export default function ImagePlaceholder({ label, aspectRatio = '16 / 9' }: ImagePlaceholderProps) {
  return (
    <div className="placeholder" role="img" aria-label={label}>
      <span>{label}</span>

      <style jsx>{`
        .placeholder {
          aspect-ratio: ${aspectRatio};
          width: 100%;
          background: repeating-linear-gradient(
            135deg,
            #f4f6f8,
            #f4f6f8 10px,
            #e9edf1 10px,
            #e9edf1 20px
          );
          border: 2px dashed #b9c2cc;
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          text-align: center;
          padding: 1rem;
        }

        span {
          color: #0b233f;
          font-size: 0.95rem;
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}
