import prisma from "../db";
import { comparePassword, createJWT, hashPassword } from "../utils/auth";

const GOOGLE_OAUTH_URL = process.env.GOOGLE_OAUTH_URL;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const GOOGLE_ACCESS_TOKEN_URL = process.env.GOOGLE_ACCESS_TOKEN_URL;

const GOOGLE_CALLBACK_URL = "https://localhost:3000/auth/google/callback";
const GOOGLE_OAUTH_SCOPES = [
  "https%3A//www.googleapis.com/auth/userinfo.email",
  "https%3A//www.googleapis.com/auth/userinfo.profile",
];

/**
 * GOOGLE OAUTH FLOW
 */

const fetchAccessToken = async (code) => {
  const data = {
    code,
    client_id: GOOGLE_CLIENT_ID,
    client_secret: GOOGLE_CLIENT_SECRET,
    redirect_uri: GOOGLE_CALLBACK_URL,
    grant_type: "authorization_code",
  };

  const response = await fetch(GOOGLE_ACCESS_TOKEN_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    console.log("error response", response);
    throw new Error(`Failed to fetch access token: ${response.statusText}`);
  }

  const accessTokenData: any = await response.json();

  return accessTokenData.id_token;
};

const fetchUserInfo = async (idToken) => {
  const response = await fetch(
    `${process.env.GOOGLE_TOKEN_INFO_URL}?id_token=${idToken}`
  );

  if (!response.ok) {
    throw new Error(`Failed to fetch user info: ${response.statusText}`);
  }

  return await response.json();
};

export const googleSignIn = async (req: any, res: any, next: any) => {
  const state = "some_state";
  const scopes = GOOGLE_OAUTH_SCOPES.join(" ");
  const GOOGLE_OAUTH_CONSENT_SCREEN_URL = `${GOOGLE_OAUTH_URL}?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${GOOGLE_CALLBACK_URL}&access_type=offline&response_type=code&state=${state}&scope=${scopes}`;

  res.redirect(GOOGLE_OAUTH_CONSENT_SCREEN_URL);
};

export const googleSignInCallback = async (req, res) => {
  try {
    const code = req.query.code;

    const idToken: any = await fetchAccessToken(code);
    const userInfo: any = await fetchUserInfo(idToken);

    let user = await prisma.player.findUnique({
      where: {
        email: userInfo.email,
      },
    });

    if (!user) {
      user = await prisma.player.create({
        data: {
          email: userInfo.email,
          username: userInfo.given_name,
        },
      });
    }

    const token = createJWT(user);
    // res.status(200).json({ token });

    res.redirect(`${process.env.FRONTEND_URL}/auth/login?token=${token}`);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

/**
 * PLAYER HANDLERS
 */

export const createPlayer = async (req: any, res: any, next: any) => {
  try {
    const user = await prisma.player.create({
      data: {
        email: req.body.email,
        username: req.body.username,
        password: await hashPassword(req.body.password),
      },
    });
    const token = createJWT(user);
    res.json({ token });
  } catch (err: any) {
    err.type = "input";
    next(err);
  }
};

export const getPlayerProfile = async (req: any, res: any, next: any) => {
  try {
    const user = await prisma.player.findUnique({
      where: {
        id: req.user.id,
      },
    });

    res.json({
      profile: { id: user?.id, username: user?.username, email: user?.email },
    });
  } catch (error) {
    next(error);
  }
};

export const signIn = async (req: any, res: any, next: any) => {
  try {
    const user = await prisma.player.findUnique({
      where: {
        email: req.body.email,
      },
    });
    const isValid = await comparePassword(req.body.password, user?.password!);
    if (!isValid) {
      res.status(401).json({ message: "nope" });
      return;
    }
    const token = createJWT(user);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};
