import { auth } from "@/auth";

export interface AuthSession {
  accessToken: string;
  user: {
    name?: string | null;
    email: string;
    image?: string | null;
  };
}

export async function getAuthSession(): Promise<AuthSession | null> {
  const session = await auth();
  if (!session) return null;

  const accessToken = (session as unknown as { accessToken: string }).accessToken;
  if (!accessToken) return null;

  if (!session.user?.email) return null;

  return {
    accessToken,
    user: {
      name: session.user.name,
      email: session.user.email,
      image: session.user.image,
    },
  };
}
