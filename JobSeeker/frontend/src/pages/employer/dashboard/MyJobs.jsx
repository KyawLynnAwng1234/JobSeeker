// src/components/MyJobs.jsx
import React, { useState } from 'react';
import PostJob from './PostJob'; // PostJob component ကို import လုပ်လိုက်ပါ

export default function MyJobs() {
  // state တစ်ခု ထားပြီး ဘယ် component ကို ပြမလဲဆိုတာ ထိန်းချုပ်ပါမယ်
  const [showPostJob, setShowPostJob] = useState(false);

  // Post a Job button ကို နှိပ်ရင် state ကို true ပြောင်းမယ့် function
  const handlePostJobClick = () => {
    setShowPostJob(true);
  };

  // Back button ကို နှိပ်ရင် state ကို false ပြောင်းမယ့် function (PostJob component အတွက်)
  const handleBackToMyJobs = () => {
    setShowPostJob(false);
  };

  return (
    <div>
      {/* showPostJob state ပေါ်မူတည်ပြီး render လုပ်မယ် */}
      {showPostJob ? (
        // state က true ဖြစ်ရင် PostJob component ကို ပြမယ်
        <PostJob onBack={handleBackToMyJobs} />
      ) : (
        // state က false ဖြစ်ရင် ပုံမှန်အတိုင်း Table UI ကို ပြမယ်
        <div>
          {/* Heading */}
          <h1 className="text-2xl font-bold mb-6">My Jobs</h1> {/* Heading ကို ပိုရှင်းအောင် ပြောင်းလိုက်ပါတယ် */}

          {/* Table Card */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="p-3">Title</th>
                    <th className="p-3">Job Function</th>
                    <th className="p-3">Post Date</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {/* Empty Row → Screenshot အတိုင်း အလွတ်ထားမယ် */}
                </tbody>
              </table>
            </div>

            {/* Add Job Button */}
            <div className="flex justify-end mt-4">
              <button
                onClick={handlePostJobClick} // Button ကို နှိပ်ရင် state ကို ပြောင်းမယ့် function ကို ထည့်လိုက်ပါ
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Post add Job
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}