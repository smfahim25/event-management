import { useState, useEffect, useCallback } from "react";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { usePayoutStore } from "../../store/PayoutStore";
import {
  FiArrowDown,
  FiCreditCard,
  FiDollarSign,
  FiRefreshCw,
} from "react-icons/fi";

const AdminTransactionsTable = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPage: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });
  const [processingId, setProcessingId] = useState(null);

  const { getAllPayouts, updatePayoutStatus } = usePayoutStore();

  const fetchTransactions = useCallback(
    async (page = 1, search = "", status = "all") => {
      setLoading(true);
      try {
        const result = await getAllPayouts(
          page,
          pagination.limit,
          search,
          status
        );

        if (result.error) {
          console.error("Error fetching transactions:", result.error);
          setTransactions([]);
          setPagination((prev) => ({
            ...prev,
            total: 0,
            totalPage: 0,
            hasNextPage: false,
            hasPreviousPage: false,
          }));
          return;
        }

        setTransactions(result.data.data || []);
        setPagination({
          page: result.data?.meta.page || page,
          limit: result.data?.meta.limit || pagination.limit,
          total: result.data?.meta.total || 0,
          totalPage: result.data?.meta.totalPage || 0,
          hasNextPage: result.data?.meta.hasNextPage || false,
          hasPreviousPage: result.data?.meta.hasPreviousPage || false,
        });
      } catch (error) {
        console.error("Error fetching transactions:", error);
        setTransactions([]);
        setPagination((prev) => ({
          ...prev,
          total: 0,
          totalPage: 0,
          hasNextPage: false,
          hasPreviousPage: false,
        }));
      } finally {
        setLoading(false);
      }
    },
    [getAllPayouts, pagination.limit]
  );

  useEffect(() => {
    fetchTransactions(currentPage, searchTerm, statusFilter);
  }, [currentPage, searchTerm, statusFilter, fetchTransactions]);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusClass = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "failed":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  function getTypeIcon(type) {
    switch (type) {
      case "payment":
        return <FiDollarSign className="w-4 h-4" />;
      case "refund":
        return <FiArrowDown className="w-4 h-4" />;
      case "transfer":
        return <FiRefreshCw className="w-4 h-4" />;
      default:
        return <FiCreditCard className="w-4 h-4" />;
    }
  }

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-600" />;
      case "pending":
        return <Clock className="h-4 w-4 text-yellow-600" />;
      case "failed":
        return <XCircle className="h-4 w-4 text-red-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  const handleStatusFilter = (e) => {
    setStatusFilter(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleStatusUpdate = async (id, status) => {
    setProcessingId(id);
    try {
      const result = await updatePayoutStatus(id, status);
      if (result.error) {
        console.error("Error updating status:", result.error);
        return;
      }
      fetchTransactions(currentPage, searchTerm, statusFilter);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setProcessingId(null);
    }
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const { totalPage } = pagination;

    buttons.push(
      <button
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={!pagination.hasPreviousPage}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronsLeft className="h-4 w-4" />
      </button>
    );

    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={!pagination.hasPreviousPage}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronLeft className="h-4 w-4" />
      </button>
    );

    for (
      let i = Math.max(1, currentPage - 2);
      i <= Math.min(totalPage, currentPage + 2);
      i++
    ) {
      buttons.push(
        <button
          key={i}
          onClick={() => handlePageChange(i)}
          className={`px-3 py-2 rounded-lg border ${
            i === currentPage
              ? "bg-violet-600 text-white border-violet-600"
              : "border-gray-300 hover:bg-gray-50"
          }`}
        >
          {i}
        </button>
      );
    }

    buttons.push(
      <button
        key="next"
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={!pagination.hasNextPage}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronRight className="h-4 w-4" />
      </button>
    );

    buttons.push(
      <button
        key="last"
        onClick={() => handlePageChange(totalPage)}
        disabled={!pagination.hasNextPage}
        className="p-2 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <ChevronsRight className="h-4 w-4" />
      </button>
    );

    return buttons;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Transaction Management
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor and manage all system transactions
          </p>
        </div>

        {/* Filters and Search */}
        <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <input
                  type="text"
                  placeholder="Search by transaction ID or type..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <div className="md:w-48">
              <div className="relative">
                <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <select
                  value={statusFilter}
                  onChange={handleStatusFilter}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent appearance-none"
                >
                  <option value="all">All Statuses</option>
                  <option value="completed">Completed</option>
                  <option value="pending">Pending</option>
                  <option value="failed">Failed</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6">
            <h2 className="text-xl font-semibold text-black">Transactions</h2>
            <p className="text-gray-500 text-sm">
              Complete transaction history
            </p>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-violet-600"></div>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-gray-50">
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Transaction ID
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Amount
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Date
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Type
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {transactions.length > 0 ? (
                      transactions.map((transaction) => (
                        <tr
                          key={transaction._id}
                          className="hover:bg-gray-50 transition-colors duration-150"
                        >
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-medium text-gray-900">
                            {transaction._id}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm font-semibold text-gray-900">
                            ${transaction.amount?.toFixed(2)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {formatDate(transaction.updatedAt)}
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm">
                            <div className="flex items-center">
                              {getStatusIcon(transaction.status)}
                              <span
                                className={`ml-2 inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusClass(
                                  transaction.status
                                )}`}
                              >
                                {transaction.status}
                              </span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              {getTypeIcon(transaction.type)}
                              <span className="ml-2 capitalize">
                                {transaction.type}
                              </span>
                            </div>
                          </td>
                          <td className="whitespace-nowrap px-6 py-4 text-sm text-gray-500">
                            {transaction.status?.toLowerCase() === "pending" ? (
                              <div className="flex space-x-2">
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(
                                      transaction._id,
                                      "completed"
                                    )
                                  }
                                  disabled={processingId === transaction._id}
                                  className="px-3 py-1 bg-green-600 text-white text-xs rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {processingId === transaction._id
                                    ? "Processing..."
                                    : "Approve"}
                                </button>
                                <button
                                  onClick={() =>
                                    handleStatusUpdate(
                                      transaction._id,
                                      "failed"
                                    )
                                  }
                                  disabled={processingId === transaction._id}
                                  className="px-3 py-1 bg-red-600 text-white text-xs rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  {processingId === transaction._id
                                    ? "Processing..."
                                    : "Reject"}
                                </button>
                              </div>
                            ) : (
                              <span className="text-gray-400">No actions</span>
                            )}
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td
                          colSpan="6"
                          className="px-6 py-12 text-center text-gray-500"
                        >
                          <div className="flex flex-col items-center">
                            <DollarSign className="h-12 w-12 text-gray-300 mb-4" />
                            <p className="text-lg font-medium">
                              No transactions found
                            </p>
                            <p className="text-sm">
                              Try adjusting your search or filter criteria
                            </p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPage > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200">
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-700">
                      Showing {(currentPage - 1) * pagination.limit + 1} to{" "}
                      {Math.min(
                        currentPage * pagination.limit,
                        pagination.total
                      )}{" "}
                      of {pagination.total} results
                    </div>
                    <div className="flex items-center space-x-2">
                      {renderPaginationButtons()}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminTransactionsTable;
