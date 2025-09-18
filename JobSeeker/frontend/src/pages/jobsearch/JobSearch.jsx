import React, { useState, useEffect } from "react";
import { MapPin, Briefcase, DollarSign, CalendarDays, Maximize } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { CiMaximize1 } from "react-icons/ci";

export default function JobSearch() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();

  // URL query param မှာ Maximized ရှိမရှိ စစ်ပြီး initial state set
  const query = new URLSearchParams(location.search);
  const initialMaximized = query.get("maximized") === "true";
  const [isMaximized, setIsMaximized] = useState(initialMaximized);

  const jobs = [
    {
      id: 1,
      title: "Project Management",
      subtitle: "Leadership & Interpersonal Skills",
      company: "Mraku U, Rakhine",
      category: "Programme & Project Management",
      salary: "50-60 per month",
      date: "2d ago",
      logo: "/logo.png",
      description: `As a Project Manager, you are responsible for coordinating cross-functional teams 
      to deliver projects on time and within scope. Key duties include client communication, 
      project documentation, risk and issue management, change request handling, and team support. 
      Strong organizational, problem-solving, and stakeholder management skills are essential 
      for successful delivery and maintaining client relationships.`,
      benefits: ["Boosting productivity"],
      skills: ["Good Knowledge and understanding"],
      requirements: [
        "Increased Productivity and Efficiency",
        "Better Work-Life Balance",
        "Reduced Procrastination",
      ],
    },
    {
      id: 2,
      title: "Project Manager",
      subtitle: "Time management",
      company: "Mraku U",
      category: "Programme & Project Management",
      salary: "40-50 per month",
      date: "2d ago",
      logo: "/logo.png",
      description: `Responsible for managing time schedules, deadlines and coordinating meetings.`,
      benefits: ["Efficiency improvement"],
      skills: ["Time management skills"],
      requirements: ["Task prioritization", "Delegation", "Communication"],
    },
  ];

  const [selectedJob, setSelectedJob] = useState(null);

  // ✅ URL မှာ id ရှိတယ်ဆိုရင် အလိုအလျောက် Detail View ပြ
  useEffect(() => {
    if (id) {
      const job = jobs.find((j) => j.id === parseInt(id));
      setSelectedJob(job || null);
    }
  }, [id]);

  // SignIn Page သို့သွားမယ်
  const handleApplyNow = () => {
    navigate("/sign-in");
  };

  const handleMaximizeToggle = () => {
    const newState = !isMaximized;
    setIsMaximized(newState);

    // query param update
    const searchParams = new URLSearchParams(location.search);
    if (newState) {
      searchParams.set("maximized", "true");
    } else {
      searchParams.delete("maximized");
    }
    navigate(`${location.pathname}?${searchParams.toString()}`, {
      replace: true,
    });
  };

  return (
    <>
      {/* Hero Search */}
      <section className="bg-blue-custom py-8 mb-6">
        <div className="w-full px-4 h-[300px]">
          {/* Center contents both vertically and horizontally */}
          <div className="h-full w-full flex items-center justify-center md:relative">
            {/* Grid layout */}
            <div className="grid grid-cols-1 md:grid-cols-6 gap-4 w-full container px-4">
              {/* Keyword input (3 cols) */}
              <div className="md:col-span-3 w-full ">
                <input
                  type="text"
                  placeholder="Enter keywords"
                  className="p-3 h-[60px] border border-[#999] rounded-md bg-[#ffffffcf] text-lg w-full blue-placeholder"
                />
                <p className="absolute top-20 text-[#ffffffcf] text-xl hidden md:block">
                  What
                </p>
              </div>

              {/* Location input (2 cols) */}
              <div className="md:col-span-2 w-full">
                <input
                  type="text"
                  placeholder="Enter location"
                  className="p-3 h-[60px] border border-[#999] rounded-md bg-[#ffffffcf] text-lg w-full blue-placeholder"
                />
                <p className="absolute top-20 text-[#ffffffcf] text-xl hidden md:block">
                  Where
                </p>
              </div>

              {/* Job Search Button (1 col) */}
              <div className="md:col-span-1 w-full">
                <button className="h-[60px] w-full px-5 rounded-md text-lg bg-[#C46210] text-[#ffffffcf] font-semibold hover:bg-[#AB4812] transition">
                  Search
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Count and Filter */}
      {!isMaximized && (
        <div className="container mx-auto pt-8 px-4 grid md:grid-cols-3 gap-6">
          <div className="col-span-1 flex justify-between items-center">
            <span className="border px-3 py-1 rounded-full text-sm">
              100 jobs
            </span>
            <button>
              <span className="text-2xl font-bold">⇵</span>
            </button>
          </div>
        </div>
      )}

      {/* Job List and Detail View */}
      <div className="container mx-auto mt-6 px-4 grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Job List */}
        {!isMaximized && (
          <div className="md:col-span-1 space-y-4 h-[800px] overflow-y-auto pr-3">
            {jobs.map((job) => (
              <div
                key={job.id}
                onClick={() => navigate(`/job-search/${job.id}`)} // ✅ Click → URL change
                className="border rounded-lg p-4 shadow-sm cursor-pointer hover:bg-gray-100"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">{job.title}</h3>
                    <p className="text-sm text-gray-500">{job.subtitle}</p>
                    <p className="text-sm mt-1">{job.company}</p>
                    <ul className="text-xs mt-2 space-y-1">
                      {job.requirements.map((r, i) => (
                        <li key={i}>• {r}</li>
                      ))}
                    </ul>
                    <p className="text-xs text-gray-400 mt-2">{job.date}</p>
                  </div>
                  <img src={job.logo} alt="logo" className="w-10 h-10" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Detail View */}
        <div
          className={`${
            isMaximized ? "md:col-span-3" : "md:col-span-2"
          } p-4 h-[800px] overflow-auto`}
        >
          {selectedJob ? (
            <>
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{selectedJob.title}</h2>
                  <p className="text-gray-600">{selectedJob.subtitle}</p>
                </div>
                <button onClick={handleMaximizeToggle}>
                  <CiMaximize1
                    size={20}
                    className="text-gray-600 cursor-pointer"
                  />
                </button>
              </div>

              {/* Meta */}
              <div className="mt-4 space-y-2 text-gray-600 text-sm">
                <p className="flex items-center gap-2">
                  <MapPin size={16} /> {selectedJob.company}
                </p>
                <p className="flex items-center gap-2">
                  <Briefcase size={16} /> {selectedJob.category}
                </p>
                <p className="flex items-center gap-2">
                  <DollarSign size={16} /> ${selectedJob.salary}
                </p>
                <p className="flex items-center gap-2">
                  <CalendarDays size={16} /> {selectedJob.date}
                </p>
              </div>

              {/* Buttons */}
              <div className="mt-6 flex gap-4">
                <button
                  onClick={handleApplyNow}
                  className="px-6 py-2 rounded-md bg-orange-600 text-white font-semibold hover:bg-orange-700 cursor-pointer"
                >
                  Apply Now
                </button>
                <button className="px-6 py-2 rounded-md border border-gray-400 text-gray-700 hover:bg-gray-100">
                  Save
                </button>
              </div>

              {/* Description */}
              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-2">
                  Description and Requirement
                </h3>
                <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                  {selectedJob.description}
                </p>
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full">
              <h4 className="font-semibold text-lg">Choose a job you like</h4>
              <p className="text-sm text-gray-500 mt-2">Detail here</p>
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      {!isMaximized && (
        <div className="container mx-auto px-4 flex justify-start mt-4 mb-8 space-x-2">
          <button className="w-8 h-8 text-gray-600">1</button>
          <button className="w-8 h-8 bg-blue-100 text-blue-600 rounded-md">
            2
          </button>
          <button className="w-8 h-8 text-gray-600">3</button>
          <button className="w-8 h-8 text-gray-600">Next</button>
        </div>
      )}
    </>
  );
}
