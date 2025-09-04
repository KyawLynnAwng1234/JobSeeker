import React, { useState } from 'react';
import axios from 'axios';

const RateLimitTest = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [endpoint, setEndpoint] = useState('employer'); // 'employer' or 'jobseeker'

  const testEmployerRateLimit = async () => {
    setLoading(true);
    setResults([]);
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    const ENDPOINT = `${API_URL}/accounts-employer/employer/login/`;
    
    const testData = {
      email: 'test@example.com',
      password: 'wrongpassword'
    };

    const newResults = [];

    for (let i = 1; i <= 10; i++) {
      try {
        const response = await axios.post(ENDPOINT, testData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        newResults.push({
          attempt: i,
          status: response.status,
          message: JSON.stringify(response.data)
        });
      } catch (error) {
        newResults.push({
          attempt: i,
          status: error.response?.status || 'Error',
          message: error.response?.data?.detail || error.message
        });
      }
      
      // Update results after each attempt
      setResults([...newResults]);
      
      // Small delay to make the UI more responsive
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setLoading(false);
  };

  const testJobseekerRateLimit = async () => {
    setLoading(true);
    setResults([]);
    const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';
    const ENDPOINT = `${API_URL}/accounts-jobseeker/jobseeker/signin/jobseeker/`;
    
    const testData = {
      email: 'test@example.com'
    };

    const newResults = [];

    for (let i = 1; i <= 10; i++) {
      try {
        const response = await axios.post(ENDPOINT, testData, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
        
        newResults.push({
          attempt: i,
          status: response.status,
          message: JSON.stringify(response.data)
        });
      } catch (error) {
        newResults.push({
          attempt: i,
          status: error.response?.status || 'Error',
          message: error.response?.data?.detail || error.message
        });
      }
      
      // Update results after each attempt
      setResults([...newResults]);
      
      // Small delay to make the UI more responsive
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    setLoading(false);
  };

  const handleTest = () => {
    if (endpoint === 'employer') {
      testEmployerRateLimit();
    } else {
      testJobseekerRateLimit();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 mx-auto">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Rate Limit Test</h2>
          <p className="mt-2 text-sm text-gray-600">
            Test the rate limiting functionality of the API
          </p>
        </div>

        <div className="mt-8 space-y-6">
          <div className="flex items-center justify-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="endpoint"
                value="employer"
                checked={endpoint === 'employer'}
                onChange={() => setEndpoint('employer')}
              />
              <span className="ml-2">Employer Login</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio"
                name="endpoint"
                value="jobseeker"
                checked={endpoint === 'jobseeker'}
                onChange={() => setEndpoint('jobseeker')}
              />
              <span className="ml-2">Jobseeker Login</span>
            </label>
          </div>

          <button
            onClick={handleTest}
            disabled={loading}
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Start Test'}
          </button>

          {results.length > 0 && (
            <div className="mt-4">
              <h3 className="text-lg font-medium text-gray-900">Results:</h3>
              <div className="mt-2 bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Attempt
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {results.map((result) => (
                      <tr key={result.attempt}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {result.attempt}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span 
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                              result.status === 429 
                                ? 'bg-red-100 text-red-800' 
                                : result.status === 200 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}
                          >
                            {result.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                          {result.message}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RateLimitTest;