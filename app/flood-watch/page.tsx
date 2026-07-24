import { FloodMapWithReports } from "@/components/flood-watch/FloodMapWithReports";
import { AddressSearch } from "@/components/flood-watch/AddressSearch";
import { AlertSignupForm } from "@/components/flood-watch/AlertSignupForm";
import { FloodReportsPanel } from "@/components/flood-watch/FloodReportsPanel";
import { Card } from "@/components/ui/Card";
import { getFloodGaugeStatus, getTidePredictionsToday } from "@/lib/noaa";
import { getActiveAlerts, getForecast } from "@/lib/nws";
import { assessRisk } from "@/lib/risk";
import { neighborhoods } from "@/data/neighborhoods";

export const metadata = {
  title: "Flood & Storm Watch",
};

const VB_CENTER = { lat: 36.8529, lng: -75.978 };

export default async function FloodWatchPage() {
  const [gauge, activeAlerts, tides, forecast] = await Promise.all([
    getFloodGaugeStatus(),
    getActiveAlerts(VB_CENTER.lat, VB_CENTER.lng),
    getTidePredictionsToday(),
    getForecast(VB_CENTER.lat, VB_CENTER.lng),
  ]);

  const neighborhoodRisks = neighborhoods.map((neighborhood) => ({
    neighborhood,
    level: assessRisk({ neighborhood, gauge, activeAlerts, forecast }).level,
  }));

  return (
    <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-wide text-ocean-600 dark:text-ocean-200">
        Flood & Storm Watch
      </p>
      <h1 className="mt-2 max-w-2xl text-3xl font-bold text-ocean-800 dark:text-sand-50 sm:text-4xl">
        Is my street at risk today?
      </h1>
      <p className="mt-3 max-w-2xl text-lg text-ocean-700 dark:text-sand-100">
        Search your address or neighborhood below for a plain-language read on
        today&apos;s flood risk, built from live NOAA tide gauge data and active
        National Weather Service alerts.
      </p>

      <div className="mt-8">
        <AddressSearch />
      </div>

      <div className="mt-10 grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <h2 className="text-xl font-bold text-ocean-800 dark:text-sand-50">
            Flood risk by neighborhood
          </h2>
          <p className="mt-1 text-sm text-ocean-600 dark:text-sand-200">
            Tap a dot for details. Colors combine the current tide gauge reading
            with each neighborhood&apos;s known flood sensitivity.
          </p>
          <div className="mt-4">
            <FloodMapWithReports neighborhoods={neighborhoodRisks} />
          </div>
          <p className="mt-2 text-xs text-ocean-500 dark:text-sand-300">
            Orange dots are flooding reported by neighbors — see below to add one.
          </p>
        </div>

        <Card>
          <p className="text-sm font-semibold uppercase tracking-wide text-ocean-600 dark:text-ocean-200">
            Sewells Point tide gauge
          </p>
          {gauge?.observed ? (
            <>
              <p className="mt-2 text-2xl font-bold text-ocean-800 dark:text-sand-50">
                {gauge.observed.stageFt.toFixed(1)} ft
              </p>
              <p className="text-sm text-ocean-600 dark:text-sand-200">
                Category: {gauge.observed.category.replace("_", " ")}
              </p>
            </>
          ) : (
            <p className="mt-2 text-ocean-600 dark:text-sand-200">
              Live NOAA data is temporarily unavailable.
            </p>
          )}

          {tides && tides.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-semibold text-ocean-700 dark:text-sand-100">
                Today&apos;s tides
              </p>
              <ul className="mt-1 space-y-1 text-sm text-ocean-600 dark:text-sand-200">
                {tides.map((t) => (
                  <li key={t.time}>
                    {t.type === "H" ? "High" : "Low"} tide {" "}
                    {new Date(t.time.replace(" ", "T")).toLocaleTimeString([], {
                      hour: "numeric",
                      minute: "2-digit",
                    })}{" "}
                    — {t.valueFt.toFixed(1)} ft
                  </li>
                ))}
              </ul>
            </div>
          )}

          {activeAlerts.length > 0 && (
            <div className="mt-4 rounded-xl bg-risk-high-bg p-3">
              <p className="text-sm font-semibold text-risk-high">
                {activeAlerts.length} active NWS alert{activeAlerts.length > 1 ? "s" : ""}
              </p>
            </div>
          )}
        </Card>
      </div>

      <div className="mt-14">
        <h2 className="text-xl font-bold text-ocean-800 dark:text-sand-50">
          See flooding? Tell your neighbors
        </h2>
        <p className="mt-1 max-w-2xl text-ocean-700 dark:text-sand-100">
          NOAA and the National Weather Service don&apos;t know about the
          intersection that always floods before anywhere else does — you do.
        </p>
        <div className="mt-4">
          <FloodReportsPanel />
        </div>
      </div>

      <div className="mt-14">
        <h2 className="text-xl font-bold text-ocean-800 dark:text-sand-50">
          Get alerts before the water rises
        </h2>
        <p className="mt-1 max-w-2xl text-ocean-700 dark:text-sand-100">
          Save an address and we&apos;ll let you know when flood risk crosses a
          threshold near you.
        </p>
        <div className="mt-4 max-w-lg">
          <AlertSignupForm />
        </div>
      </div>
    </div>
  );
}
