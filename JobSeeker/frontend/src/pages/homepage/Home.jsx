import { useNavigate } from "react-router-dom";
import FeaturedCompanies from "./FeatureCompanies";
import JobCard from "./JobCard";
import QuickSearchSection from "./QuickSearchSection";

export default function Home() {
  const navigateCompany = useNavigate();
  const navigateJobs= useNavigate();

  const dummyJobs = Array(6).fill({
    title: "Project Manager",
    company: "Myauk Oo",
    category: "Time management",
    postedAgo: "2d ago",
  });

  return (
    <div className="bg-gray-100 min-h-screen">
      {/* Start Hero Section ---- job search */}
      <section className="bg-blue-custom py-8">
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

      {/* End Hero Section ---- job search */}

      {/* Start Feature Of Companies */}
      <section className="container mx-auto text-center py-8">
        <div className="py-4">
          <h2 className="text-2xl font-bold">Feature Of Companies</h2>
          <p>Work for the best companies in website</p>
        </div>

        {/* Feacture Companent */}
        <FeaturedCompanies />
        <div className="py-4 text-start px-4">
          <button
            onClick={() => navigateCompany("/companies")}
            className="px-2 py-1 border rounded-md cursor-pointer transition custom-blue-text custom-blue-border hover-blue hover:bg-gray-200"
          >
            View All 🡆
          </button>
        </div>
      </section>
      {/* End Feature Of Companies */}

      {/* Start Job Offer */}
      <section className="bg-gray-100">
        <div className="container mx-auto px-4 py-8">
          <h2 className="text-2xl font-bold text-center py-4">Jobs Offer</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {dummyJobs.map((job, i) => (
              <JobCard key={i} job={job} />
            ))}
          </div>
          <div className="py-4">
            <button
              onClick={() => navigateJobs("/jobs")}
              className="px-2 py-1 border rounded-md cursor-pointer transition custom-blue-text custom-blue-border hover-blue hover:bg-gray-200"
            >
              View All 🡆
            </button>
          </div>
        </div>
      </section>
      {/* End Job Offer */}

      {/* Start Quick Search */}
      <QuickSearchSection />

      {/* End Quick Search */}
    </div>
  );
}
