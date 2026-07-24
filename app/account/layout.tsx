// The account page is a client component, so its title lives here.
export const metadata = {
  title: "My Account",
  description: "Manage your saved addresses and flood alert subscriptions.",
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return children;
}
