/** @format */

import { useContext, useEffect, useState } from "react";
import { Input } from "../Components/UI/Input";
import { Label } from "../Components/UI/Label";
import AuthContext from "../Context/Context";
import { getTicketForAccount, sellTicket } from "../Api/Api";
import { useForm } from "react-hook-form";
import moment from "moment/moment";

const Home = () => {
  const { server, characteristics, token } = useContext(AuthContext);
  const [tickets, setTickets] = useState([]);
  const { register, handleSubmit, reset } = useForm();
  const [ticketId, setTicketId] = useState(null);

  const uui =
    "	00001800-0000-1000-8000-00805f9b34fb, 00001801-0000-1000-8000-00805f9b34fb, 0000180a-0000-1000-8000-00805f9b34fb, 000018f0-0000-1000-8000-00805f9b34fb, 49535343-fe7d-4ae5-8fa9-9fafd205e455, e7810a71-73ae-499d-8c15-faa9aef0c3f2";

  // Step 3: Send Data to Printer (write data to characteristic)
  // async function printData(characteristicUUID, data) {
  //   try {
  //     if (!server || !server.connected) {
  //       console.error("GATT server is not connected yet.");
  //       return;
  //     }

  //     const service = await server.getPrimaryService(
  //       "49535343-fe7d-4ae5-8fa9-9fafd205e455"
  //     ); // Replace with correct UUID
  //     const characteristic = await service.getCharacteristic(
  //       characteristicUUID
  //     );
  //     // let encoder = new ReceiptPrinterEncoder({
  //     //   codepageMapping: {
  //     //     cp437: 0x00,
  //     //     cp850: 0x02,
  //     //     cp860: 0x03,
  //     //     cp863: 0x04,
  //     //     cp865: 0x05,
  //     //     cp851: 0x0b,
  //     //     cp847: 0x13,
  //     //   },
  //     // });
  //     // let encoder = new ReceiptPrinterEncoder({
  //     //   codepageCandidates: [
  //     //     "cp437",
  //     //     "cp858",
  //     //     "cp860",
  //     //     "cp861",
  //     //     "cp863",
  //     //     "cp865",
  //     //     "cp852",
  //     //     "cp857",
  //     //     "cp855",
  //     //     "cp866",
  //     //     "cp869",
  //     //     "cp847",
  //     //   ],
  //     // });

  //     // let result = encoder
  //     //   .codepage("auto")
  //     //   .line("The is the first line")
  //     //   .line("And this is the second")
  //     //   .line("তানজিদ")
  //     //   .encode();
  //     // let result = encoder
  //     //   .codepage("auto")
  //     //   .text("Iñtërnâtiônàlizætiøn")
  //     //   .line("διεθνοποίηση")
  //     //   .line("интернационализация")
  //     //   .line("তানজিদ")
  //     //   .encode();
  //     const setCp874 = new Uint8Array([0x1b, 0x74, 0x1d]); // Try CP874 (Thai)
  //     await characteristic.writeValue(setCp874);

  //     // const printData = new Uint8Array(result);
  //     // const setUtf8Mode = new Uint8Array([0x1b, 0x74, 0x20]); // Adjust based on your printer
  //     // const setCp874 = new Uint8Array([0x1b, 0x74, 0x1d]); // Try CP874 (Thai)
  //     // await characteristic.writeValue(setCp874);

  //     // Encode Bangla text to UTF-8
  //     // const encodedData = new TextEncoder().encode(data);

  //     // Write commands
  //     // await sendInChunks(characteristic, result);
  //     await characteristic.writeValue("তানজিদ।");
  //     console.log("UTF-8 Code Page Set!");

  //     // await characteristic.writeValue(encodedData);
  //     console.log("✅ Print command sent!");
  //   } catch (error) {
  //     console.error("Error printing data:", error);
  //   }
  // }

  useEffect(() => {
    getTickets();
  }, []);
  const getTickets = async () => {
    try {
      await getTicketForAccount(token)
        .then((res) => res.json())
        .then((data) => {
          setTickets(data);
        });
    } catch (error) {
      console.log(error.message);
    }
  };

  async function printBanglaWithCharsets(text) {
    try {
      if (!server || !server.connected) {
        console.error("GATT server is not connected yet.");
        return;
      }

      const service = await server.getPrimaryService(
        "49535343-fe7d-4ae5-8fa9-9fafd205e455"
      );
      const characteristic = await service.getCharacteristic(
        characteristics[1].uuid
      );

      // Encode Bangla text
      const encodedText = new TextEncoder().encode(text);
      await characteristic.writeValue(encodedText);

      // // Feed paper (optional)
      // const feed = new Uint8Array([0x1b, 0x64, 0x03]); // ESC d 3 (feed 3 lines)
      // await characteristic.writeValue(feed);
    } catch (error) {
      console.error("Error printing Bangla:", error);
    }
  }

  const ESC = String.fromCharCode(0x1b); // ESC control character
  const BOLD_ON = `${ESC}E${String.fromCharCode(0x01)}`; // Bold on
  const BOLD_OFF = `${ESC}E${String.fromCharCode(0x00)}`; // Bold off
  const ALIGN_CENTER = `${ESC}a${String.fromCharCode(0x01)}`; // Center align
  // const FONT_m = `${ESC}!${String.fromCharCode(0x00)}`; // Reset font size to default
  // const FONT_s = `${ESC}!${String.fromCharCode(0x01)}`; // Font size 12
  // const FONT_l = `${ESC}!${String.fromCharCode(0x11)}`;
  // const FONT_xl = `${ESC}!${String.fromCharCode(0x22)}`;
  const FONT_S = `${ESC}M${String.fromCharCode(0x01)}`; // Use Font B (9x17 dots)
  const FONT_M = `${ESC}M${String.fromCharCode(0x00)}`; // Back to Font A

  // **Increase font size (Double Height & Width) only for price**
  const FONT_XL = `${ESC}!${String.fromCharCode(0x30)}`; // Double width + height
  const RESET_SIZE = `${ESC}!${String.fromCharCode(0x00)}`; // Reset to normal
  const FEED_PAPER = `${ESC}d${String.fromCharCode(0x01)}`; // Feed paper by 1 line
  const NEW_LINE = `\n`;

  const formattedDate = moment().format("DD/MM/YYYY"); // e.g., "2/9/2025"
  const formattedTime = moment().format("h:mm a");

  const handleTicket = async (data) => {
    console.log(data);
    const value = {
      ticket: ticketId,
      sold_to: data.sold_to,
      roll_number: data.roll_number,
    };
    await sellTicket(token, value)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        const text_data =
          `${ALIGN_CENTER}${BOLD_ON}${FONT_S}${data.header}${BOLD_OFF}${NEW_LINE}` +
          `${BOLD_ON}${FONT_M}${data.title}${BOLD_OFF}${NEW_LINE}` +
          // `${FONT_S}Date: ${formattedDate} Time:${formattedTime}  ${NEW_LINE}` +
          `${BOLD_ON}${FONT_M}${data.ticket_serial}${BOLD_OFF} ${NEW_LINE}` +
          `${BOLD_ON}${FONT_M}Test Fee: ${Number(
            data.amount
          )} TK ${BOLD_OFF}${NEW_LINE}` +
          `${FONT_M}Roll No: ${data.roll_number}${NEW_LINE}` +
          `${FONT_S}Developed By: XELOTEK${NEW_LINE}${NEW_LINE}${NEW_LINE}${NEW_LINE}`;
        console.log(text_data);
        printBanglaWithCharsets(text_data);
        reset();
      });
  };
  return (
    <div>
      <h1 className='text-center font-bold text-xl m-4'>Entry Ticket</h1>

      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mx-10 mt-10'>
        {tickets.map((ticket) => (
          <button
            onClick={() => {
              document.getElementById("my_modal_5").showModal();
              setTicketId(ticket.id);
            }}
            className=' border-2 flex flex-col h-22  bg-white border-primary text-primary  btn hover:bg-primary hover:text-white '
            key={ticket.id}>
            <span className='font-semibold text-xl'>{ticket.type}</span>{" "}
            <span className='font-bold'>{Number(ticket.amount)}</span>
          </button>
        ))}
      </div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}

      <dialog id='my_modal_5' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box'>
          <form method='dialog'>
            {/* if there is a button in form, it will close the modal */}
            <button
              id='close_button'
              className='btn btn-sm btn-circle btn-ghost absolute right-2 top-2'>
              ✕
            </button>
          </form>
          <h3 className='font-bold text-lg'>Print Ticket</h3>
          <form action='' onSubmit={handleSubmit(handleTicket)}>
            <div className='grid gap-4 py-4'>
              <div className='grid grid-cols-4 items-center gap-4'>
                <Label htmlFor='name' className='text-right'>
                  Name:
                </Label>
                <Input
                  id='name'
                  {...register("sold_to")}
                  placeholder='Enter name'
                  className='col-span-3'
                />
                <Label htmlFor='roll_no' className='text-right'>
                  Roll No:
                </Label>
                <Input
                  select='true'
                  id='roll_no'
                  {...register("roll_number")}
                  placeholder='Enter roll No'
                  className='col-span-3'
                />
              </div>
            </div>
            <div className='flex justify-end'>
              <input
                className='btn  btn-accent'
                value={"Print"}
                type='submit'
              />
            </div>
          </form>
        </div>
      </dialog>
    </div>
  );
};

export default Home;
