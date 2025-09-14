import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";

export const useFetchJobs = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchJobs = useCallback(
    async (
      titleSearch: string[] = [""],
      maximumJobs: number = 50,
      onJobsFetched?: (jobs: any[]) => void
    ) => {
      setIsLoading(true);
      setError(null);

      const url = `https://api.apify.com/v2/acts/fantastic-jobs~advanced-linkedin-job-search-api/runs?token=${
        import.meta.env.VITE_APIFY_API_TOKEN
      }`;

      try {
        // 1. Trigger Apify Actor run
        const runResponse = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            memoryMbytes: 512,
            timeoutSecs: 600,
            build: "latest",
            input: {
              // ✅ Use the correct actor input keys
              searchQueries: titleSearch,
              resultsLimit: maximumJobs, // ✅ Actor respects this field
              onlyVisaSponsorshipJobs: true,
            },
          }),
        });

        const runData = await runResponse.json();
        const runId = runData.data?.id;
        const datasetId = runData.data?.defaultDatasetId;

        if (!runId || !datasetId) {
          throw new Error("Failed to start Apify job: missing runId or datasetId");
        }

        // 2. Poll until run is finished
        let runStatus = "RUNNING";
        while (runStatus === "RUNNING" || runStatus === "READY") {
          await new Promise((res) => setTimeout(res, 5000)); // wait 5 sec

          const statusResponse = await fetch(
            `https://api.apify.com/v2/acts/fantastic-jobs~advanced-linkedin-job-search-api/runs/${runId}?token=${
              import.meta.env.VITE_APIFY_API_TOKEN
            }`
          );

          const statusData = await statusResponse.json();

          if (!statusData.data || !statusData.data.status) {
            throw new Error("Failed to get run status from Apify");
          }

          runStatus = statusData.data.status;

          if (runStatus === "FAILED" || runStatus === "ABORTED") {
            throw new Error(`Apify run failed with status: ${runStatus}`);
          }

          console.log("Current run status:", runStatus);
        }

        // 3. Check dataset size after completion
        const datasetInfo = await fetch(
          `https://api.apify.com/v2/datasets/${datasetId}?token=${import.meta.env.VITE_APIFY_API_TOKEN}`
        );
        const datasetData = await datasetInfo.json();
        console.log("Total items in dataset:", datasetData.data.itemCount);

        // 4. Fetch all jobs using pagination
        const PAGE_SIZE = 100;
        let allJobs: any[] = [];
        let offset = 0;

        while (true) {
          const jobsResponse = await fetch(
  `https://api.apify.com/v2/datasets/${datasetId}/items?token=${
    import.meta.env.VITE_APIFY_API_TOKEN
  }&format=json&clean=true&desc=false&offset=0&limit=1000`
);

          const jobsBatch = await jobsResponse.json();
          if (jobsBatch.length === 0) break;

          allJobs = [...allJobs, ...jobsBatch];
          if (allJobs.length >= maximumJobs) break;

          offset += PAGE_SIZE;
        }

        console.log("Fetched jobs:", allJobs.length);

        const jobs = allJobs.slice(0, maximumJobs);

        if (onJobsFetched) onJobsFetched(jobs);
      } catch (err: any) {
        console.error("Error fetching jobs:", err);
        setError(err.message || "Unknown error");
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  return { fetchJobs, isLoading, error };
};

// import { useState, useCallback } from "react";

// export const useFetchJobs = () => {
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState<string | null>(null);

//   const fetchJobs = useCallback(
//     async (
//       titleSearch: string[] = [""],
//       maximumJobs: number = 50,
//       onJobsFetched?: (jobs: any[]) => void
//     ) => {
//       setIsLoading(true);
//       setError(null);

//       try {
//         // ✅ Run the actor
//         const runResponse = await fetch(
//           `https://api.apify.com/v2/acts/fantastic-jobs~advanced-linkedin-job-search-api/run-sync?token=${
//             import.meta.env.VITE_APIFY_API_TOKEN
//           }`,
//           {
//             method: "POST",
//             headers: { "Content-Type": "application/json" },
//             body: JSON.stringify({
//               searchQueries: titleSearch,
//               resultsLimit: maximumJobs,
//               onlyVisaSponsorshipJobs: true,
//               memoryMbytes: 512,
//               timeoutSecs: 600,
//             }),
//           }
//         );

//         if (!runResponse.ok) {
//           let errorMsg = "Failed to fetch jobs";
//           try {
//             const errData = await runResponse.json();
//             errorMsg = errData.error?.message || errorMsg;
//           } catch {
//             // If there's no JSON body, fallback to text
//             const errText = await runResponse.text();
//             errorMsg = errText || errorMsg;
//           }
//           throw new Error(errorMsg);
//         }

//         const runData = await runResponse.json();
//         const datasetId = runData.data.defaultDatasetId;

//         if (!datasetId) {
//           throw new Error("Dataset ID not found. Try again later.");
//         }

//         // ✅ Fetch dataset items with safe parsing
//         const datasetResponse = await fetch(
//           `https://api.apify.com/v2/datasets/${datasetId}/items?token=${
//             import.meta.env.VITE_APIFY_API_TOKEN
//           }&limit=${maximumJobs}`
//         );

//         // If response is empty, fallback gracefully
//         const text = await datasetResponse.text();
//         const jobs = text ? JSON.parse(text) : [];

//         if (onJobsFetched) onJobsFetched(jobs);
//       } catch (err: any) {
//         console.error("Error fetching jobs:", err);
//         setError(err.message || "Unknown error");
//       } finally {
//         setIsLoading(false);
//       }
//     },
//     []
//   );

//   return { fetchJobs, isLoading, error };
// };

