/** @format */

import { useCallback, useContext, useEffect, useState } from "react";
import {
  assignVerifierCounter,
  assignVerifierTestCenter,
  getTestCenterCounters,
  getTestCenters,
  getUser,
  revokeVerifierCounter,
  revokeVerifierTestCenter,
} from "../Api/Api";
import AuthContext from "../Context/Context";
import { X } from "lucide-react";

const VerifierAssignment = () => {
  const { token } = useContext(AuthContext);
  const [centers, setCenters] = useState([]);
  const [verifiers, setVerifiers] = useState([]);
  const [countersByCenter, setCountersByCenter] = useState({});
  const [activeUserId, setActiveUserId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const loadCounters = useCallback(
    async (centerId) => {
      if (!centerId || countersByCenter[centerId]) return;

      const response = await getTestCenterCounters(token, centerId);
      const data = await response.json();
      setCountersByCenter((current) => ({
        ...current,
        [centerId]: Array.isArray(data) ? data : [],
      }));
    },
    [countersByCenter, token],
  );

  const loadData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [centerResponse, userResponse] = await Promise.all([
        getTestCenters(token),
        getUser(token),
      ]);
      const [centerData, userData] = await Promise.all([
        centerResponse.json(),
        userResponse.json(),
      ]);
      const sortedCenters = Array.isArray(centerData)
        ? centerData.toSorted((a, b) => a.order - b.order)
        : [];
      setCenters(sortedCenters);
      setVerifiers(
        Array.isArray(userData)
          ? userData.filter((user) => user.user_type === "verifier")
          : [],
      );
    } catch (apiError) {
      setError(apiError.message || "Failed to load verifier assignments.");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    verifiers.forEach((verifier) => {
      const centerId = verifier.assigned_test_center?.id;
      if (centerId) {
        loadCounters(centerId).catch((apiError) => {
          setError(apiError.message || "Failed to load counters.");
        });
      }
    });
  }, [loadCounters, verifiers]);

  const updateVerifier = (updatedUser) => {
    setVerifiers((current) =>
      current.map((verifier) =>
        verifier.id === updatedUser.id
          ? { ...verifier, ...updatedUser }
          : verifier,
      ),
    );
  };

  const handleCenterChange = async (verifierId, centerId) => {
    setActiveUserId(verifierId);
    setError("");
    setMessage("");
    try {
      const response = await assignVerifierTestCenter(token, verifierId, {
        test_center_id: Number(centerId),
      });
      const data = await response.json();
      updateVerifier(data.user);
      await loadCounters(centerId);
      setMessage(data.message || "Verifier test center assigned successfully.");
    } catch (apiError) {
      setError(apiError.message || "Failed to assign test center.");
    } finally {
      setActiveUserId(null);
    }
  };

  const handleCounterChange = async (verifierId, counterId) => {
    setActiveUserId(verifierId);
    setError("");
    setMessage("");
    try {
      const response = await assignVerifierCounter(token, verifierId, {
        counter_id: Number(counterId),
      });
      const data = await response.json();
      updateVerifier(data.user);
      setMessage(data.message || "Verifier counter assigned successfully.");
    } catch (apiError) {
      setError(apiError.message || "Failed to assign counter.");
    } finally {
      setActiveUserId(null);
    }
  };

  const handleRevokeCenter = async (verifier) => {
    const confirmed = window.confirm(
      `Revoke test center from ${verifier.first_name || verifier.name || verifier.username}?`,
    );
    if (!confirmed) return;

    setActiveUserId(verifier.id);
    setError("");
    setMessage("");
    try {
      const response = await revokeVerifierTestCenter(token, verifier.id);
      const data = await response.json();
      updateVerifier(data.user);
      setMessage(data.message || "Verifier test center revoked successfully.");
    } catch (apiError) {
      setError(apiError.message || "Failed to revoke test center.");
    } finally {
      setActiveUserId(null);
    }
  };

  const handleRevokeCounter = async (verifier) => {
    const confirmed = window.confirm(
      `Revoke counter from ${verifier.first_name || verifier.name || verifier.username}?`,
    );
    if (!confirmed) return;

    setActiveUserId(verifier.id);
    setError("");
    setMessage("");
    try {
      const response = await revokeVerifierCounter(token, verifier.id);
      const data = await response.json();
      updateVerifier(data.user);
      setMessage(data.message || "Verifier counter revoked successfully.");
    } catch (apiError) {
      setError(apiError.message || "Failed to revoke counter.");
    } finally {
      setActiveUserId(null);
    }
  };

  if (loading) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center text-2xl font-bold text-slate-400'>
        Loading verifier assignments...
      </div>
    );
  }

  return (
    <div className='p-4 pb-10 md:p-6'>
      <div className='mx-auto max-w-7xl space-y-5'>
        <div className='soft-panel p-5'>
          <p className='text-xs font-semibold uppercase tracking-[0.2em] text-sky-600'>
            Verifier Assignment
          </p>
          <h1 className='mt-2 text-3xl font-black text-slate-800'>
            Assign Centers and Counters
          </h1>
        </div>

        {(error || message) && (
          <div
            role='alert'
            className={`alert alert-soft flex items-center justify-between gap-3 ${error ? "alert-error" : "alert-success"}`}>
            <span>{error || message}</span>
            <button
              type='button'
              aria-label='Dismiss message'
              onClick={() => {
                setError("");
                setMessage("");
              }}
              className='btn btn-ghost btn-xs btn-circle shrink-0'>
              <X className='h-4 w-4' />
            </button>
          </div>
        )}

        <div className='soft-panel overflow-hidden'>
          <div className='overflow-x-auto'>
            <table className='table admin-workflow-table min-w-full'>
              <thead>
                <tr>
                  <th>Verifier</th>
                  <th>Current Center</th>
                  <th>Current Counter</th>
                  <th>Assign Center</th>
                  <th>Assign Counter</th>
                </tr>
              </thead>
              <tbody>
                {verifiers.length < 1 ? (
                  <tr>
                    <td
                      colSpan='5'
                      className='py-10 text-center font-semibold text-slate-400'>
                      No verifier users found
                    </td>
                  </tr>
                ) : (
                  verifiers.map((verifier) => {
                    const centerId = verifier.assigned_test_center?.id;
                    const centerCounters = centerId
                      ? countersByCenter[centerId] || []
                      : [];

                    return (
                      <tr key={verifier.id}>
                        <td>
                          <div className='font-black text-slate-800'>
                            {verifier.first_name
                              || verifier.name
                              || verifier.username}
                          </div>
                          <div className='text-xs text-slate-500'>
                            @{verifier.username}
                          </div>
                        </td>
                        <td>
                          {verifier.assigned_test_center ? (
                            <span className='badge badge-info badge-outline capitalize'>
                              {verifier.assigned_test_center.name}
                            </span>
                          ) : (
                            <span className='badge badge-warning badge-outline'>
                              No test center assigned
                            </span>
                          )}
                        </td>
                        <td>
                          {verifier.assigned_counter ? (
                            <span className='badge badge-success badge-outline'>
                              {verifier.assigned_counter.name}
                            </span>
                          ) : (
                            <span className='badge badge-warning badge-outline'>
                              No counter assigned
                            </span>
                          )}
                        </td>
                        <td>
                          <div className='relative min-w-48'>
                            <select
                              value={centerId || ""}
                              disabled={activeUserId === verifier.id}
                              onChange={(event) =>
                                handleCenterChange(
                                  verifier.id,
                                  event.target.value,
                                )
                              }
                              className='select select-bordered w-full bg-white pr-16'>
                              <option value='' disabled>
                                Select center
                              </option>
                              {centers.map((center) => (
                                <option key={center.id} value={center.id}>
                                  {center.name}
                                </option>
                              ))}
                            </select>
                            {verifier.assigned_test_center && (
                              <button
                                type='button'
                                aria-label='Revoke test center assignment'
                                disabled={activeUserId === verifier.id}
                                onClick={() => handleRevokeCenter(verifier)}
                                className='absolute right-9 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40'>
                                <X className='h-4 w-4' />
                              </button>
                            )}
                          </div>
                        </td>
                        <td>
                          <div className='relative min-w-48'>
                            <select
                              value={verifier.assigned_counter?.id || ""}
                              disabled={
                                !centerId || activeUserId === verifier.id
                              }
                              onChange={(event) =>
                                handleCounterChange(
                                  verifier.id,
                                  event.target.value,
                                )
                              }
                              className='select select-bordered w-full bg-white pr-16'>
                              <option value='' disabled>
                                {centerId
                                  ? "Select counter"
                                  : "Assign center first"}
                              </option>
                              {centerCounters.map((counter) => (
                                <option key={counter.id} value={counter.id}>
                                  {counter.name}
                                </option>
                              ))}
                            </select>
                            {verifier.assigned_counter && (
                              <button
                                type='button'
                                aria-label='Revoke counter assignment'
                                disabled={activeUserId === verifier.id}
                                onClick={() => handleRevokeCounter(verifier)}
                                className='absolute right-9 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-rose-600 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-40'>
                                <X className='h-4 w-4' />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifierAssignment;
