/** @format */
import moment from "moment/moment";
import { useContext, useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { getSoldTicketRange, getUser } from "../Api/Api";
import AuthContext from "../Context/Context";
import { CSVLink } from "react-csv";
import * as Select from "@radix-ui/react-select";
import { CalendarDays, Check, ChevronDown } from "lucide-react";

const Sales = () => {
  const [range, setRange] = useState({ from: "", to: "" });
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef(null);
  const { token } = useContext(AuthContext);
  const [accounts, setAccounts] = useState([]);
  const [soldTicketRange, setSoldTicketRange] = useState([]);
  const [filterTicket, setFilterTicket] = useState([]);
  const [filters, setFilters] = useState({
    accountant: "",
    used: "",
    refund_status: "",
  });

  const headers = [
    { label: "Date", key: "date" },
    { label: "Id", key: "id" },
    { label: "Ticket Type", key: "ticket_type" },
    { label: "Amount", key: "amount" },
    { label: "Ticket Serial", key: "ticket_serial" },
    { label: "Roll_number", key: "roll_number" },
    { label: "Sold By", key: "accountant" },
    { label: "status", key: "refund_status" },
    { label: "Refunded By", key: "refund_verifier" },
  ];
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
    }));
  };
  const calFilter = () => {
    console.log("called");
    console.log(filters);
    setFilterTicket(
      soldTicketRange.filter((ticket) => {
        return (
          (filters.refund_status === ""
            || ticket.refund_status !== "not_refunded")
          && (filters.used === "" || ticket.used === true)
          && (filters.accountant === ""
            || ticket.accountant === filters.accountant)
        );
      }),
    );
  };

  useEffect(() => {
    calFilter();
  }, [filters, soldTicketRange]);

  let footer = `Please pick the first day.`;
  if (range?.from) {
    if (!range.to) {
      footer = moment(range.from).format("LL");
    } else if (range.to) {
      const sameDay =
        new Date(range.from).setHours(0, 0, 0, 0)
        === new Date(range.to).setHours(0, 0, 0, 0);

      footer = sameDay
        ? moment(range.from).format("LL")
        : `${moment(range.from).format("LL")}–${moment(range.to).format("LL")}`;
    }
  }
  useEffect(() => {
    const today = new Date();
    const initialRange = {
      from: new Date(today.setHours(0, 0, 0, 0)),
      to: new Date(today.setHours(23, 59, 59, 999)),
    };

    setRange(initialRange);
    getSoldTicket(initialRange);
    getUsers();
  }, []);

  useEffect(() => {
    function handleClickOutside(event) {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getUsers = async () => {
    try {
      await getUser(token)
        .then((res) => res.json())
        .then((data) => {
          setAccounts(data.filter((user) => user.user_type === "account"));
        });
    } catch (error) {
      console.log(error.message);
      // setError(error.message);
    }
  };

  const getSoldTicket = async (newRange) => {
    const safeRange = {
      from: newRange?.from ?? "",
      to: newRange?.to ?? "",
    };

    setRange(safeRange);

    if (!safeRange.from || !safeRange.to) {
      return;
    }

    try {
      await getSoldTicketRange(
        token,
        moment(safeRange.from).format("YYYY-MM-DD"),
        moment(safeRange.to).format("YYYY-MM-DD"),
      )
        .then((res) => res.json())
        .then((data) => {
          setSoldTicketRange(data);
          setShowPicker(false);
          console.log(data);
        });
    } catch (error) {
      console.log(error.message);
    }
  };
  const handleReset = () => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      refund_status: "",
      used: "",
    }));
    console.log("Filters reset:", filters);
    calFilter();
  };

  return (
    <div className='p-4 md:p-6'>
      <div className='mx-auto max-w-7xl'>
        <div className='mb-6 rounded-[1.5rem] border border-sky-100 bg-white/90 p-5 shadow-[0_24px_60px_-36px_rgba(37,99,235,0.35)]'>
          <div className='flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between'>
            <div>
              <p className='text-[10px] font-semibold uppercase tracking-[0.22em] text-sky-600'>
                Reports
              </p>
              <h1 className='mt-2 text-3xl font-black text-slate-800'>
                Sales Record
              </h1>
            </div>

            <div className='flex w-full flex-col gap-3 xl:max-w-3xl xl:flex-row xl:items-center xl:justify-end'>
              <div className='relative min-w-[14rem] flex-1'>
                <button
                  type='button'
                  onClick={() => setShowPicker(!showPicker)}
                  className='flex w-full items-center gap-3 rounded-2xl border border-sky-100 bg-sky-50/80 px-3 py-2.5 text-left transition hover:border-sky-200 hover:bg-sky-50'>
                  <CalendarDays className='h-4 w-4 text-sky-600' />
                  <span className='flex-1 truncate text-sm font-medium text-slate-700'>
                    {footer || "Select day range"}
                  </span>
                  <span className='rounded-full bg-white px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] text-sky-700 ring-1 ring-sky-100'>
                    Range
                  </span>
                </button>

                {showPicker && (
                  <div
                    ref={pickerRef}
                    className='absolute left-0 top-full z-20 mt-2 w-full min-w-[18rem] max-w-[22rem] rounded-[1.5rem] border border-sky-100 bg-white p-3 shadow-[0_24px_55px_-35px_rgba(37,99,235,0.4)]'>
                    <DayPicker
                      mode='range'
                      className='react-day-picker rounded-xl p-2'
                      selected={range}
                      footer={footer}
                      onSelect={getSoldTicket}
                      resetOnSelect
                    />
                  </div>
                )}
              </div>

              <div className='w-full xl:max-w-[15rem]'>
                <Select.Root
                  value={filters.accountant || "all"}
                  onValueChange={(value) =>
                    setFilters((prevFilters) => ({
                      ...prevFilters,
                      accountant: value === "all" ? "" : value,
                    }))
                  }>
                  <Select.Trigger className='flex w-full items-center justify-between rounded-2xl border border-sky-100 bg-white px-3 py-2.5 text-sm text-slate-700 shadow-sm outline-none transition hover:border-sky-200 focus:border-sky-300'>
                    <Select.Value placeholder='Select Account' />
                    <Select.Icon>
                      <ChevronDown className='h-4 w-4 text-sky-600' />
                    </Select.Icon>
                  </Select.Trigger>
                  <Select.Portal>
                    <Select.Content
                      position='popper'
                      sideOffset={8}
                      className='z-50 rounded-2xl border border-sky-100 bg-white p-1 shadow-[0_20px_50px_-32px_rgba(37,99,235,0.45)]'>
                      <Select.Viewport>
                        <Select.Item
                          value='all'
                          className='flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-700 outline-none hover:bg-sky-50'>
                          <Select.ItemText>All Accounts</Select.ItemText>
                          {filters.accountant === "" && (
                            <Check className='h-4 w-4 text-sky-600' />
                          )}
                        </Select.Item>
                        {accounts.map((account) => (
                          <Select.Item
                            key={account.id}
                            value={account.username}
                            className='flex cursor-pointer items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-700 outline-none hover:bg-sky-50'>
                            <Select.ItemText>
                              {account.username}
                            </Select.ItemText>
                            {filters.accountant === account.username && (
                              <Check className='h-4 w-4 text-sky-600' />
                            )}
                          </Select.Item>
                        ))}
                      </Select.Viewport>
                    </Select.Content>
                  </Select.Portal>
                </Select.Root>
              </div>

              <div className='flex items-center gap-2 rounded-2xl border border-sky-100 bg-sky-50/80 p-1'>
                <button
                  type='button'
                  onClick={handleReset}
                  className={`btn btn-sm rounded-xl ${filters.refund_status === "" && filters.used === "" ? "btn-primary" : "btn-outline text-slate-600"}`}>
                  All
                </button>
                <button
                  type='button'
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      refund_status: "true",
                      used: "",
                    }))
                  }
                  className={`btn btn-sm rounded-xl ${filters.refund_status === "true" ? "btn-primary" : "btn-outline text-slate-600"}`}>
                  Refunded
                </button>
                <button
                  type='button'
                  onClick={() =>
                    setFilters((prev) => ({
                      ...prev,
                      used: "true",
                      refund_status: "",
                    }))
                  }
                  className={`btn btn-sm rounded-xl ${filters.used === "true" ? "btn-primary" : "btn-outline text-slate-600"}`}>
                  Used
                </button>
              </div>

              {filterTicket.length > 0 && (
                <CSVLink
                  data={filterTicket}
                  headers={headers}
                  filename={"sales-record.csv"}
                  className='btn btn-secondary btn-sm rounded-xl whitespace-nowrap'
                  target='_blank'>
                  Download CSV
                </CSVLink>
              )}
            </div>
          </div>
        </div>

        <div className='rounded-[1.5rem] border border-sky-100 bg-white/90 p-4 shadow-[0_24px_60px_-36px_rgba(37,99,235,0.35)]'>
          <div className='mb-4 flex flex-col gap-2 px-2 sm:flex-row sm:items-center sm:justify-between'>
            <div className='text-sm text-slate-500'>
              Total count:{" "}
              <span className='font-bold text-slate-800'>
                {filterTicket.length}
              </span>
            </div>
            <div className='text-sm text-slate-500'>
              Total Amount:{" "}
              <span className='font-bold text-slate-800'>
                {filterTicket.reduce(
                  (sum, d) => sum + (Number(d.amount) || 0),
                  0,
                )}
              </span>
            </div>
          </div>

          {filterTicket.length > 0 ? (
            <div className='overflow-x-auto rounded-2xl border border-sky-100'>
              <table className='sales-table table table-sm w-full'>
                <thead className='bg-sky-50 text-slate-700'>
                  <tr>
                    <th className='text-left'>#</th>
                    <th className='text-left'>Date</th>
                    <th className='text-left'>Ticket Type</th>
                    <th className='text-left'>Amount</th>
                    <th className='text-left'>Ticket Serial</th>
                    <th className='text-left'>Roll No</th>
                    <th className='text-left'>Sold By</th>
                    <th className='text-left'>Status</th>
                    <th className='text-left'>Refunded By</th>
                  </tr>
                </thead>
                <tbody>
                  {filterTicket.map((soldTicket, index) => (
                    <tr key={soldTicket.id} className='sales-row'>
                      <th className='font-medium text-slate-500'>
                        {index + 1}
                      </th>
                      <td className='font-medium text-slate-700'>
                        {moment(soldTicket.date).format("YYYY-MM-DD")}
                      </td>
                      <td className='text-slate-700'>
                        {soldTicket.ticket_type}
                      </td>
                      <td className='font-semibold text-slate-800'>
                        {Number(soldTicket.amount)}
                      </td>
                      <td className='text-slate-700'>
                        {soldTicket.ticket_serial}
                      </td>
                      <td className='text-slate-700'>
                        {soldTicket.roll_number}
                      </td>
                      <td className='text-slate-700'>
                        {soldTicket.accountant}
                      </td>
                      <td>
                        <span
                          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
                            !soldTicket.used && soldTicket.refund_status
                              ? "bg-amber-100 text-amber-700"
                              : "bg-emerald-100 text-emerald-700"
                          }`}>
                          {!soldTicket.used && soldTicket.refund_status
                            ? soldTicket.refund_status
                            : "Used"}
                        </span>
                      </td>
                      <td className='text-slate-700'>
                        {soldTicket.refund_verifier}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className='rounded-2xl border border-dashed border-sky-200 bg-sky-50/70 px-6 py-12 text-center text-sm text-slate-500'>
              No sales records match the selected filters.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sales;
