import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import User from "@/models/user";
import bcrypt from "bcrypt";
import dbConnect from "./dbConnect";

export const authOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    CredentialsProvider({
      async authorize(credentials, req) {
        // connect to database
        dbConnect();

        // destructure email and password from credentials
        const { email, password } = credentials;

        // find user in database
        const user = await User.findOne({ email });

        if (!user) {
          throw new Error("Invalid email or password");
        }

        // if user is loggin in with other sign in methods
        if (!user.password) {
          throw new Error("Please login via the method used to signup");
        }

        // compare passwords
        const isPasswordMatched = await bcrypt.compare(password, user.password);

        if (!isPasswordMatched) {
          throw new Error("Invalid email or password");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    // save user if user logs in via social network
    // add additional user info to session

    async signIn({ user }) {
      // connect to database
      dbConnect();

      // destructure email from logged in user
      const { email } = user;

      // check for user in database
      let existingUser = await User.findOne({ email });

      // if logged in user does not exist in db, create new user in db
      if (!existingUser) {
        existingUser = await User.create({
          name: user.name,
          email: user.email,
          image: user.image,
        });
      }
      return true;
    },

    // add additional user info to the session using jwt
    jwt: async ({ token, user }) => {
      // find user in db by email
      const foundUserByEmail = await User.findOne({ email: token.email });

      // prvent password from being exposed
      foundUserByEmail.password = undefined;

      // update token with found user data
      token.user = foundUserByEmail;

      return token;
    },

    session: async ({ session, token }) => {
      // update session with user from token
      session.user = token.user;
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/login",
  },
};
