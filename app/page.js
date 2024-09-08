"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [records, setRecords] = useState([]);
  const [nameInput, setNameInput] = useState("");
  const [typeInput, setTypeInput] = useState("");

  async function getRecord() {
    try {
      const response = await axios.get("/api/record");
      setRecords(response.data.process || []);
    } catch {
      console.log("error");
    }
  }

  useEffect(() => {
    getRecord();
  }, []);

  async function submitRecord(e) {
    e.preventDefault();
    try {
      await axios.post("/api/record", {
        type: typeInput,
        name: nameInput,
      });

      alert("เพิ่มข้อมูลเสร็จสิ้น");
      setNameInput("");
      setTypeInput("");

      getRecord();
    } catch {
      console.log("error");
    }
  }

  async function deleteRecord(deleted_id) {
    try {
      await axios.delete("/api/record", {
        headers: {
          "Content-Type": "application/json",
        },
        data: {
          id: deleted_id,
        },
      });
      getRecord();
    } catch (error) {
      console.log("Error deleting record:", error);
    }
  }

  return (
    <div className="flex flex-col justify-center items-center mt-10">
      <h1 className="text-[2rem] text-center mb-10">All records</h1>
      <table className="w-full max-w-screen-2xl mx-auto border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100 border-b">
            <th className="p-4 text-left text-gray-600">ประเภท</th>
            <th className="p-4 text-left text-gray-600">ชื่อ</th>
            <th className="p-4 text-left text-gray-600">เวลาที่เริ่ม</th>
            <th className="p-4 text-left text-gray-600">เวลาที่เสร็จสิ้น</th>
            <th className="p-4 text-left text-gray-600">สถานะ</th>
            <th className="p-4 text-left text-gray-600">เวลาที่บันทึกข้อมูล</th>
            <th className="p-4 text-left text-gray-600">
              เวลาที่ปรับปรุงข้อมูลล่าสุด
            </th>
          </tr>
        </thead>
        <tbody>
          {records.map((data, index) => (
            <tr key={index} className="border-b relative">
              <td className="p-4 text-gray-300">{data.type}</td>
              <td className="p-4 text-gray-300">{data.name}</td>
              <td className="p-4 text-gray-300">{data.start_time}</td>
              <td className="p-4 text-gray-300">{data.finish_time}</td>
              <td className="p-4 text-gray-300">{data.status}</td>
              <td className="p-4 text-gray-300">{data.created_at}</td>
              <td className="p-4 text-gray-300">{data.updated_at}</td>
              <button
                onClick={() => deleteRecord(data.id)}
                className="absolute top-0"
              >
                X
              </button>
            </tr>
          ))}
        </tbody>
      </table>

      <form
        onSubmit={submitRecord}
        className="flex flex-col gap-[5px] mt-10 bg-slate-600 rounded-lg p-[12px]"
      >
        <div className="flex items-center gap-[10px]">
          <lable>ประเภท</lable>
          <input
            value={typeInput}
            onChange={(e) => setTypeInput(e.target.value)}
            className="text-black p-[5px]"
            type="text"
          />
        </div>
        <div className="flex items-center gap-[10px]">
          <lable>ชื่อ</lable>
          <input
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="text-black p-[5px]"
            type="text"
          />
        </div>

        <button type="submit" className="mt-[20px]">
          เพิ่มข้อมูล
        </button>
      </form>
    </div>
  );
}
