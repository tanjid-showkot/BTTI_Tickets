/** @format */

import { Input } from "../Components/UI/Input";
import { Label } from "../Components/UI/Label";

const Home = () => {
  const uui =
    "	00001800-0000-1000-8000-00805f9b34fb, 00001801-0000-1000-8000-00805f9b34fb, 0000180a-0000-1000-8000-00805f9b34fb, 000018f0-0000-1000-8000-00805f9b34fb, 49535343-fe7d-4ae5-8fa9-9fafd205e455, e7810a71-73ae-499d-8c15-faa9aef0c3f2";
  let server; // Declare the server globally to access it across functions

  // Step 1: Connect to Printer and Get the GATT Server
  async function connectToPrinter() {
    try {
      const device = await navigator.bluetooth.requestDevice({
        acceptAllDevices: true,
        // Adjust service UUID as needed
      });

      console.log("Printer device selected:", device.name);

      // Step 2: Connect to the GATT server
      server = await device.gatt.connect(); // Store the GATT server in the global variable
      console.log("Connected to GATT server:", server);

      // Step 3: Get Primary Services (Confirm connection first)
      if (server && server.connected) {
        const services = await server.getPrimaryServices();
        console.log("Services found:", services);

        return services;
      } else {
        console.error("Server is not connected.");
      }
    } catch (error) {
      console.error("Error connecting to printer:", error);
    }
  }

  // Step 2: Retrieve Characteristics from a Specific Service
  async function getCharacteristics(serviceUUID) {
    try {
      // Check if the GATT server is connected before trying to access services
      if (!server || !server.connected) {
        console.error("GATT server is not connected yet.");
        return;
      }

      console.log("Attempting to get primary service using UUID:", serviceUUID);

      // Get the specific primary service using the serviceUUID
      const service = await server.getPrimaryService(serviceUUID);
      console.log("Service found:", service);

      // Get characteristics of the service
      const characteristics = await service.getCharacteristics();
      console.log("Characteristics found:", characteristics);

      // Iterate through characteristics to find the one you need
      for (const characteristic of characteristics) {
        console.log(`Characteristic UUID: ${characteristic.uuid}`);
        // You can send print data to the relevant characteristic here
      }
    } catch (error) {
      console.error("Error finding characteristics:", error);
    }
  }

  // Step 3: Send Data to Printer (write data to characteristic)
  async function printData(characteristicUUID, data) {
    try {
      if (!server || !server.connected) {
        console.error("GATT server is not connected yet.");
        return;
      }

      const service = await server.getPrimaryService(
        "49535343-fe7d-4ae5-8fa9-9fafd205e455"
      ); // Replace with correct UUID
      const characteristic = await service.getCharacteristic(
        characteristicUUID
      ); // Access the characteristic
      // Command to select a different font, if necessary
      const fontSwitchCommand = new Uint8Array([0x1b, 0x4d, 0x01]); // Example ESC command to switch font (adjust as needed)

      // Send the font switch command first
      await characteristic.writeValue(fontSwitchCommand);
      console.log("Font switched successfully!");
      const encodedData = new TextEncoder().encode(data); // Encode print data
      await characteristic.writeValue(encodedData); // Write the data to the characteristic

      console.log("✅ Print command sent!");
    } catch (error) {
      console.error("Error printing data:", error);
    }
  }

  const ESC = String.fromCharCode(0x1b); // ESC control character
  const boldOn = `${ESC}E${String.fromCharCode(0x01)}`; // Bold on
  const boldOff = `${ESC}E${String.fromCharCode(0x00)}`; // Bold off

  // Example data with two lines of space before and after
  const data = `\n\n${boldOn}This is a bold line with two lines of space before!\n${boldOff}\nরায়হান বিল্লাহ\n\n${boldOn}This is another bold line with space before and after!\n${boldOff}.`;
  const feedPaper = `${ESC}d${String.fromCharCode(0x05)}`; // Feed 5 lines (0x05 is the number of lines to feed)

  // Combine print data and feed command
  const printDat = data + feedPaper;

  return (
    <div>
      <h1 className='text-center font-bold text-xl m-4'>Entry Ticket</h1>
      <button onClick={connectToPrinter} className='btn btn-primary'>
        connectToPrinter
      </button>
      <button
        onClick={() =>
          getCharacteristics("49535343-fe7d-4ae5-8fa9-9fafd205e455")
        }
        className='btn btn-primary'>
        getCharacteristics
      </button>
      <button
        onClick={() =>
          printData("49535343-8841-43f4-a8d4-ecbe34729bb3", printDat)
        }
        className='btn btn-primary'>
        printData
      </button>
      <div className='grid grid-cols-1 lg:grid-cols-3 gap-8 mx-10 mt-10'>
        <button
          onClick={() => document.getElementById("my_modal_5").showModal()}
          className=' border-2 flex flex-col h-22  bg-white border-primary text-primary  btn hover:bg-primary hover:text-white '>
          <span className='font-semibold text-xl'>Light And Motorcycle</span>{" "}
          <span className='font-bold'>300</span>
        </button>
        <button
          onClick={() => document.getElementById("my_modal_5").showModal()}
          className=' border-2 flex flex-col h-22  bg-white border-primary text-primary  btn hover:bg-primary hover:text-white '>
          <span className='font-semibold text-xl'>Light </span>{" "}
          <span className='font-bold'>200</span>
        </button>
        <button
          onClick={() => document.getElementById("my_modal_5").showModal()}
          className=' border-2 flex flex-col h-22  bg-white border-primary text-primary  btn hover:bg-primary hover:text-white '>
          <span className='font-semibold text-xl'>Motorcycle</span>{" "}
          <span className='font-bold'>100</span>
        </button>
      </div>
      {/* Open the modal using document.getElementById('ID').showModal() method */}

      <dialog id='my_modal_5' className='modal modal-bottom sm:modal-middle'>
        <div className='modal-box'>
          <h3 className='font-bold text-lg'>Print Ticket</h3>
          <div className='grid gap-4 py-4'>
            <div className='grid grid-cols-4 items-center gap-4'>
              <Label htmlFor='name' className='text-right'>
                Roll No:
              </Label>
              <Input
                id='roll_no'
                placeholder='Enter your Roll No'
                className='col-span-3'
              />
            </div>
          </div>
          <div className='modal-action'>
            <form method='dialog'>
              {/* if there is a button in form, it will close the modal */}
              <button className='btn btn-accent'>Print</button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Home;
