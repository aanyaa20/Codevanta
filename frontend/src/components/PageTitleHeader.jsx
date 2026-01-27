function PageTitleHeader({ title, subtitle, rightSlot }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
      <div>
        <h1 className="text-3xl font-bold mb-2 text-slate-900">{title}</h1>
        {subtitle && (
          <p className="text-slate-500 text-lg">
            {subtitle}
          </p>
        )}
      </div>
      
      {rightSlot && (
        <div className="flex-shrink-0">
          {rightSlot}
        </div>
      )}
    </div>
  );
}

export default PageTitleHeader;
