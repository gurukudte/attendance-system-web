export function NavItem({
  icon,
  label,
  active,
  onClick,
  sidebarOpen,
}: {
  icon: React.ReactNode;
  label: string;
  active: boolean;
  onClick: () => void;
  sidebarOpen: boolean;
}) {
  return (
    <li>
      <button
        onClick={onClick}
        className={`flex items-center w-full p-2 rounded-lg transition-colors ${
          active
            ? "bg-blue-50 text-blue-600 dark:bg-gray-700 dark:text-blue-400"
            : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
        }`}
      >
        <span className="flex items-center justify-center">{icon}</span>
        {sidebarOpen && <span className="ml-3">{label}</span>}
      </button>
    </li>
  );
}
