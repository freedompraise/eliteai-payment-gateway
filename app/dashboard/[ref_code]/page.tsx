"use client";
import { CompactTable } from "@table-library/react-table-library/compact";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { toast } from "react-toastify";

export default function Dashboard() {
  const [data, setData] = useState<
    Array<{ full_name: string; program: string; registration_date: string }>
  >([]);
  const { ref_code } = useParams<{ ref_code: string }>();
  const [isLoading, setIsLoading] = useState(true);

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
    async function getRowById() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/get-row/${ref_code}`);
        if (!response.ok) {
          setIsLoading(false);
          toast.error("Can't retrieve data at the moment");
          return;
        }
        const rowData: string[][] = await response.json();
        console.log("row data: ", rowData);
        const formattedData = rowData.map((item: string[]) => ({
          full_name: item[1],
          program: item[6],
          registration_date: item[12],
        }));
        setData(formattedData);
        setIsLoading(false);
        return formattedData;
      } catch (error) {
        console.error("Error fetching row:", error);
      }
    }

    if (data.length == 0) {
      getRowById();
    }
  }, [data]);

  const COLUMNS = [
    { label: "full_name", renderCell: (item: any) => item.full_name },
    { label: "program", renderCell: (item: any) => item.program },
    {
      label: "registration_date",
      renderCell: (item: any) => item.registration_date,
    },
  ];

  return (
    <div className=" min-h-[100vh] text-white py-10 bg-black px-4 md:px-[80px]">
      <h1 className="text-xl pb-10 font-semibold text-white/70">Dashboard</h1>
      <div className="p-4 bg-white/5 rounded border border-accent/10">
        <div className="pb-4">
          <h2 className="">Referrals</h2>
        </div>

        {isLoading && (
          <h3 className="text-sm text-white/40">Loading data...</h3>
        )}
        {!isLoading && data && data.length > 0 && (
          <div className="w-full border border-white/60 overflow-clip rounded !text-sm">
            <CompactTable
              columns={COLUMNS}
              data={{ nodes: data }}
              theme={theme}
            />
          </div>
        )}
        {(!isLoading && !data) ||
          (!isLoading && data.length == 0 && (
            <div className="w-3xl max-w-3xl border border-white/60 overflow-clip rounded !text-sm">
              <h4 className="text-sm p-4">
                No one has used your referral link yet
              </h4>
            </div>
          ))}
      </div>
    </div>
  );
}
