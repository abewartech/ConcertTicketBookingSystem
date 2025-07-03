import { useEffect } from "react";
import Sidebar from "./Sidebar";
import useAuthStore from "@/stores/authStore";
import { useRouter } from "next/navigation";

export default function Layout({
  children,
  isSidebar,
}: {
  children: React.ReactNode;
  isSidebar: boolean;
}) {
  const { authState } = useAuthStore();
  const router = useRouter();
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("user");
    if (!authState && !user ) {
      router.push("/");
    }
  }, [authState]);
  return (
    <div className="d-flex">
      {isSidebar && <Sidebar />}
      <div className="flex-grow-1 py-4">{children}</div>
    </div>
  );
}
