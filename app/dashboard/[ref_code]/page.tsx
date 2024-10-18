"use client";
import { CompactTable } from "@table-library/react-table-library/compact";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { toast } from "react-toastify";
import { format, parse, isSameDay } from "date-fns"; // Import date-fns functions
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { filterData2 } from "@/app/utils/helpers";

export default function Dashboard() {
  const [data, setData] = useState<
    Array<{ full_name: string; program: string; registration_date: string }>
  >([]);
  const { ref_code } = useParams<{ ref_code: string }>();
  const [isLoading, setIsLoading] = useState(true);
  const [program, setProgram] = useState(0);
  const [filterDate, setFilterDate] = useState("");

  const theme = useTheme([
    getTheme(),
    {
      HeaderRow: `
        background-color: rgb(255 255 255 / 0.05);
        color: rgb(255 255 255 / 0.7);
        font-size: 0.875rem !important;
        line-height: 1.25rem !important;
        
        .th {
            border-bottom: 1px solid rgb(255 255 255 / 0.5);
          }
      `,
      Row: `
       color: #fff;
       background-color: black;
       font-size: 0.875rem !important;
        line-height: 1.25rem !important;
        &:hover {
            background-color: transparent;
            color: white;
        }
        &:not(:last-of-type) .td {
            border-bottom: 1px solid #a0a8ae;
          }
      `,
      BaseCell: `
        &:not(:last-of-type) {
          border-right: 1px solid #a0a8ae;
        }
      `,
    },
  ]);

  useEffect(() => {
    setData([]);
  }, [program]);

  useEffect(() => {
    async function getRowById() {
      setIsLoading(true);
      try {
        const response = await fetch(
          `/api/${program == 0 ? "get-row" : "get-rows-paid"}/${ref_code}`
        );
        if (!response.ok) {
          setIsLoading(false);
          toast.error("Can't retrieve data at the moment");
          return;
        }
        const rowData: string[][] = await response.json();

        const formattedData = rowData.map((item: string[]) => ({
          full_name: item[1],
          program: program == 0 ? item[6] : item[3],
          registration_date: program == 0 ? item[13] : item[4],
        }));
        setData(formattedData);
        setIsLoading(false);
        return formattedData;
      } catch (error) {
        setIsLoading(false);
        console.error("Error fetching row:", error);
        toast.error("Failed to fetch data");
      }
    }

    getRowById();
  }, [program, ref_code]);

  // Filter data based on the selected date
  const filteredData = filterDate ? filterData2(filterDate, data) : data;

  const COLUMNS = [
    { label: "Full Name", renderCell: (item: any) => item.full_name },
    { label: "Program", renderCell: (item: any) => item.program },
    {
      label: "Registration Date",
      renderCell: (item: any) => item.registration_date,
    },
  ];

  return (
    <div className="min-h-[100vh] text-white py-10 bg-black px-4 md:px-[80px]">
      <div className="flex space-x-2 pb-10 items-center">
        <Link href={"/"}>
          <button>
            <ChevronLeft />
          </button>
        </Link>
        <h1 className="text-xl font-semibold text-white/70">Dashboard</h1>
      </div>
      <div className="p-4 bg-white/5 rounded border border-accent/10">
        <div className="pb-4 flex flex-col md:flex-row md:justify-between md:items-center space-y-2 md:space-y-0 gap-4">
          <h2>Referrals</h2>
          <div className="space-x-4">
            <input
              type="text"
              placeholder="Enter date range (dd/mm/yyyy-dd/mm/yyyy)"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
              className="bg-transparent text-sm text-accent outline-none border border-accent/30 px-2 py-1 rounded"
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
              <option value="1">Externship Program</option>
            </select>
          </div>
        </div>

        {isLoading && (
          <h3 className="text-sm text-white/40">Loading data...</h3>
        )}

        {!isLoading && filteredData.length > 0 && (
          <div className="w-full border border-white/60 overflow-clip rounded !text-sm">
            <CompactTable
              columns={COLUMNS}
              data={{ nodes: filteredData }}
              theme={theme}
            />
          </div>
        )}

        {!isLoading && filteredData.length === 0 && (
          <div className="w-full border border-white/60 overflow-clip rounded !text-sm">
            {filterDate && (
              <h4 className="text-sm p-4">
                No referral was made with your link on this date.
              </h4>
            )}
            {!filterDate && (
              <h4 className="text-sm p-4">
                No one has used your referral link yet or no data for selected
                date.
              </h4>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
