/** @format */

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { getTodayVerifierQueue } from "../Api/Api";
import AuthContext from "../Context/Context";
import { createQueueAnnouncementPlayer } from "../lib/queueAnnouncementAudio";
import { Volume2 } from "lucide-react";

const getColumnsForWidth = (width) => {
  if (width >= 1280) return 6;
  if (width >= 1024) return 5;
  if (width >= 768) return 4;
  if (width >= 640) return 3;
  return 2;
};

const getViewportPageSize = () => {
  const columns = getColumnsForWidth(window.innerWidth);
  const availableHeight = Math.max(window.innerHeight - 180, 160);
  const rows = Math.max(Math.floor(availableHeight / 104), 1);

  return columns * rows;
};

const Queue = () => {
  const { token, user } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [audioError, setAudioError] = useState("");
  const [audioStatus, setAudioStatus] = useState("idle");
  const [audioEnabling, setAudioEnabling] = useState(false);
  const [pageSize, setPageSize] = useState(() => getViewportPageSize());
  const [currentPage, setCurrentPage] = useState(0);
  const firstTicketIdRef = useRef(null);
  const queueInitializedRef = useRef(false);
  const audioPlayerRef = useRef(null);
  const centerCode = user?.assigned_test_center?.code;
  const centerName = user?.assigned_test_center?.name;
  const counterName = user?.assigned_counter?.name;

  useEffect(() => {
    if (!centerCode || !counterName) return undefined;

    let disposed = false;
    const player = createQueueAnnouncementPlayer({
      onStateChange: (status) => {
        if (!disposed) setAudioStatus(status);
      },
      onError: (playbackError) => {
        if (!disposed) {
          console.warn("Queue announcement failed:", playbackError);
          setAudioError(
            playbackError.message || "Queue announcement playback failed.",
          );
        }
      },
    });

    audioPlayerRef.current = player;
    setAudioError("");
    player.initialize().catch(() => {});

    return () => {
      disposed = true;
      if (audioPlayerRef.current === player) {
        audioPlayerRef.current = null;
      }
      player.destroy();
    };
  }, [centerCode, counterName]);

  const loadQueue = useCallback(
    async (silent = false, signal) => {
      if (!centerCode) {
        setTickets([]);
        setLoading(false);
        return;
      }

      if (!silent) {
        setLoading(true);
      }
      setError("");
      try {
        const response = await getTodayVerifierQueue(token, centerCode, signal);
        const data = await response.json();
        if (signal?.aborted) return;

        const nextTickets = Array.isArray(data) ? data : [];
        const firstTicket = nextTickets[0];
        const firstTicketId = firstTicket?.id ?? null;

        if (!queueInitializedRef.current) {
          queueInitializedRef.current = true;
        } else if (firstTicket && firstTicketId !== firstTicketIdRef.current) {
          audioPlayerRef.current?.enqueue({
            rollNumber: firstTicket.roll_number,
            counterName,
          });
        }

        firstTicketIdRef.current = firstTicketId;
        setTickets(nextTickets);
      } catch (apiError) {
        if (apiError.name === "AbortError") return;

        console.log(apiError);
        setError(apiError.message || "Failed to load verifier queue.");
      } finally {
        if (!silent && !signal?.aborted) {
          setLoading(false);
        }
      }
    },
    [centerCode, counterName, token],
  );

  useEffect(() => {
    firstTicketIdRef.current = null;
    queueInitializedRef.current = false;
  }, [centerCode, counterName]);

  useEffect(() => {
    let timeoutId;
    let disposed = false;
    const controller = new AbortController();

    const pollQueue = async (silent) => {
      await loadQueue(silent, controller.signal);
      if (!disposed) {
        timeoutId = window.setTimeout(() => pollQueue(true), 1000);
      }
    };

    pollQueue(false);

    return () => {
      disposed = true;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [loadQueue]);

  const handleEnableAudio = async () => {
    const player = audioPlayerRef.current;
    if (!player) return;

    setAudioEnabling(true);
    setAudioError("");
    try {
      await player.unlock();
    } catch (playbackError) {
      if (audioPlayerRef.current === player) {
        setAudioError(
          playbackError.message || "The browser did not allow audio playback.",
        );
      }
    } finally {
      if (audioPlayerRef.current === player) {
        setAudioEnabling(false);
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setPageSize(getViewportPageSize());
      setCurrentPage(0);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const totalPages = Math.max(Math.ceil(tickets.length / pageSize), 1);

  useEffect(() => {
    setCurrentPage((page) => Math.min(page, totalPages - 1));
  }, [totalPages]);

  useEffect(() => {
    if (totalPages <= 1) return undefined;

    const pageIntervalId = setInterval(() => {
      setCurrentPage((page) => (page + 1) % totalPages);
    }, 5000);

    return () => clearInterval(pageIntervalId);
  }, [totalPages]);

  const visibleTickets = tickets.slice(
    currentPage * pageSize,
    currentPage * pageSize + pageSize,
  );
  const showAudioControl = ["idle", "loading", "locked", "error"].includes(
    audioStatus,
  );

  if (!user?.assigned_test_center) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center p-4'>
        <div role='alert' className='alert alert-warning max-w-lg shadow-sm'>
          <span className='font-bold'>No test center assigned</span>
        </div>
      </div>
    );
  }

  if (!user?.assigned_counter) {
    return (
      <div className='flex min-h-[60vh] items-center justify-center p-4'>
        <div role='alert' className='alert alert-warning max-w-lg shadow-sm'>
          <span className='font-bold'>No counter assigned</span>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className='flex h-screen items-center justify-center text-2xl font-bold text-slate-400'>
        <p>Loading queue...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className='p-4 md:p-6'>
        <div className='mx-auto max-w-3xl rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-center text-sm font-semibold text-rose-600'>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className='h-[calc(100vh-160px)] overflow-hidden p-4 md:p-6'>
      <header className='mb-4 rounded-box border border-base-300 bg-base-200 text-center py-3 shadow-sm'>
        <h1 className='text-xl font-bold text-base-content md:text-5xl'>
          {centerName}
        </h1>
      </header>

      {(showAudioControl || audioError) && (
        <div
          role='alert'
          className={`alert alert-soft mb-3 ${audioError ? "alert-error" : "alert-warning"}`}>
          <span>
            {audioError
              || (audioStatus === "loading"
                ? "Announcement audio is preparing. Enable it to allow playback."
                : "Announcement audio needs permission to play.")}
          </span>
          {(showAudioControl || audioError) && (
            <button
              type='button'
              onClick={handleEnableAudio}
              disabled={audioEnabling}
              className='btn btn-warning min-h-11 shrink-0'>
              <Volume2 className='h-5 w-5' aria-hidden='true' />
              {audioEnabling ? "Enabling..." : "Enable announcements"}
            </button>
          )}
        </div>
      )}

      {tickets.length < 1 ? (
        <div className='flex min-h-[60vh] items-center justify-center text-2xl font-bold text-slate-400'>
          <p>No Tickets Available</p>
        </div>
      ) : (
        <>
          {totalPages > 1 && (
            <div className='mb-3 text-center text-xs font-bold uppercase tracking-[0.18em] text-slate-400'>
              Page {currentPage + 1} of {totalPages}
            </div>
          )}
          <div className='grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6'>
            {visibleTickets.map((ticket, index) => {
              const isCurrentRoll = currentPage === 0 && index === 0;

              return (
                <div
                  key={ticket.id}
                  className={`soft-card flex min-h-[84px] flex-col items-center justify-center text-center ${
                    isCurrentRoll
                      ? "border-2 border-primary bg-primary/30 ring-4 ring-primary/20"
                      : "border-sky-100 bg-white"
                  }`}>
                  {isCurrentRoll && (
                    <span className='badge badge-primary mb-1 font-bold'>
                      Current Roll
                    </span>
                  )}
                  <p
                    className={`text-6xl font-black tracking-wide ${
                      isCurrentRoll ? "text-primary" : "text-slate-800"
                    }`}>
                    {ticket.roll_number}
                  </p>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default Queue;
