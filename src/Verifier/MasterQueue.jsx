/** @format */

import {
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { getVerifierMasterQueue } from "../Api/Api";
import AuthContext from "../Context/Context";

const QUEUE_SECTIONS = [
  { key: "biometric", title: "Biometric" },
  { key: "viva", title: "Viva" },
  { key: "practical", title: "Practical" },
];

const EMPTY_QUEUE = {
  biometric: [],
  viva: [],
  practical: [],
};

const EMPTY_PAGES = {
  biometric: 0,
  viva: 0,
  practical: 0,
};

const SECTION_HEADER_HEIGHT = 57;
const SECTION_VERTICAL_PADDING = 32;
const SECTION_HORIZONTAL_PADDING = 32;
const SECTION_CONTENT_GAP = 12;
const ROLL_ROW_HEIGHT = 80;
const ROLL_ROW_GAP = 8;
const TWO_COLUMN_MIN_WIDTH = 300;

const sortBySerial = (tickets) =>
  [...tickets].sort((first, second) => {
    const firstSerial =
      first.serial === null ? Number.POSITIVE_INFINITY : Number(first.serial);
    const secondSerial =
      second.serial === null ? Number.POSITIVE_INFINITY : Number(second.serial);

    if (!Number.isFinite(firstSerial) && !Number.isFinite(secondSerial))
      return 0;
    if (!Number.isFinite(firstSerial)) return 1;
    if (!Number.isFinite(secondSerial)) return -1;
    return firstSerial - secondSerial;
  });

const MasterQueue = () => {
  const { token } = useContext(AuthContext);
  const [queues, setQueues] = useState(EMPTY_QUEUE);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [pageSize, setPageSize] = useState(1);
  const [listColumns, setListColumns] = useState(1);
  const [currentPages, setCurrentPages] = useState(EMPTY_PAGES);
  const queueSectionRef = useRef(null);
  const biometricCount = queues.biometric.length;
  const vivaCount = queues.viva.length;
  const practicalCount = queues.practical.length;
  const totalPagesByQueue = useMemo(
    () => ({
      biometric: Math.max(Math.ceil(biometricCount / pageSize), 1),
      viva: Math.max(Math.ceil(vivaCount / pageSize), 1),
      practical: Math.max(Math.ceil(practicalCount / pageSize), 1),
    }),
    [pageSize, biometricCount, vivaCount, practicalCount],
  );

  const loadMasterQueue = useCallback(
    async (signal) => {
      try {
        const response = await getVerifierMasterQueue(token, signal);
        const data = await response.json();
        if (signal.aborted) return;

        setError("");
        setQueues(
          Object.fromEntries(
            QUEUE_SECTIONS.map(({ key }) => [
              key,
              sortBySerial(Array.isArray(data?.[key]) ? data[key] : []),
            ]),
          ),
        );
      } catch (apiError) {
        if (apiError.name === "AbortError") return;
        setError(apiError.message || "Failed to load the master queue.");
      } finally {
        if (!signal.aborted) setLoading(false);
      }
    },
    [token],
  );

  useEffect(() => {
    const controller = new AbortController();
    let timeoutId;
    let disposed = false;

    const pollMasterQueue = async () => {
      await loadMasterQueue(controller.signal);
      if (!disposed) {
        timeoutId = window.setTimeout(pollMasterQueue, 1000);
      }
    };

    pollMasterQueue();

    return () => {
      disposed = true;
      window.clearTimeout(timeoutId);
      controller.abort();
    };
  }, [loadMasterQueue]);

  useLayoutEffect(() => {
    const section = queueSectionRef.current;
    if (!section) return undefined;

    const updatePageSize = () => {
      const header = section.querySelector("[data-queue-header]");
      const availableListHeight =
        section.clientHeight
        - SECTION_VERTICAL_PADDING
        - SECTION_CONTENT_GAP
        - (header?.offsetHeight ?? SECTION_HEADER_HEIGHT);
      const availableListWidth =
        section.clientWidth - SECTION_HORIZONTAL_PADDING;
      const nextColumns = availableListWidth >= TWO_COLUMN_MIN_WIDTH ? 2 : 1;
      const rowsFit = Math.max(
        Math.floor(
          (availableListHeight + ROLL_ROW_GAP)
            / (ROLL_ROW_HEIGHT + ROLL_ROW_GAP),
        ),
        1,
      );
      const nextPageSize = rowsFit * nextColumns;

      setListColumns((currentColumns) =>
        currentColumns === nextColumns ? currentColumns : nextColumns,
      );
      setPageSize((currentPageSize) => {
        if (currentPageSize === nextPageSize) return currentPageSize;
        setCurrentPages(EMPTY_PAGES);
        return nextPageSize;
      });
    };

    updatePageSize();

    if (typeof ResizeObserver === "undefined") {
      window.addEventListener("resize", updatePageSize);
      return () => window.removeEventListener("resize", updatePageSize);
    }

    const resizeObserver = new ResizeObserver(updatePageSize);
    resizeObserver.observe(section);

    return () => resizeObserver.disconnect();
  }, [loading]);

  useEffect(() => {
    setCurrentPages((pages) =>
      Object.fromEntries(
        QUEUE_SECTIONS.map(({ key }) => {
          const totalPages = totalPagesByQueue[key];
          return [key, Math.min(pages[key], totalPages - 1)];
        }),
      ),
    );
  }, [totalPagesByQueue]);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setCurrentPages((pages) =>
        Object.fromEntries(
          QUEUE_SECTIONS.map(({ key }) => {
            const totalPages = totalPagesByQueue[key];
            return [key, totalPages > 1 ? (pages[key] + 1) % totalPages : 0];
          }),
        ),
      );
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [totalPagesByQueue]);

  return (
    <div className='h-full overflow-y-auto bg-slate-100 p-4 pb-24 md:p-6 md:pb-6 xl:overflow-hidden'>
      <div className='mx-auto flex h-full w-full flex-col'>
        {error ? (
          <div
            role='alert'
            className='alert alert-error alert-soft mb-4 text-error-content'>
            <span>{error}</span>
          </div>
        ) : null}

        {loading ? (
          <div
            className='flex min-h-72 items-center justify-center'
            aria-label='Loading master queue'>
            <span className='loading loading-spinner loading-lg'></span>
          </div>
        ) : (
          <div className='grid min-h-[32rem] flex-1 grid-cols-1 gap-4 sm:grid-cols-2 xl:min-h-0 xl:grid-cols-3'>
            {QUEUE_SECTIONS.map(({ key, title }) => {
              const totalPages = totalPagesByQueue[key];
              const currentPage = currentPages[key];
              const visibleTickets = queues[key].slice(
                currentPage * pageSize,
                currentPage * pageSize + pageSize,
              );
              const visibleTicketKey = visibleTickets
                .map((ticket) => ticket.id)
                .join("-");

              return (
                <section
                  key={key}
                  ref={key === "biometric" ? queueSectionRef : undefined}
                  className='card card-border min-h-[32rem] min-w-0 overflow-hidden border-slate-200 bg-white text-slate-900 shadow-sm xl:h-full xl:min-h-0'>
                  <div className='card-body flex min-h-0 gap-3 p-4'>
                    <div
                      data-queue-header
                      className='border-b border-slate-200 pb-3'>
                      <div className='flex items-center justify-between gap-3'>
                        <h2 className='card-title text-lg text-slate-900'>
                          {title}
                        </h2>
                        <span
                          className='min-w-8 rounded-selector bg-slate-100 px-2 py-1 text-center text-sm font-bold text-slate-800'
                          aria-label={`${queues[key].length} tickets`}>
                          {queues[key].length}
                        </span>
                      </div>
                    </div>

                    {queues[key].length === 0 ? (
                      <p className='flex flex-1 items-center justify-center text-sm text-slate-500'>
                        No tickets
                      </p>
                    ) : (
                      <ol
                        key={`${key}-${currentPage}-${visibleTicketKey}`}
                        style={{
                          gridTemplateColumns: `repeat(${listColumns}, minmax(0, 1fr))`,
                        }}
                        className='queue-page-enter grid min-h-0 flex-1 grid-flow-row content-start gap-2 overflow-hidden motion-reduce:animate-none'>
                        {visibleTickets.map((ticket, ticketIndex) => {
                          const isCurrentTicket =
                            ticket.id === queues[key][0]?.id;
                          const showOrderHint =
                            listColumns > 1
                            && currentPage === 0
                            && ticketIndex < 2;

                          return (
                            <li
                              key={ticket.id}
                              aria-current={
                                isCurrentTicket ? "true" : undefined
                              }
                              className={`relative flex h-20 min-h-20 flex-col items-center justify-center overflow-hidden rounded-box border px-2 py-2 text-center font-black ${
                                isCurrentTicket
                                  ? "border-primary bg-primary text-primary-content shadow-sm"
                                  : "border-slate-200 bg-slate-50 text-slate-900"
                              }`}>
                              {showOrderHint ? (
                                <span
                                  aria-hidden='true'
                                  className={`absolute left-2 top-2 flex size-5 items-center justify-center rounded-full text-xs font-black ${
                                    isCurrentTicket
                                      ? "bg-primary-content text-primary"
                                      : "bg-neutral text-neutral-content"
                                  }`}>
                                  {ticketIndex + 1}
                                </span>
                              ) : null}
                              {isCurrentTicket ? (
                                <span className='text-[10px] font-bold uppercase tracking-[0.16em] opacity-80'>
                                  Current roll
                                </span>
                              ) : null}
                              <span className='text-4xl font-black'>
                                {ticket.roll_number}
                              </span>
                            </li>
                          );
                        })}
                      </ol>
                    )}

                    <span
                      className='sr-only'
                      aria-live='polite'>{`${title}, page ${currentPage + 1} of ${totalPages}`}</span>
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MasterQueue;
