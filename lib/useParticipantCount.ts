"use client";

import { useEffect, useState } from "react";
import { QUIZ_RESULTS_TABLE, supabase } from "@/lib/supabase";

const BASE_COUNT = 842;

export function useParticipantCount() {
  const [count, setCount] = useState<number>(BASE_COUNT);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    async function fetchCount() {
      const { count: rowCount, error } = await supabase
        .from(QUIZ_RESULTS_TABLE)
        .select("*", { count: "exact", head: true });

      if (!isMounted) return;

      if (!error && typeof rowCount === "number") {
        setCount(BASE_COUNT + rowCount);
      }
      setLoading(false);
    }

    fetchCount();

    const channel = supabase
      .channel("quiz_results_realtime")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: QUIZ_RESULTS_TABLE },
        () => {
          setCount((prev) => prev + 1);
        }
      )
      .subscribe();

    return () => {
      isMounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return { count, loading };
}
