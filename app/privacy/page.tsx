import { Card } from "@/components/ui/Card";
import { CONTACT_EMAIL, LEGAL_LAST_UPDATED } from "@/lib/siteConfig";

export const metadata = { title: "Privacy Policy" };

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6">
      <h1 className="text-3xl font-bold text-ocean-800 dark:text-sand-50">Privacy Policy</h1>
      <p className="mt-2 text-sm text-ocean-600 dark:text-ocean-200">
        Last updated: {LEGAL_LAST_UPDATED} — Draft. Have a local attorney review this
        before launch; it is not legal advice.
      </p>

      <Card className="mt-6 space-y-5 text-ocean-700 dark:text-sand-100">
        <section>
          <h2 className="text-lg font-bold text-ocean-800 dark:text-sand-50">
            What we collect
          </h2>
          <p className="mt-1">
            If you create an account: your email address and password (handled by our
            authentication provider, Supabase — we never see or store your raw password).
            If you save an address for alerts: that address and its approximate
            coordinates. If you turn on text alerts: your phone number.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ocean-800 dark:text-sand-50">
            Why we collect it
          </h2>
          <p className="mt-1">
            Solely to run the features you opt into: showing you a flood risk read for
            your saved address, and sending you flood alert emails or texts when you ask
            for them. We do not sell your data, and we do not use it for advertising.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ocean-800 dark:text-sand-50">
            Text message (SMS) alerts
          </h2>
          <p className="mt-1">
            If you opt into SMS alerts, you consent to receive automated flood-risk text
            messages at the number you provide. Message and data rates may apply.
            Message frequency varies with conditions. Reply STOP at any time to a text to
            opt out, or turn it off from your account page. We use a third-party provider
            (Twilio) to deliver texts; they process your phone number solely to send the
            message on our behalf.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ocean-800 dark:text-sand-50">
            Who we share data with
          </h2>
          <ul className="mt-1 list-disc space-y-1 pl-5">
            <li>
              <strong>Supabase</strong> — hosts our database and handles account login.
            </li>
            <li>
              <strong>Resend</strong> — delivers email alerts, if you opt in.
            </li>
            <li>
              <strong>Twilio</strong> — delivers text alerts, if you opt in.
            </li>
          </ul>
          <p className="mt-2">
            When you search an address, the address text you type is sent to
            OpenStreetMap&apos;s Nominatim geocoding service to look up coordinates — we
            don&apos;t send your name or account info with that request.
          </p>
          <p className="mt-2">
            If you sign in with Google or Apple instead of a password, that provider
            shares your name and email with us (via Supabase) so we can create your
            account — we don&apos;t receive your password or any other data from your
            Google or Apple account.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ocean-800 dark:text-sand-50">
            Your choices
          </h2>
          <p className="mt-1">
            You can remove a saved address, turn off any alert, or delete your account
            entirely from the account page at any time. Deleting your account removes
            your saved addresses and alert subscriptions.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ocean-800 dark:text-sand-50">
            Children&apos;s privacy
          </h2>
          <p className="mt-1">
            Skywatch VB is not directed at children under 13, and we don&apos;t knowingly
            collect account information from them.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-bold text-ocean-800 dark:text-sand-50">Contact</h2>
          <p className="mt-1">
            Questions about this policy or your data:{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </Card>
    </div>
  );
}
