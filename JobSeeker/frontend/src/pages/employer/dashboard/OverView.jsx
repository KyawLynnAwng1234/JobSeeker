import { Briefcase, FileText, CheckCircle, AlertTriangle } from "lucide-react";

export default function Overview() {
  const stats = [
    { title: "Total Job", value: 100, icon: <Briefcase />, color: "border-blue-500" },
    { title: "Applications", value: 150, icon: <FileText />, color: "border-blue-500" },
    { title: "Active Jobs", value: 80, icon: <CheckCircle />, color: "border-green-500" },
    { title: "Expired Jobs", value: 20, icon: <AlertTriangle />, color: "border-red-500" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((item, idx) => (
          <div key={idx} className="bg-white p-6 rounded-xl shadow-md flex flex-col items-center">
            <div className={`p-2 rounded-md border ${item.color} mb-2`}>
              {item.icon}
            </div>
            <h2 className="font-semibold">{item.title}</h2>
            <p className="text-2xl font-bold">{item.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
