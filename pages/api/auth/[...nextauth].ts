import CredentialsProvider from "next-auth/providers/credentials";
import NextAuth from "next-auth/next";
import { NextAuthOptions, User } from "next-auth";
import baseAxios from "../../../services";

const authOptions: NextAuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // The credentials is used to generate a suitable form on the sign in page.
      // You can specify whatever fields you are expecting to be submitted.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {},
      async authorize(credentials: any, req) {
        // Add logic here to look up the user from the credentials supplied
        // const user = credentials;
        const user = { id: 1, name: "J Smith", email: "jsmith@example.com" };
        // console.log("credentails", credentials);
        if (user) {
          // const res = await baseAxios.post("/admin/login", credentials);
          // console.log("res", res);

          // return res.data;
          return { email: credentials.email, jwt: "asdkfjklj" };

          // Any object returned will be saved in `user` property of the JWT
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          throw new Error("Invalid Credentials");

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
};

export default NextAuth(authOptions);
