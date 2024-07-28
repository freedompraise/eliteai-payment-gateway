"use client";
import { CompactTable } from "@table-library/react-table-library/compact";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useTheme } from "@table-library/react-table-library/theme";
import { getTheme } from "@table-library/react-table-library/baseline";
import { toast } from "react-toastify";
import { ChevronLeft } from "lucide-react";

interface Params {
  setShowDashboard: React.Dispatch<React.SetStateAction<boolean>>;
  setAdminCode: React.Dispatch<React.SetStateAction<string>>;
}

export default function AdminDashboard({
  setShowDashboard,
  setAdminCode,
}: Params) {
  const [data, setData] = useState<{ full_name: string; referrals: string }[]>(
    []
  );
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
    async function getRows() {
      setIsLoading(true);
      try {
        const response = await fetch(`/api/get-row`);
        if (!response.ok) {
          setIsLoading(false);
          toast.error("Can't retrieve data at the moment");
        }
        const rowData = await response.json();
        const formattedData = rowData.map(
          (item: { name: string; referrals: string[] }) => ({
            full_name: item.name,
            referrals: item.referrals.join(", "),
          })
        );
        setData(formattedData);
        setIsLoading(false);
        // return formattedData;
      } catch (error) {
        console.error("Error fetching row:", error);
      }
    }

    if (data.length == 0) {
      getRows();
    }
  }, [data]);

  const COLUMNS = [
    { label: "full_name", renderCell: (item: any) => item.full_name },
    { label: "referrals", renderCell: (item: any) => item.referrals },
  ];
  console.log(data);

  return (
    <div className="h-screen w-screen fixed overflow-auto top-0 right-0 bg-black z-40">
      <div className="relative h-full w-full flex items-center justify-center py-10">
        <div className=" h-full w-full text-white bg-black px-4 md:px-[80px]">
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
            <div className="pb-4">
              <h2 className="">Referrals</h2>
            </div>

            {isLoading && (
              <h3 className="text-sm text-white/40">Loading data...</h3>
            )}
            {!isLoading && data && data.length > 0 && (
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

                {data &&
                  data.map((item, idx) => (
                    <div className="flex border-b border-b-white/60" key={idx}>
                      <div className="w-1/2 border-r border-r-white/60 p-3">
                        {item.full_name}
                      </div>
                      <div className="w-1/2 p-3">
                        {item.referrals}
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
            {(!isLoading && !data) ||
              (!isLoading && data.length == 0 && (
                <div className="w-3xl max-w-3xl border border-white/60 overflow-clip rounded !text-sm">
                  <h4 className="text-sm p-4">No one has made referrals yet</h4>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>

    // <h1>hello world</h1>
  );
}
