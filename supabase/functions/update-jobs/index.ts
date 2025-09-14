import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
);

// System user ID for imported jobs
const SYSTEM_USER_ID = Deno.env.get("SYSTEM_USER_ID")!;

serve(async (req) => {
  try {
    // Check the webhook secret
    const secret = req.headers.get("x-webhook-secret");
    if (secret !== Deno.env.get("WEBHOOK_SECRET")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
      });
    }

    const payload = await req.json();
    console.log("Webhook payload:", payload);

    const datasetId = payload.resource?.defaultDatasetId;
    if (!datasetId) {
      return new Response(
        JSON.stringify({ status: "ok", inserted: 0, message: "No datasetId found" }),
        { status: 200 }
      );
    }

    // Fetch all items from Apify dataset
    const response = await fetch(
      `https://api.apify.com/v2/datasets/${datasetId}/items?format=json&token=${Deno.env.get("APIFY_TOKEN")}`
    );
    const jobs: any[] = await response.json();
    console.log("Jobs fetched:", jobs.length);

    if (!jobs.length) {
      return new Response(
        JSON.stringify({ status: "ok", inserted: 0, message: "Dataset empty" }),
        { status: 200 }
      );
    }

    // Transform jobs into Supabase-ready rows
    const rows = jobs
      .map((job: any) => {
        if (!job.title || (!job.external_apply_url && !job.url)) {
          console.warn("Skipping job due to missing title or URL", job);
          return null;
        }

        const postedAtUTC = job.date_posted ? new Date(job.date_posted + "Z") : new Date();
        const createdAtUTC = job.date_created ? new Date(job.date_created + "Z") : new Date();

        // Salary formatting
        let salaryRange: string | null = null;
        if (job.salary_raw?.value) {
          const val = job.salary_raw.value;
          salaryRange = `${job.salary_raw.currency || ""} ${val.minValue ?? ""} - ${val.maxValue ?? ""} ${val.unitText || ""}`;
        } else if (job.ai_salary_currency && (job.ai_salary_minvalue || job.ai_salary_maxvalue)) {
          salaryRange = `${job.ai_salary_currency} ${job.ai_salary_minvalue ?? ""} - ${job.ai_salary_maxvalue ?? ""} ${job.ai_salary_unittext || ""}`;
        }

        return {
          user_id: SYSTEM_USER_ID,
          title: job.title,
          company: job.organization || null,
          country: Array.isArray(job.countries_derived) ? job.countries_derived[0] : null,
          location: Array.isArray(job.locations_derived) ? job.locations_derived.join(" | ") : null,
          type: job.employment_type?.[0]?.replace(/_/g, "-").toLowerCase() || job.ai_work_arrangement || null,
          description: job.description_text || null,
          requirements: job.ai_requirements_summary || null,
          salary_range: salaryRange,
          benefits: job.ai_benefits ? job.ai_benefits.join(", ") : null,
          application_url: job.external_apply_url || job.url,
          application_email: job.ai_hiring_manager_email_address || null,
          years_experience: job.ai_experience_level || null, // ← use this for filtering
          is_active: true,
          featured: false,
          expires_at: job.date_validthrough || null,
          posted_at: postedAtUTC.toISOString(),
          created_at: createdAtUTC.toISOString(),
          imported_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        };
      })
      .filter(Boolean) as any[];

    // Remove duplicates by application_url to prevent ON CONFLICT error
    const uniqueRows = rows.filter(
      (row, index, self) =>
        index === self.findIndex(r => r.application_url === row.application_url)
    );

    if (!uniqueRows.length) {
      return new Response(
        JSON.stringify({ status: "ok", inserted: 0, message: "No valid jobs to insert" }),
        { status: 200 }
      );
    }

    // Upsert into Supabase
    const { error } = await supabase.from("jobs").upsert(uniqueRows, {
      onConflict: ["application_url"],
    });

    if (error) throw error;

    return new Response(
      JSON.stringify({ status: "ok", inserted: uniqueRows.length }),
      { status: 200 }
    );
  } catch (err: any) {
    console.error("Error handling webhook:", err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500 });
  }
});
