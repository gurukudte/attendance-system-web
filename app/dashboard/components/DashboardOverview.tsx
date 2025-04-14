export function DashboardOverview() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          Total Employees
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
          47
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          Active Shifts
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
          12
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          Late Arrivals
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
          3
        </p>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
        <h3 className="text-gray-500 dark:text-gray-400 text-sm font-medium">
          Avg. Hours
        </h3>
        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-2">
          7.5
        </p>
      </div>
    </div>
  );
}
