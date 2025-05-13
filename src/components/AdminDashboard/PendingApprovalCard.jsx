export default function PendingApprovalCard({ title, count, icon, onClick }) {
  return (
    <div
      className="bg-white overflow-hidden shadow rounded-lg cursor-pointer hover:bg-gray-50 transition-colors duration-200"
      onClick={onClick}
    >
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
            {icon}
          </div>
          <div className="ml-5">
            <div className="text-xl font-medium text-gray-900">{count}</div>
            <div className="text-sm text-gray-500">{title}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
