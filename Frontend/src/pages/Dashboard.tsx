import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Calendar, TrendingUp, Users, Music } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import ConcertCard from "../components/ConcertCard";
import LoadingSpinner from "../components/LoadingSpinner";
import axios from "axios";

// Mock data - replace with actual API calls
const mockConcerts = [
  {
    id: 1,
    title: "Rock Festival 2024",
    artist: "The Rockers",
    venue: "Madison Square Garden",
    date: "2024-06-15T20:00:00Z",
    price: 150.0,
    total_seats: 5000,
    available_seats: 4850,
    description:
      "An amazing rock festival featuring top artists from around the world. Experience the energy and excitement of live rock music.",
    image_url:
      "https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg",
  },
  {
    id: 2,
    title: "Jazz Night",
    artist: "Smooth Jazz Collective",
    venue: "Blue Note",
    date: "2024-06-20T19:30:00Z",
    price: 85.0,
    total_seats: 300,
    available_seats: 275,
    description:
      "Intimate jazz performance in a classic venue. Enjoy smooth melodies and sophisticated rhythms in an elegant setting.",
    image_url:
      "https://images.pexels.com/photos/1047442/pexels-photo-1047442.jpeg",
  },
  {
    id: 3,
    title: "Electronic Beats",
    artist: "DJ Pulse",
    venue: "Electric Arena",
    date: "2024-06-25T22:00:00Z",
    price: 120.0,
    total_seats: 2000,
    available_seats: 1900,
    description:
      "High-energy electronic music experience with cutting-edge sound and visual effects. Dance the night away.",
    image_url:
      "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg",
  },
  {
    id: 4,
    title: "Classical Symphony",
    artist: "City Orchestra",
    venue: "Concert Hall",
    date: "2024-07-01T19:00:00Z",
    price: 95.0,
    total_seats: 800,
    available_seats: 750,
    description:
      "Beautiful classical music performance featuring timeless compositions. Experience the elegance of orchestral music.",
    image_url:
      "https://images.pexels.com/photos/164821/pexels-photo-164821.jpeg",
  },
];

const Dashboard: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
    }
  }, [isAuthenticated, navigate]);

  const API_BASE_URL = import.meta.env.VITE_AUTH_API_BASE_URL_BOOKING_DEV;

  const { data: concerts, isLoading } = useQuery({
    queryKey: ["concerts"],
    queryFn: async () => {
      const response = await axios.get(`${API_BASE_URL}concerts`);
      return response.data;
    },
  });

  if (isLoading) {
    return <LoadingSpinner />;
  }

  console.log(concerts);

  // const stats = [
  //   {
  //     name: "Total Concerts",
  //     value: concerts?.length || 0,
  //     icon: Music,
  //     color: "from-purple-500 to-pink-500",
  //   },
  //   {
  //     name: "This Month",
  //     value:
  //       concerts?.filter(
  //         (c) => new Date(c.date).getMonth() === new Date().getMonth()
  //       ).length || 0,
  //     icon: Calendar,
  //     color: "from-blue-500 to-cyan-500",
  //   },
  //   {
  //     name: "Available Seats",
  //     value: concerts?.reduce((sum, c) => sum + c.available_seats, 0) || 0,
  //     icon: Users,
  //     color: "from-green-500 to-emerald-500",
  //   },
  //   {
  //     name: "Trending",
  //     value:
  //       concerts?.filter((c) => c.available_seats / c.total_seats < 0.5)
  //         .length || 0,
  //     icon: TrendingUp,
  //     color: "from-orange-500 to-red-500",
  //   },
  // ];

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-2">
            Concert Dashboard
          </h1>
          <p className="text-gray-300">Discover and book amazing concerts</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {/* {stats.map((stat) => (
            <div
              key={stat.name}
              className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20 hover:bg-white/20 transition-all duration-300"
            >
              <div className="flex items-center">
                <div
                  className={`p-3 rounded-lg bg-gradient-to-r ${stat.color}`}
                >
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-300">
                    {stat.name}
                  </p>
                  <p className="text-2xl font-semibold text-white">
                    {stat.value}
                  </p>
                </div>
              </div>
            </div>
          ))} */}
        </div>

        {/* Concerts Grid */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">
            Upcoming Concerts
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {/* {concerts?.map((concert) => (
              <ConcertCard key={concert.id} concert={concert} />
            ))} */}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
