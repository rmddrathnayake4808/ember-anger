import { lovable } from "@/integrations/lovable/index";
import { supabase } from "@/integrations/supabase/client";

type MedianGoogleResponse = {
  idToken?: string;
  error?: string;
  type?: "google";
};

type MedianWindow = Window & {
  median?: {
    socialLogin?: {
      google?: {
        login: (options: {
          callback: (response: MedianGoogleResponse) => void;
        }) => void;
      };
    };
  };
};

function isMedianApp() {
  return navigator.userAgent.toLowerCase().includes("median");
}

async function signInWithMedianGoogle() {
  const medianWindow = window as MedianWindow;
  const login = medianWindow.median?.socialLogin?.google?.login;

  if (!login) {
    throw new Error(
      "Google sign-in needs the Social Login plugin enabled in your Median app.",
    );
  }

  const idToken = await new Promise<string>((resolve, reject) => {
    login({
      callback: (response) => {
        if (response.error) {
          reject(new Error(response.error));
          return;
        }
        if (!response.idToken) {
          reject(new Error("Google did not return a sign-in token."));
          return;
        }
        resolve(response.idToken);
      },
    });
  });

  const { error } = await supabase.auth.signInWithIdToken({
    provider: "google",
    token: idToken,
  });

  if (error) throw error;
  return { redirected: false };
}

export async function signInWithGoogle() {
  if (isMedianApp()) return signInWithMedianGoogle();

  const result = await lovable.auth.signInWithOAuth("google", {
    redirect_uri: window.location.origin,
  });

  if (result.error) {
    throw result.error instanceof Error
      ? result.error
      : new Error("Google sign-in failed");
  }

  return { redirected: result.redirected };
}