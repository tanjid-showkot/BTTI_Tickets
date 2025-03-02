/** @format */
import moment from "moment/moment";
import { useContext, useEffect, useRef, useState } from "react";
import { DayPicker } from "react-day-picker";
import { getSoldTicketRange, getUser } from "../Api/Api";
import AuthContext from "../Context/Context";
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
          (filters.refund_status === "" ||
            ticket.refund_status !== "not_refunded") &&
          (filters.used === "" || ticket.used === true) &&
          (filters.accountant === "" ||
            ticket.accountant === filters.accountant)
        );
      })
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
      footer = `${moment(range.from).format("LL")}–${moment(range.to).format(
        "LL"
      )}`;
    }
  }
  useEffect(() => {
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
    setRange(newRange);
    if (newRange) {
      try {
        await getSoldTicketRange(
          token,
          moment(newRange.from).format("YYYY-MM-DD"),
          moment(newRange.to).format("YYYY-MM-DD")
        )
          .then((res) => res.json())
          .then((data) => {
            setSoldTicketRange(data);
            console.log(data);
          });
      } catch (error) {
        console.log(error.message);
      }
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
    <div>
      <div className='lg:flex w-full justify-between items-center mt-4'>
        <h1 className=' text-2xl font-bold lg:w-[40%]  ms-4'>Sales Record</h1>
        <div className='lg:flex justify-end lg:me-20 lg:w-[60%]   '>
          <div className='relative my-4 flex justify-center lg:w-[50%]   '>
            {/* <div popover='auto' id='rdp-popover' className='dropdown'></div> */}
            <fieldset className='fieldset w-full mx-3'>
              {/* <legend className='fieldset-legend'>Select Date</legend> */}
              <input
                type='text'
                readOnly
                value={footer}
                onClick={() => setShowPicker(!showPicker)}
                placeholder='Select day range'
                className='input min-w-full input-info'
              />
            </fieldset>
            {showPicker && (
              <div
                ref={pickerRef}
                className='absolute  z-10 mt-2 bg-white shadow-lg border p-2'>
                <DayPicker
                  mode='range'
                  className='react-day-picker shadow-lg p-5  '
                  selected={range}
                  footer={footer}
                  onSelect={getSoldTicket}
                  classNames={{
                    today: `fill-green-500 bg-green-500 rounded-full text-base text-white font-bold `,
                    chevron: "w-6 h-6 fill-green-500", // Chevron (arrow) color
                  }}
                />
              </div>
            )}
          </div>
          <div className='flex justify-center w-full lg:w-[50%] items-center gap-4'>
            <fieldset className='fieldset w-[50%]'>
              {/* <legend className='fieldset-legend'>Accounts</legend> */}
              <select
                name='accountant'
                value={filters.accountant}
                onChange={handleFilterChange}
                className='select select-primary '>
                <option value=''>Select Account</option>
                {accounts.map((account) => (
                  <option key={account.id} value={account.username}>
                    {account.username}
                  </option>
                ))}
              </select>
            </fieldset>
            <div className='filter  w-[50%] '>
              <input
                onClick={handleReset}
                className='btn filter-reset'
                type='radio'
                name='metaframeworks'
                aria-label='All'
              />
              <input
                className='btn'
                type='radio'
                name='refund_status'
                aria-label='Refunded'
                value='true'
                checked={filters.refund_status === "true"}
                onChange={handleFilterChange}
              />
              <input
                className='btn'
                type='radio'
                name='used'
                aria-label='Used'
                value='true'
                checked={filters.used === "true"}
                onChange={handleFilterChange}
              />
            </div>
            {/* <form className='filter w-[40%] '>
              <input
                onClick={handleReset}
               
                className='btn btn-square'
                type='reset'
                value='×'
              />
              <input
                className='btn'
                type='radio'
                name='refund_status'
                aria-label='Refunded'
                value='true'
                checked={filters.refund_status === "true"}
                onChange={handleFilterChange}
              />
              <input
                className='btn'
                type='radio'
                name='used'
                aria-label='Used'
                value='true'
                checked={filters.used === "true"}
                onChange={handleFilterChange}
              />
            </form> */}
          </div>
        </div>
      </div>
      <div>
        <div
          className={` ${
            filterTicket < 1 && "hidden"
          } flex md:flex-col mx-3 justify-between`}>
          <p className=''>
            Total count: <strong>{filterTicket.length}</strong>{" "}
          </p>
          <p>
            Total Amount:{" "}
            <strong>
              {filterTicket.reduce(
                (sum, d) => sum + (Number(d.amount) || 0),
                0
              )}
            </strong>
          </p>
        </div>
        <div className={`${filterTicket < 1 && "hidden"}`}>
          <div className='overflow-x-auto'>
            <table className='table table-xs'>
              <thead>
                <tr>
                  <th></th>
                  <th>Date</th>
                  <th>Ticket Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Roll No</th>
                  <th>Sold By</th>
                  <th>Refunded Status</th>
                  <th>Refunded By</th>
                </tr>
              </thead>
              <tbody>
                {filterTicket.map((soldTicket, index) => (
                  <tr className='m-4' key={soldTicket.id}>
                    <th>{index + 1}</th>
                    <td>{moment(soldTicket.date).format("YYYY-MM-DD")}</td>
                    <td>{soldTicket.ticket_type}</td>
                    <td>{Number(soldTicket.amount)}</td>

                    <td>{soldTicket.used ? "used" : "not Used"}</td>
                    <td>{soldTicket.roll_number}</td>
                    <td>{soldTicket.accountant}</td>
                    <td>{soldTicket.refund_status}</td>
                    <td>{soldTicket.refund_verifier}</td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr>
                  <th></th>
                  <th>Date</th>
                  <th>Ticket Type</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Roll No</th>
                  <th>Sold By</th>
                  <th>Refunded Status</th>
                  <th>Refunded By</th>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sales;
