/** @format */

import { useCallback, useContext, useEffect, useState } from "react";
import {
  createTestCenterCounter,
  deleteTestCenterCounter,
  getTestCenterCounters,
  getTestCenters,
} from "../Api/Api";
import AuthContext from "../Context/Context";

const TestCenterManagement = () => {
  const { token } = useContext(AuthContext);
  const [centers, setCenters] = useState([]);
  const [selectedCenterId, setSelectedCenterId] = useState("");
  const [counters, setCounters] = useState([]);
  const [counterName, setCounterName] = useState("");
  const [loading, setLoading] = useState(true);
  const [counterLoading, setCounterLoading] = useState(false);
  const [deletingCounterId, setDeletingCounterId] = useState(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const selectedCenter = centers.find(
    (center) => String(center.id) === String(selectedCenterId),
  );

  const loadCenters = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await getTestCenters(token);
      const data = await response.json();
      const sortedCenters = Array.isArray(data)
        ? data.toSorted((a, b) => a.order - b.order)
        : [];
      setCenters(sortedCenters);
      setSelectedCenterId((current) => current || sortedCenters[0]?.id || "");
    } catch (apiError) {
      setError(apiError.message || "Failed to load test centers.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const loadCounters = useCallback(
    async (centerId) => {
      if (!centerId) return;
      setCounterLoading(true);
      setError("");
      try {
        const response = await getTestCenterCounters(token, centerId);
        const data = await response.json();
        setCounters(Array.isArray(data) ? data : []);
      } catch (apiError) {
        setError(apiError.message || "Failed to load counters.");
      } finally {
        setCounterLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    loadCenters();
  }, [loadCenters]);

  useEffect(() => {
    loadCounters(selectedCenterId);
  }, [loadCounters, selectedCenterId]);

  const handleCreateCounter = async (event) => {
    event.preventDefault();
    setError("");
    setMessage("");
    try {
      await createTestCenterCounter(token, selectedCenterId, {
        name: counterName.trim(),
      });
      setCounterName("");
      setMessage("Counter created successfully.");
      await loadCounters(selectedCenterId);
    } catch (apiError) {
      setError(apiError.message || "Failed to create counter.");
    }
  };

  const handleDeleteCounter = async (counter) => {
    const confirmed = window.confirm(`Delete counter "${counter.name}"?`);
    if (!confirmed) return;

    setDeletingCounterId(counter.id);
    setError("");
    setMessage("");
    try {
      await deleteTestCenterCounter(token, selectedCenterId, counter.id);
      setMessage("Counter deleted successfully.");
      await loadCounters(selectedCenterId);
    } catch (apiError) {
      setError(apiError.message || "Failed to delete counter.");
    } finally {
      setDeletingCounterId(null);
    }
  };

  if (loading) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center text-2xl font-bold text-slate-400'>
        Loading test centers...
      </div>
    );
  }

  return (
    <div className='p-4 pb-10 md:p-6'>
      <div className='mx-auto grid max-w-7xl gap-5 lg:grid-cols-[360px_1fr]'>
        <section className='soft-panel p-5'>
          <p className='text-xs font-semibold uppercase tracking-[0.2em] text-sky-600'>
            Test Centers
          </p>
          <h1 className='mt-2 text-3xl font-black text-slate-800'>
            Center Management
          </h1>

          <div className='mt-5 grid gap-3'>
            {centers.map((center) => (
              <button
                key={center.id}
                type='button'
                onClick={() => setSelectedCenterId(center.id)}
                className={`rounded-2xl border p-4 text-left transition ${
                  String(selectedCenterId) === String(center.id)
                    ? "border-sky-300 bg-sky-50"
                    : "border-sky-100 bg-white hover:bg-sky-50"
                }`}>
                <div className='flex items-start justify-between gap-3'>
                  <div>
                    <p className='font-black capitalize text-slate-800'>
                      {center.name}
                    </p>
                    <p className='mt-1 text-sm text-slate-500'>{center.code}</p>
                  </div>
                  <span
                    className={`badge badge-sm ${
                      center.is_active ? "badge-success" : "badge-outline"
                    }`}>
                    {center.is_active ? "Active" : "Inactive"}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </section>

        <section className='soft-panel overflow-hidden'>
          <div className='border-b border-sky-100 p-5'>
            <p className='text-xs font-semibold uppercase tracking-[0.2em] text-sky-600'>
              Center Details
            </p>
            <h2 className='mt-2 text-2xl font-black capitalize text-slate-800'>
              {selectedCenter?.name || "Select a center"}
            </h2>
          </div>

          <div className='grid gap-5 p-5 lg:grid-cols-[1fr_320px]'>
            <div>
              <div className='overflow-x-auto'>
                <table className='table admin-workflow-table min-w-full'>
                  <thead>
                    <tr>
                      <th>Counter</th>
                      <th>Status</th>
                      <th>Center</th>
                      <th className='text-right'>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {counterLoading ? (
                      <tr>
                        <td
                          colSpan='4'
                          className='py-8 text-center font-semibold text-slate-400'>
                          Loading counters...
                        </td>
                      </tr>
                    ) : counters.length < 1 ? (
                      <tr>
                        <td
                          colSpan='4'
                          className='py-8 text-center font-semibold text-slate-400'>
                          No counters found
                        </td>
                      </tr>
                    ) : (
                      counters.map((counter) => (
                        <tr key={counter.id}>
                          <td className='font-bold text-slate-800'>
                            {counter.name}
                          </td>
                          <td>
                            <span
                              className={`badge badge-sm ${
                                counter.is_active
                                  ? "badge-success"
                                  : "badge-outline"
                              }`}>
                              {counter.is_active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className='capitalize'>
                            {counter.test_center?.name || selectedCenter?.name}
                          </td>
                          <td className='text-right'>
                            <button
                              type='button'
                              disabled={deletingCounterId === counter.id}
                              onClick={() => handleDeleteCounter(counter)}
                              className='btn btn-error btn-sm'>
                              {deletingCounterId === counter.id
                                ? "Deleting..."
                                : "Delete"}
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <form
              onSubmit={handleCreateCounter}
              className='rounded-2xl border border-sky-100 bg-sky-50 p-4'>
              <h3 className='text-lg font-black text-slate-800'>
                Create Counter
              </h3>
              <label className='mt-4 grid gap-2 text-sm font-semibold text-slate-700'>
                Counter name
                <input
                  type='text'
                  value={counterName}
                  onChange={(event) => setCounterName(event.target.value)}
                  className='input input-bordered w-full bg-white'
                  required
                />
              </label>
              <button
                type='submit'
                disabled={!selectedCenterId}
                className='btn btn-primary mt-4 w-full'>
                Create
              </button>
            </form>
          </div>

          {(error || message) && (
            <div className='px-5 pb-5'>
              <div
                role='alert'
                className={`alert alert-soft ${error ? "alert-error" : "alert-success"}`}>
                <span>{error || message}</span>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default TestCenterManagement;
