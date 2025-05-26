import { decrypt, encrypt } from "../libs/encryption";

type JournalPayload = {
  title: string;
  body: string;
  alternative: string;
  challenge: string;
  cognitiveDistortionIds: string[];
};

type Config = {
  encryptionKey: string;
};

export const extractJournal = (payload: any, config: Config) => {
  const title = decrypt(
    {
      data: payload?.title?.data,
      iv: payload?.title?.iv,
      authTag: payload?.title?.authTag,
    },
    config.encryptionKey
  );

  const body = decrypt(
    {
      data: payload?.body?.data,
      iv: payload?.body?.iv,
      authTag: payload?.body?.authTag,
    },
    config.encryptionKey
  );

  const challenge = decrypt(
    {
      data: payload?.challenge?.data,
      iv: payload?.challenge?.iv,
      authTag: payload?.challenge?.authTag,
    },
    config.encryptionKey
  );

  const alternative = decrypt(
    {
      data: payload?.alternative?.data,
      iv: payload?.alternative?.iv,
      authTag: payload?.alternative?.authTag,
    },
    config.encryptionKey
  );

  return {
    title,
    body,
    alternative,
    challenge,
  };
};

export const buildJournalPayload = (
  {
    title = "",
    body = "",
    alternative = "",
    challenge = "",
    cognitiveDistortionIds = [],
  }: JournalPayload,
  config: Config
) => {
  const {
    data: encryptedTitle,
    iv: title_iv,
    authTag: title_authTag,
  } = encrypt(title, config?.encryptionKey!);

  const {
    data: encryptedBody,
    iv: body_iv,
    authTag: body_authTag,
  } = encrypt(body, config?.encryptionKey!);

  const {
    data: challengeData,
    iv: challenge_iv,
    authTag: challenge_authTag,
  } = encrypt(challenge, config?.encryptionKey!);

  const {
    data: alternativeData,
    iv: alternative_iv,
    authTag: alternative_authTag,
  } = encrypt(alternative, config?.encryptionKey!);

  return {
    title: encryptedTitle,
    body: encryptedBody,
    alternative: alternativeData,
    challenge: challengeData,
    cognitiveDistortionIds,
    encryptionMetadata: {
      title_iv,
      title_authTag,
      body_iv,
      body_authTag,
      challenge_iv,
      challenge_authTag,
      alternative_iv,
      alternative_authTag,
    },
  };
};
