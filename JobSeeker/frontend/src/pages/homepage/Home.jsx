import { useNavigate } from "react-router-dom";
import EnterSearch from "../EnterSearch";
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
      <EnterSearch />

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
