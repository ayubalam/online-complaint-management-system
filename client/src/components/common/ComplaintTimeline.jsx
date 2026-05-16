const ComplaintTimeline = ({
  timeline,
}) => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-bold mb-6">
        Activity Timeline
      </h2>

      <div className="space-y-6 border-l-4 border-indigo-500 pl-6">
        {timeline.map(
          (item, index) => (
            <div
              key={index}
              className="relative"
            >
              {/* Dot */}
              <div className="absolute -left-9 top-1 w-4 h-4 bg-indigo-600 rounded-full"></div>

              {/* Content */}
              <div className="bg-gray-50 p-4 rounded-xl shadow-sm">
                <p className="font-medium">
                  {item.message}
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  {new Date(
                    item.createdAt
                  ).toLocaleString()}
                </p>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default ComplaintTimeline;