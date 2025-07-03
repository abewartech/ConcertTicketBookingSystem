import create from 'zustand'
import { ILoginResponse } from '@/models/auth'
import { persist } from 'zustand/middleware'

interface AuthState extends ILoginResponse {
  authState: boolean;
  setAuthStateZustand: (authState: boolean) => void;
  setToken: (token: string) => void;
  setData: (data: Partial<ILoginResponse['user']>) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      authState: false,
      token: '',
      user: {
        _id: '',
        firstName: '',
        password: '',
        username: '',
        email: '',
        createdAt: '',
        updatedAt: '',
        role: 0,
      },
      setAuthStateZustand: (authState: boolean) => set({ authState }),
      setToken: (token: string) => {
        set({ token })
      },
      setData: (data: Partial<ILoginResponse['user']>) => set((state) => ({ user: { ...state.user, ...data } })),
    }),
    {
      name: 'authStateZustand',
    },
  ),
)

export default useAuthStore
