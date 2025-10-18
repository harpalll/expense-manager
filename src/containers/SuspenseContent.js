function SuspenseContent() {
  return (
    <div className="w-full h-screen text-gray-300 dark:text-gray-200 bg-base-100 flex justify-center items-center">
      <span className="loading loading-ball loading-xs"></span>
      <span className="loading loading-ball loading-sm"></span>
      <span className="loading loading-ball loading-md"></span>
      <span className="loading loading-ball loading-xl"></span>
      <span className="loading loading-ball loading-lg"></span>
    </div>
  );
}

export default SuspenseContent;
