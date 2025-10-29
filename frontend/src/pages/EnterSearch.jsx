import React from "react";
import companyImage from '../assets/images/companies.jpg';

function EnterSearch() {
  return (
    <section
      className=""
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${companyImage})`,
        height: "350px",
      }}
    >
      <div className="w-full px-4 h-[500px]">
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
              <p className="absolute top-47 text-[#ffffffcf] text-xl hidden md:block">
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
              <p className="absolute top-47 text-[#ffffffcf] text-xl hidden md:block">
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
  );
}

export default EnterSearch;
