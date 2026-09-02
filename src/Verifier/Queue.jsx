/** @format */

import { useCallback, useContext, useEffect, useRef, useState } from "react";
import {
  createQueueAnnouncement,
  getLatestQueueAnnouncement,
  getTodayVerifierQueue,
} from "../Api/Api";
import AuthContext from "../Context/Context";
import {
  playQueueAnnouncement,
  unlockQueueAudio,
} from "../lib/queueAnnouncementAudio";
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
  const [announcementError, setAnnouncementError] = useState("");
  const [audioError, setAudioError] = useState("");
  const [audioBlocked, setAudioBlocked] = useState(false);
  const [pageSize, setPageSize] = useState(() => getViewportPageSize());
  const [currentPage, setCurrentPage] = useState(0);
  const firstTicketIdRef = useRef(null);
  const queueInitializedRef = useRef(false);
  const lastAnnouncementIdRef = useRef(null);
  const announcementInitializedRef = useRef(false);
  const announcementChainRef = useRef(Promise.resolve());
  const centerCode = user?.assigned_test_center?.code;

  const loadQueue = useCallback(
    async (silent = false) => {
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
        const response = await getTodayVerifierQueue(token, centerCode);
        const data = await response.json();
        const nextTickets = Array.isArray(data) ? data : [];
        const firstTicket = nextTickets[0];
        const firstTicketId = firstTicket?.id ?? null;

        if (!queueInitializedRef.current) {
          queueInitializedRef.current = true;
        } else if (firstTicket && firstTicketId !== firstTicketIdRef.current) {
          createQueueAnnouncement(token, firstTicketId).catch((apiError) => {
            setAnnouncementError(
              apiError.message || "Failed to announce the current ticket.",
            );
          });
        }

        firstTicketIdRef.current = firstTicketId;
        setTickets(nextTickets);
      } catch (apiError) {
        console.log(apiError);
        setError(apiError.message || "Failed to load verifier queue.");
      } finally {
        if (!silent) {
          setLoading(false);
        }
      }
    },
    [centerCode, token],
  );

  useEffect(() => {
    firstTicketIdRef.current = null;
    queueInitializedRef.current = false;
  }, [centerCode]);

  useEffect(() => {
    loadQueue();

    const intervalId = setInterval(() => {
      loadQueue(true);
    }, 1000);

    return () => clearInterval(intervalId);
  }, [loadQueue]);

  useEffect(() => {
    if (!centerCode || !token || !user?.assigned_counter) return undefined;

    let timeoutId;
    let disposed = false;
    const controller = new AbortController();

    lastAnnouncementIdRef.current = null;
    announcementInitializedRef.current = false;
    announcementChainRef.current = Promise.resolve();
    setAnnouncementError("");
    setAudioError("");
    setAudioBlocked(false);

    const pollLatestAnnouncement = async () => {
      try {
        const response = await getLatestQueueAnnouncement(
          token,
          controller.signal,
        );
        const data = await response.json();
        const announcement = Object.prototype.hasOwnProperty.call(
          data ?? {},
          "announcement",
        )
          ? data.announcement
          : data;
        const announcementId = announcement?.id ?? null;

        setAnnouncementError("");

        if (!announcementInitializedRef.current) {
          lastAnnouncementIdRef.current = announcementId;
          announcementInitializedRef.current = true;
        } else if (
          announcementId !== null
          && announcementId !== lastAnnouncementIdRef.current
        ) {
          lastAnnouncementIdRef.current = announcementId;
          announcementChainRef.current = announcementChainRef.current
            .then(() => playQueueAnnouncement(announcement, controller.signal))
            .then(() => setAudioError(""))
            .catch((playbackError) => {
              if (playbackError.name === "AbortError") return;

              if (playbackError.name === "NotAllowedError") {
                setAudioBlocked(true);
                setAudioError(
                  "Browser audio is blocked. Enable announcements to hear future calls.",
                );
                return;
              }

              console.warn("Queue announcement failed:", playbackError);
              setAudioError(
                playbackError.message || "Queue announcement playback failed.",
              );
            });
        }
      } catch (apiError) {
        if (apiError.name !== "AbortError") {
          setAnnouncementError(
            apiError.message || "Announcement service is unavailable.",
          );
        }
      } finally {
        if (!disposed) {
          timeoutId = window.setTimeout(pollLatestAnnouncement, 1000);
        }
      }
    };

    pollLatestAnnouncement();

    return () => {
      disposed = true;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [centerCode, token, user?.assigned_counter]);

  const handleEnableAudio = async () => {
    try {
      await unlockQueueAudio();
      setAudioBlocked(false);
      setAudioError("");
    } catch (playbackError) {
      setAudioError(
        playbackError.message || "The browser did not allow audio playback.",
      );
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
      {(announcementError || audioError) && (
        <div
          role='alert'
          className={`alert alert-soft mb-3 ${audioBlocked ? "alert-warning" : "alert-error"}`}>
          <span>{audioError || announcementError}</span>
          {audioBlocked && (
            <button
              type='button'
              onClick={handleEnableAudio}
              className='btn btn-warning min-h-11 shrink-0'>
              <Volume2 className='h-5 w-5' aria-hidden='true' />
              Enable announcements
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
            {visibleTickets.map((ticket) => (
              <div
                key={ticket.id}
                className='soft-card flex min-h-[84px] flex-col items-center justify-center border-sky-100 bg-white px-2 py-4 text-center'>
                <p className='text-base font-black tracking-wide text-slate-800'>
                  {ticket.roll_number}
                </p>
                <p className='text-base text-slate-800'>{ticket.serial}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Queue;
