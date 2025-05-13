export default function StatsCard({
  title,
  value,
  icon,
  footer,
  footerColor = "text-indigo-600",
}) {
  return (
    <div className="bg-white overflow-hidden shadow rounded-lg transition-all duration-200 hover:shadow-md">
      <div className="p-5">
        <div className="flex items-center">
          <div className="flex-shrink-0">{icon}</div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-500 truncate">
                {title}
              </dt>
              <dd>
                <div className="text-lg font-medium text-gray-900">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
      </div>
      <div className="bg-gray-50 px-5 py-3">
        <div className="text-sm">
          {typeof footer === "string" ? (
            <span className={`font-medium ${footerColor}`}>{footer}</span>
          ) : (
            footer
          )}
        </div>
      </div>
    </div>
  );
}
