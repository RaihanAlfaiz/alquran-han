"use client";

import { useState, useEffect } from "react";
import { Moon, Sun, Sunrise, Sunset, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";

interface PrayerTimes {
  Fajr: string;
  Sunrise: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
}

export default function PrayerTimesWidget() {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [nextPrayer, setNextPrayer] = useState<{
    name: string;
    time: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  const [locationName, setLocationName] = useState("Jakarta, ID");

  useEffect(() => {
    async function fetchTimes() {
      try {
        const date = new Date();
        const y = date.getFullYear();
        const m = date.getMonth() + 1;
        const d = date.getDate();

        // Method 20 = Kemenag RI
        let url = `https://api.aladhan.com/v1/timingsByCity/${d}-${m}-${y}?city=Jakarta&country=ID&method=20`;

        if (navigator.geolocation) {
          try {
            const position = await new Promise<GeolocationPosition>(
              (resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                  timeout: 10000,
                });
              },
            );

            const { latitude, longitude } = position.coords;
            url = `https://api.aladhan.com/v1/timings/${d}-${m}-${y}?latitude=${latitude}&longitude=${longitude}&method=20`;
            setLocationName("Detected Location"); // Ideally reverse geocode this, but for now simple label
          } catch (geoError) {
            console.log("Geolocation blocked or failed, using default Jakarta");
          }
        }

        const res = await fetch(url);
        const data = await res.json();
        const timings = data.data.timings;

        if (data.data.meta) {
          // Try to get timezone or something better if available, but Aladhan by lat/long doesn't always return city name nicely in meta
          setLocationName(data.data.meta.timezone || "Local Time");
        }

        setTimes(timings);
        calculateNextPrayer(timings);
      } catch (error) {
        console.error("Prayer API Error:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchTimes();
  }, []);

  const calculateNextPrayer = (timings: any) => {
    const now = new Date();
    const currentTime = now.getHours() * 60 + now.getMinutes();

    const prayers = [
      { name: "Subuh", time: timings.Fajr },
      { name: "Dzuhur", time: timings.Dhuhr },
      { name: "Ashar", time: timings.Asr },
      { name: "Maghrib", time: timings.Maghrib },
      { name: "Isya", time: timings.Isha },
    ];

    for (const p of prayers) {
      const [h, m] = p.time.split(":").map(Number);
      const pTime = h * 60 + m;
      if (pTime > currentTime) {
        setNextPrayer(p);
        return;
      }
    }
    // If all passed, next is Subuh tomorrow
    setNextPrayer({ name: "Subuh", time: timings.Fajr });
  };

  if (loading)
    return <div className="animate-pulse bg-white/5 h-40 rounded-2xl w-full" />;

  if (!times) return null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="glass-card p-6 rounded-2xl border border-white/10 relative overflow-hidden"
    >
      {/* Background Accents */}
      <div className="absolute -right-10 -top-10 w-32 h-32 bg-indigo-500/20 blur-3xl rounded-full" />
      <div className="absolute -left-10 -bottom-10 w-32 h-32 bg-sky-500/20 blur-3xl rounded-full" />

      <div className="flex items-center justify-between mb-6 relative z-10">
        <div className="flex items-center gap-2 text-white/60 text-xs font-bold uppercase tracking-widest">
          <MapPin className="w-4 h-4 text-sky-400" />
          {locationName}
        </div>

        {nextPrayer && (
          <div className="px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-[10px] font-bold border border-indigo-500/30 whitespace-nowrap">
            Next: {nextPrayer.name} {nextPrayer.time}
          </div>
        )}
      </div>

      <div className="grid grid-cols-5 gap-2 text-center relative z-10">
        <PrayerItem
          name="Subuh"
          time={times.Fajr}
          icon={<Moon className="w-4 h-4" />}
          active={nextPrayer?.name === "Subuh"}
        />
        <PrayerItem
          name="Dzuhur"
          time={times.Dhuhr}
          icon={<Sun className="w-4 h-4" />}
          active={nextPrayer?.name === "Dzuhur"}
        />
        <PrayerItem
          name="Ashar"
          time={times.Asr}
          icon={<Sun className="w-4 h-4" />}
          active={nextPrayer?.name === "Ashar"}
        />
        <PrayerItem
          name="Maghrib"
          time={times.Maghrib}
          icon={<Sunset className="w-4 h-4" />}
          active={nextPrayer?.name === "Maghrib"}
        />
        <PrayerItem
          name="Isya"
          time={times.Isha}
          icon={<Moon className="w-4 h-4" />}
          active={nextPrayer?.name === "Isya"}
        />
      </div>
    </motion.div>
  );
}

function PrayerItem({
  name,
  time,
  icon,
  active,
}: {
  name: string;
  time: string;
  icon: any;
  active: boolean;
}) {
  return (
    <div
      className={`flex flex-col items-center gap-2 py-3 rounded-xl transition-all ${active ? "bg-white/10 border border-white/20 shadow-lg" : "hover:bg-white/5"}`}
    >
      <div className={`text-xs ${active ? "text-sky-400" : "text-white/40"}`}>
        {icon}
      </div>
      <span className="text-white font-bold text-sm tracking-wide">{time}</span>
      <span className="text-[10px] text-white/40 uppercase font-medium">
        {name}
      </span>
    </div>
  );
}
