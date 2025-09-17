import { getUserData } from "@/app/actions/users";
import EditUser from "./EditUser";
import Link from "next/link";

export default async function UserPage({ params }) {
  const { id } = await params;
  const user = await getUserData(id);

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <div>
      <div className="mb-4 flex flex-row justify-between">
        <Link
          className="flex flex-row items-center gap-2"
          href="/private/users"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="size-6"
          >
            <path
              fillRule="evenodd"
              d="M11.03 3.97a.75.75 0 0 1 0 1.06l-6.22 6.22H21a.75.75 0 0 1 0 1.5H4.81l6.22 6.22a.75.75 0 1 1-1.06 1.06l-7.5-7.5a.75.75 0 0 1 0-1.06l7.5-7.5a.75.75 0 0 1 1.06 0Z"
              clipRule="evenodd"
            />
          </svg>
          Volver
        </Link>
      </div>
      <EditUser user={user} />
    </div>
  );
}
