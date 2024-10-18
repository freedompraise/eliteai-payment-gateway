"use client";
import { CompactTable } from "@table-library/react-table-library/compact";

import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { ChevronLeft } from "lucide-react";
import { filterData } from "./utils/helpers";

interface Params {
  setShowDashboard: React.Dispatch<React.SetStateAction<boolean>>;
  setAdminCode: React.Dispatch<React.SetStateAction<string>>;
}

export default function AdminDashboard({
  setShowDashboard,
  setAdminCode,
}: Params) {
  const [data, setData] = useState<
    {
      referrer: string;
      referrals: Array<{ name: string; date: string }>;
    }[]
  >([]);
  const [program, setProgram] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [filterDate, setFilterDate] = useState("");

  useEffect(() => {
    setData([]);
  }, [program]);

  useEffect(() => {
    async function getRows() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/${
            program == 0
              ? "get-row"
              : program == 1
              ? "get-row/sheet-4"
              : "get-rows-paid"
          }`
        );
        if (!response.ok) {
          setIsLoading(false);
          toast.error("Can't retrieve data at the moment");
        }
        const rowData = await response.json();
        setData(rowData);
        setIsLoading(false);
        // return formattedData;
      } catch (error) {
        console.error("Error fetching row:", error);
      }
    }

    getRows();
  }, [program]);

  const filteredData = filterDate ? filterData(filterDate, data) : data;
  // console.log(data);

  return (
    <div className="h-screen w-screen fixed overflow-auto top-0 right-0 bg-black z-40">
      <div className="relative h-full w-full flex items-center justify-center py-10">
        <div className=" h-full w-full text-white bg-black px-4 md:px-[80px] pb-[10rem]">
          <div className="flex space-x-2 pb-10 items-center">
            <button
              onClick={() => {
                setShowDashboard(false);
                setAdminCode("");
              }}
            >
              <ChevronLeft />
            </button>
            <h1 className="text-xl font-semibold text-white/70">Dashboard</h1>
          </div>
          <div className="p-4 bg-white/5 rounded border border-accent/10">
            <div className="pb-4 flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0 gap-4">
              <h2>Referrals</h2>
              <div className="md:space-x-4 space-y-3 md:space-y-0">
                <input
                  type="text"
                  placeholder="Enter date range (dd/mm/yyyy-dd/mm/yyyy)"
                  value={filterDate}
                  onChange={(e) => setFilterDate(e.target.value)}
                  className="bg-transparent text-sm text-accent outline-none w-full md:w-[20rem] border border-accent/30 px-2 py-1 rounded"
                />
                <select
                  id="programs"
                  defaultValue={"0"}
                  value={program}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                    setProgram(+e.target.value);
                  }}
                  className="bg-transparent text-sm text-accent outline-none border-none"
                >
                  <option value="0">Free Training Program</option>
                  <option value="1">Free Training Program 2</option>
                  <option value="2">Externship Program</option>
                </select>
              </div>
            </div>
            {isLoading && (
              <h3 className="text-sm text-white/40">Loading data...</h3>
            )}
            {!isLoading && filteredData && filteredData.length > 0 && (
              <div className="w-full border border-white/60 overflow-clip rounded !text-sm">
                {/* <CompactTable
                  columns={COLUMNS}
                  data={{ nodes: data }}
                  theme={theme}
                /> */}

                <div className="flex border-b border-b-white/60">
                  <div className="w-1/2 border-r border-r-white/60 p-3">
                    Full name
                  </div>
                  <div className="w-1/2 p-3">Referrals</div>
                </div>

                {filteredData &&
                  filteredData.map((item, idx) => (
                    <div className="flex border-b border-b-white/60" key={idx}>
                      <div className="w-1/2 border-r border-r-white/60 p-3">
                        {item.referrer}
                      </div>
                      <div className="w-1/2 p-3 flex flex-wrap items-center space-x-1">
                        {item.referrals.map((item, idx) => (
                          <p key={idx}>{item.name.trim()},</p>
                        ))}
                        {item.referrals && (
                          <span className="text-white/60 text-xs">
                            {" " + "(" + item.referrals.length + ")"}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
            {(!isLoading && !filteredData) ||
              (!isLoading && filteredData.length == 0 && (
                <div className="w-3xl max-w-3xl border border-white/60 overflow-clip rounded !text-sm">
                  {filterDate && (
                    <h4 className="text-sm p-4">
                      No referral was made on this date.
                    </h4>
                  )}
                  {!filterDate && (
                    <h4 className="text-sm p-4">
                      No one has made referrals yet
                    </h4>
                  )}
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>

    // <h1>hello world</h1>
  );
}
