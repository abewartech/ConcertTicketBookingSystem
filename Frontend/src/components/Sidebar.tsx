import Link from "next/link";
import styles from "./../styles/Sidebar.module.css";
import { useRouter } from "next/router";
import useAuthStore from '@/stores/authStore';

export default function Sidebar() {
  const router = useRouter();
  const { setAuthStateZustand, setToken, setData } = useAuthStore();
  const routes = [
    {
      name: "User",
      path: "/dashboard/user",
    },
    {
      name: "Event",
      path: "/dashboard/event",
    },
    {
      name: "Vendor",
      path: "/dashboard/vendor",
    },
  ];

  const handleLogout = () => {
    setAuthStateZustand(false);
    setToken('');
    setData({});
    localStorage.removeItem('user');
    router.push("/");
  };

  return (
    <div className={styles.sidebar}>
      <div>
        <div className={styles.sidebarHeader}>
          <h4>Wellness Hub</h4>
        </div>
        <div className={styles.sidebarContent}>
          {routes.map((route) => (
            <Link className={styles.sidebarMenu} href={route.path} key={route.name}>
              {route.name}
            </Link>
          ))}
        </div>
      </div>
      <div className={styles.sidebarFooter}>
        <div onClick={handleLogout}>Logout</div>
      </div>
    </div>
  );
}
