import CredentialsProvider from "next-auth/providers/credentials";
import { supabase } from "./supabase";

export const authOptions = {
  session: {
    strategy: "jwt"
  },
  pages: {
    signIn: "/login"
  },
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "Username",
          type: "text",
          placeholder: "email@domain.com"
        },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          const response = await fetch(
            `${process.env.NEXTAUTH_URL}/api/users`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                user: credentials.username,
                password: credentials.password
              })
            }
          );

          const data = await response.json();

          return data.user;
        } catch (e) {
          console.log("error:", e);
        }

        return null;
      }
    })
  ],
  callbacks: {
    async session({ session }) {
      const { user } = session;
      const { data, error } = await supabase
        .from("users")
        .select("*, users_roles(role_id(*))")
        .eq("email", user.email)
        .single();

      session.user = {
        ...user,
        id: data.id,
        name: data.name,
        email: data.email,
        roleId: data.users_roles[0].role_id.id,
        roleName: data.users_roles[0].role_id.name
      };
      delete session.user.image;
      return session;
    }
  }
};
